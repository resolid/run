import { Outlet, useLocation } from '@resolid/run';
import { MDXProvider } from '@resolid/mdx';
import { AsideLayoutSide } from '~/common/components/AsideLayoutSide';
import { menus } from './menus';
import { mdxComponents } from './mdxComponents';
import { TocLayout } from '~/common/mdx/TocLayout';
import { AsideLayout } from '~/common/components/AsideLayout';
import { AsideLayoutMain } from '~/common/components/AsideLayoutMain';
import { headings } from './mdxDocuments';
import { createEffect, createSignal } from 'solid-js';
import type { TocItem } from '~/common/mdx/TocSection';

export default function Layout() {
  const location = useLocation();
  const [toc, setToc] = createSignal<TocItem[]>([]);

  createEffect(() => {
    const path = location.pathname.replace('/ui/', '');

    const docPath = path.includes('components/') ? `./content/${path}.mdx` : `./content/documents/${path}.mdx`;

    (async () => {
      setToc((await headings[docPath]?.()) ?? []);
    })();
  });

  return (
    <AsideLayout>
      <AsideLayoutSide menus={menus} />
      <AsideLayoutMain>
        <MDXProvider components={mdxComponents}>
          <TocLayout toc={toc}>
            <Outlet />
          </TocLayout>
        </MDXProvider>
      </AsideLayoutMain>
    </AsideLayout>
  );
}
