import { Outlet, useLocation } from '@resolid/run';
import { MDXProvider } from '@resolid/mdx';
import { AsideLayoutSide } from '~/common/components/AsideLayoutSide';
import { menus } from './menus';
import { mdxComponents } from './mdxComponents';
import { TocLayout } from '~/common/mdx/TocLayout';
import { AsideLayout } from '~/common/components/AsideLayout';
import { AsideLayoutMain } from '~/common/components/AsideLayoutMain';
import { headings } from './mdxDocuments';
import { createEffect, createSignal, Suspense } from 'solid-js';
import { type TocItem } from '~/common/mdx/TocSection';

export default function Layout() {
  const location = useLocation();
  const [toc, setToc] = createSignal<TocItem[]>([]);

  createEffect(() => {
    const path = location.pathname.replace('/docs/', '');
    const docPath = path.includes('/') ? `./content/${path}.mdx` : `/content/getting-started/${path}.mdx`;

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
