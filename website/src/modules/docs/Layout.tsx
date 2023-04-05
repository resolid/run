import { Outlet } from '@resolid/run';
import { MDXProvider } from '@resolid/mdx';
import { AsideLayoutSide } from '~/common/components/AsideLayoutSide';
import { menus } from './menus';
import { mdxComponents } from './mdxComponents';
import { TocLayout } from '~/common/mdx/TocLayout';
import { AsideLayout } from '~/common/components/AsideLayout';
import { AsideLayoutMain } from '~/common/components/AsideLayoutMain';

export default function Layout() {
  return (
    <AsideLayout>
      <AsideLayoutSide menus={menus} />
      <AsideLayoutMain>
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
      </AsideLayoutMain>
    </AsideLayout>
  );
}
