import { createSignal, type Accessor } from 'solid-js';
import { isServer } from 'solid-js/web';
import { createEventListener } from '../create-event-listener';

export const createMediaQuery = (query: string, fallbackState = false): Accessor<boolean> => {
  if (isServer) {
    return () => fallbackState;
  }

  const mql = window.matchMedia(query);

  const [state, setState] = createSignal(mql.matches);

  createEventListener('change', () => setState(mql.matches), mql);

  return state;
};
