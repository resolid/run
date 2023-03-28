import { Outlet, useLocation } from '@resolid/run';
import { MDXProvider } from 'solid-jsx';
import { AsideMenu } from '~/shared/AsideMenu';
import { menus } from './menus';
import { mdx } from './mdx';
import { TocLayout } from '~/shared/mdx/TocLayout';

export default function Layout() {
  const location = useLocation();

  const getMdxPath = () => {
    const path = location.pathname.replace('/docs/', '');

    return `content/${path}`;
  };

  return (
    <>
      <aside class={'w-60 fixed top-16 bottom-0 scrollbar-thin overflow-y-auto overflow-x-hidden overscroll-contain'}>
        <nav role={'navigation'}>
          <AsideMenu menus={menus} />
        </nav>
      </aside>
      <div class={'pl-60'}>
        <main class={'mx-auto h-full p-4'}>
          <MDXProvider components={mdx}>
            <TocLayout module={'docs'} path={getMdxPath()}>
              <Outlet />
            </TocLayout>
          </MDXProvider>
        </main>
      </div>
    </>
  );
}
