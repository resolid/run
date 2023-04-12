import { MDXProvider } from '@resolid/mdx';
import { Outlet, useLocation } from '@resolid/run';
import { Suspense, createEffect, createSignal } from 'solid-js';
import { AsideLayout } from '~/common/components/AsideLayout';
import { AsideLayoutMain } from '~/common/components/AsideLayoutMain';
import { AsideLayoutSide } from '~/common/components/AsideLayoutSide';
import { TocLayout } from '~/common/mdx/TocLayout';
import type { TocItem } from '~/common/mdx/TocSection';
import { mdxComponents } from './mdxComponents';
import { headings } from './mdxDocuments';
import { menus } from './menus';

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
            <Suspense>
              <Outlet />
            </Suspense>
          </TocLayout>
        </MDXProvider>
      </AsideLayoutMain>
    </AsideLayout>
  );
}
