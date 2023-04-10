import { A } from '@resolid/run';
import { cx } from '@resolid/utils';
import { For, Show } from 'solid-js';
import { useAsideLayout } from '~/common/components/AsideLayout';
import { Close } from '~/common/icons/Close';

export type Menu = {
  label: string;
  path?: string;
  children?: Menu[];
};

const MenuItem = (props: { menu: Menu; depth: number }) => {
  const { setOpened } = useAsideLayout();

  return (
    <li class={''}>
      {props.menu.path ? (
        <A
          class={cx('block py-1 rounded', props.depth == 2 && 'ps-4')}
          activeClass={'bg-bg-accent'}
          inactiveClass={'hover:bg-bg-subtle active:bg-bg-muted'}
          href={props.menu.path}
          onClick={() => setOpened(false)}
        >
          {props.menu.label}
        </A>
      ) : (
        <h5 class={props.depth > 1 ? 'mb-1 ps-4 text-gray-400' : 'mb-2 font-medium'}>{props.menu.label}</h5>
      )}
      <Show when={props.menu.children} keyed>
        <ul class={'space-y-1'}>
          <For each={props.menu.children}>{(child) => <MenuItem depth={props.depth + 1} menu={child} />}</For>
        </ul>
      </Show>
    </li>
  );
};

export const AsideLayoutSide = (props: { menus: Menu[] }) => {
  const { opened, setOpened } = useAsideLayout();

  return (
    <aside
      class={cx(
        'scrollbar scrollbar-thin overflow-y-auto overflow-x-hidden overscroll-contain',
        'bg-bg-default fixed bottom-0 top-16 w-56 border-e',
        'tablet:z-0 z-10',
        'tablet:translate-x-0 transition-transform duration-200',
        opened() ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <nav role={'navigation'} class={'relative'}>
        <button
          title={'Close Navigation'}
          onClick={() => setOpened(false)}
          class={'tablet:hidden fixed end-3 top-3 p-2'}
        >
          <Close size={'xs'} />
        </button>
        <ul class={'space-y-3 p-4'}>
          <For each={props.menus}>{(menu) => <MenuItem menu={menu} depth={1} />}</For>
        </ul>
      </nav>
    </aside>
  );
};
