import type { Accessor, ParentProps, Setter } from 'solid-js';
import { createContext, createEffect, createSignal, useContext } from 'solid-js';
import { createLocalStorage, createMediaQuery } from '../../hooks';

export type ColorMode = 'system' | 'light' | 'dark';

export type ColorModeContextValue = {
  darkMode: Accessor<boolean>;
  colorMode: Accessor<ColorMode>;
  setColorMode: Setter<ColorMode>;
};

export const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
export const COLOR_MODE_STORAGE_KEY = 'agile-run-color-mode';

const ColorModeContext = createContext<ColorModeContextValue>();

export const useColorMode = () => {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error('[Resolid]: useDarkMode must be used within an `<ResolidProvider />` component');
  }

  return context;
};

export const ColorModeProvider = (props: ParentProps) => {
  const darkOS = createMediaQuery(COLOR_SCHEME_QUERY);

  const [colorMode, setColorMode] = createLocalStorage<ColorMode>(COLOR_MODE_STORAGE_KEY, 'system');
  const [darkMode, setDarkMode] = createSignal<boolean>(darkOS());

  createEffect(() => {
    if (darkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  createEffect(() => {
    switch (colorMode()) {
      case 'light':
        setDarkMode(false);
        break;
      case 'system':
        setDarkMode(darkOS);
        break;
      case 'dark':
        setDarkMode(true);
        break;
    }
  });

  return (
    <ColorModeContext.Provider value={{ darkMode, colorMode, setColorMode }}>
      {props.children}
    </ColorModeContext.Provider>
  );
};
