import { A, type LinkProps, Outlet } from '@resolid/run';
import { For, Show } from 'solid-js';
import { type Menu, menus } from '~/modules/ui/menus';

const MenuLink = (props: LinkProps) => {
  return <A {...props} />;
};

const MenuItem = (props: { menu: Menu; deep: number }) => {
  return (
    <li class={''}>
      {props.menu.path ? (
        <MenuLink
          class={`block py-1 pl-${props.deep * 2}`}
          activeClass={'bg-blue-50 text-blue-500'}
          inactiveClass={'hover:(text-gray-500 bg-gray-50) text-gray-600'}
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

export default function Layout() {
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
          <Outlet />
        </main>
      </div>
    </>
  );
}
