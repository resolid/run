import { runIfFn, type MaybeFunction } from '@resolid/utils';
import type { Accessor, Setter } from 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import { isServer } from 'solid-js/web';
import { createEventListener } from '../create-event-listener';

export const createLocalStorage = <T>(key: string, initialValue: MaybeFunction<T>): [Accessor<T>, Setter<T>] => {
  const getStoredValue = () => {
    if (isServer) {
      return runIfFn(initialValue);
    }

    try {
      const item = localStorage.getItem(key);

      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn(`[Resolid]: Error reading ${key} in localStorage`);
    }

    return runIfFn(initialValue);
  };

  const [state, setState] = createSignal<T>(getStoredValue());

  createEffect(() => {
    const item = state();

    try {
      if (item != undefined) {
        localStorage.setItem(key, JSON.stringify(item));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`[Resolid]: Error writing ${key} to localStorage`);
    }
  });

  createEventListener('storage', (e: StorageEvent) => {
    if (e.key != key || e.storageArea != localStorage) {
      return;
    }

    setState(e.newValue ? JSON.parse(e.newValue) : undefined);
  });

  return [state, setState];
};
