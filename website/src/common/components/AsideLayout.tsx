import { type Accessor, createContext, createSignal, type ParentProps, type Setter, useContext } from 'solid-js';
import { Menu } from '~/common/icons/Menu';

export type AsideLayoutContextValue = {
  opened: Accessor<boolean>;
  setOpened: Setter<boolean>;
};

const AsideLayoutContext = createContext<AsideLayoutContextValue>();

export const useAsideLayout = () => {
  const context = useContext(AsideLayoutContext);

  if (!context) {
    throw new Error('[Resolid]: useAsideLayout must be used within an `<AsideLayout />` component');
  }

  return context;
};

const AsideLayoutBar = () => {
  const { setOpened } = useAsideLayout();

  return (
    <div
      class={
        'tablet:hidden fixed z-10 flex h-12 w-full items-center justify-between border-b bg-white/75 px-2 backdrop-blur'
      }
    >
      <button title={'Open Navigation'} onClick={() => setOpened(true)} class={'flex items-center gap-1 p-2'}>
        <Menu size={'xs'} />
        <span>Menu</span>
      </button>
    </div>
  );
};

export const AsideLayout = (props: ParentProps) => {
  const [opened, setOpened] = createSignal<boolean>(false);

  return (
    <AsideLayoutContext.Provider value={{ opened, setOpened }}>
      <AsideLayoutBar />
      {props.children}
    </AsideLayoutContext.Provider>
  );
};
