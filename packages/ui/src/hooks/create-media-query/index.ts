import { type Accessor, createSignal } from 'solid-js';
import { createEventListener } from '../create-event-listener';

export const createMediaQuery = (query: string, fallbackState = false): Accessor<boolean> => {
  if (process.env.SSR) {
    return () => fallbackState;
  }

  const mql = window.matchMedia(query);

  const [state, setState] = createSignal(mql.matches);

  createEventListener('change', () => setState(mql.matches), mql);

  return state;
};
