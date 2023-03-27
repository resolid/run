import { A, type LinkProps, Outlet, useLocation } from '@resolid/run';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { type Menu, menus } from '~/modules/ui/menus';
import { mdx } from '~/modules/ui/mdx';
import { MDXProvider } from 'solid-jsx';
import { TOCProvider, useTOC } from '~/shared/mdx/toc/TOCContext';
import { createEventListener } from '@resolid/ui';
import { cx } from '@resolid/twind';

const MenuLink = (props: LinkProps) => {
  return <A {...props} />;
};

const MenuItem = (props: { menu: Menu; deep: number }) => {
  return (
    <li class={''}>
      {props.menu.path ? (
        <MenuLink
          class={`block py-1 pl-${props.deep * 2}`}
          activeClass={'bg-blue-50 text-blue-600'}
          inactiveClass={'hover:bg-gray-100 active:bg-gray-200'}
          href={'/ui' + props.menu.path}
        >
          {props.menu.label}
        </MenuLink>
      ) : (
        <h5 class={props.deep > 1 ? `mb-1 font-normal text-gray-400 pl-${props.deep * 2}` : 'mb-2'}>
          {props.menu.label}
        </h5>
      )}
      <Show when={props.menu.children} keyed>
        <ul class={'space-y-1'}>
          <For each={props.menu.children} fallback={'Loading...'}>
            {(child) => <MenuItem deep={props.deep + 1} menu={child} />}
          </For>
        </ul>
      </Show>
    </li>
  );
};

const getActiveElement = (rects: DOMRect[]) => {
  if (rects.length == 0) {
    return -1;
  }

  const closest = rects.reduce(
    (acc, item, index) => {
      if (Math.abs(acc.position) < Math.abs(item.y)) {
        return acc;
      }

      return {
        index,
        position: item.y,
      };
    },
    { index: 0, position: rects[0].y }
  );

  return closest.index;
};

const Sections = () => {
  const { sections } = useTOC();

  const [active, setActive] = createSignal(0);

  createEventListener('scroll', () => {
    setActive(
      getActiveElement(
        sections()
          .map((item) => document.getElementById(item.href)?.getBoundingClientRect() || null)
          .filter((item) => item != null) as DOMRect[]
      )
    );
  });

  return (
    <ul class={'space-y-1 border-l border-gray-200 sticky top-20'}>
      <For each={sections()}>
        {(item, index) => (
          <li>
            <a
              class={cx(
                '-ml-px block pl-4 py-1 border-l',
                index() == active()
                  ? 'border-l-blue-300 text-blue-500'
                  : 'hover:(border-l-gray-300 text-gray-700) border-l-transparent text-gray-500'
              )}
              href={'#' + item.href}
            >
              {item.title}
            </a>
          </li>
        )}
      </For>
    </ul>
  );
};

export default function Layout() {
  const location = useLocation();

  createEffect(() => {
    console.log(location.pathname);
  });

  return (
    <>
      <aside class={'w-60 fixed top-16 bottom-0 scrollbar-thin overflow-y-auto overflow-x-hidden overscroll-contain'}>
        <nav role={'navigation'}>
          <ul class={'space-y-3 p-4'}>
            <For each={menus} fallback={'Loading...'}>
              {(menu) => <MenuItem menu={menu} deep={1} />}
            </For>
          </ul>
        </nav>
      </aside>
      <div class={'pl-60'}>
        <main class={'mx-auto h-full p-4'}>
          <TOCProvider>
            <MDXProvider components={mdx}>
              <div class={'flex justify-between'}>
                <article class={'w-full'}>
                  <Outlet />
                </article>
                <nav class={'hidden w-52 laptop:block'}>
                  <Sections />
                </nav>
              </div>
            </MDXProvider>
          </TOCProvider>
        </main>
      </div>
    </>
  );
}
