import { useColorMode } from '@resolid/ui';
import { createSignal, onMount, Show } from 'solid-js';
import { Moon } from '~/common/icons/Moon';
import { Sun } from '~/common/icons/Sun';

export const ThemeSwitcher = () => {
  const { darkMode, setColorMode } = useColorMode();
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
  });

  return (
    <Show when={mounted()} fallback={<div class={'h-9 w-9'} />}>
      <button
        onClick={() => setColorMode(darkMode() ? 'light' : 'dark')}
        title={'Change Color Theme'}
        class={'p-2 hover:text-blue-500'}
      >
        <Show when={darkMode()} fallback={<Moon size={'sm'} />}>
          <Sun size={'sm'} />
        </Show>
      </button>
    </Show>
  );
};
