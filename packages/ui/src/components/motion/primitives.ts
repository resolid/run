import { type MotionOptions } from './types';
import { createMotionState, createStyles, type MotionState } from '@motionone/dom';
import { type PresenceState } from './MotionContext';
import { type Accessor, createEffect, onCleanup, onMount } from 'solid-js';
// noinspection ES6PreferShortImport
import { isFunction } from '../../utils/function';

export const onCompleteExit = (el: Element, fn: VoidFunction) => el.addEventListener('motioncomplete', fn);

export const createMotionOneState = (
  el: () => Element,
  options: Accessor<MotionOptions>,
  presenceState?: PresenceState,
  parentState?: MotionState
) => {
  const state = createMotionState(
    presenceState?.() === false ? { ...options(), initial: false } : options(),
    parentState
  );

  onMount(() => {
    const unmount = state.mount(el());

    onCleanup(() => {
      if (presenceState && options().exit) {
        state.setActive('exit', true);
        onCompleteExit(el(), unmount);
      } else {
        unmount();
      }
    });
    isFunction(options) && createEffect(() => state.update(options()));
  });

  return [state, createStyles(state.getTarget())] as const;
};
