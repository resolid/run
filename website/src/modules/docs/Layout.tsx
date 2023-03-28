import { Outlet, useLocation } from '@resolid/run';
import { MDXProvider } from 'solid-jsx';
import { TableOfContents } from '~/shared/mdx/TableOfContents';
import { AsideMenu } from '~/shared/AsideMenu';
import { menus } from './menus';
import { mdx } from './mdx';

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
            <div class={'flex justify-between'}>
              <article class={'w-full'}>
                <Outlet />
              </article>
              <nav class={'hidden w-52 laptop:block'}>
                <TableOfContents module={'docs'} path={getMdxPath()} />
              </nav>
            </div>
          </MDXProvider>
        </main>
      </div>
    </>
  );
}
