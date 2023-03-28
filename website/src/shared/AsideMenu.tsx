import { A, type LinkProps } from '@resolid/run';
import { For, Show } from 'solid-js';

export type Menu = {
  label: string;
  path?: string;
  children?: Menu[];
};

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
          <For each={props.menu.children}>{(child) => <MenuItem deep={props.deep + 1} menu={child} />}</For>
        </ul>
      </Show>
    </li>
  );
};

export const AsideMenu = (props: { menus: Menu[] }) => {
  return (
    <ul class={'space-y-3 p-4'}>
      <For each={props.menus}>{(menu) => <MenuItem menu={menu} deep={1} />}</For>
    </ul>
  );
};
