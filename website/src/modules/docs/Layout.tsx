import { Outlet } from '@resolid/run';
import { MDXProvider } from '@resolid/mdx';
import { AsideMenu } from '~/common/components/AsideMenu';
import { menus } from './menus';
import { mdxComponents } from './mdxComponents';
import { TocLayout } from '~/common/mdx/TocLayout';

export default function Layout() {
  return (
    <>
      <aside class={'scrollbar-thin fixed bottom-0 top-16 w-60 overflow-y-auto overflow-x-hidden overscroll-contain'}>
        <nav role={'navigation'}>
          <AsideMenu menus={menus} />
        </nav>
      </aside>
      <div class={'pl-60'}>
        <main class={'mx-auto h-full p-4'}>
          <MDXProvider components={mdxComponents}>
            <TocLayout
              getMdxPath={(pathname: string) => {
                const path = pathname.replace('/run/', '');

                return `run/content/${path}`;
              }}
            >
              <Outlet />
            </TocLayout>
          </MDXProvider>
        </main>
      </div>
    </>
  );
}
