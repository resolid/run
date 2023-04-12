import { mountedStates } from '@motionone/dom';
import { type FlowComponent } from 'solid-js';
import { createSwitchTransition, resolveFirst } from '../../primitives';
import { ParentContext, PresenceContext } from './MotionContext';
import { onCompleteExit } from './primitives';
import { type MotionOptions } from './types';

export const MotionPresence: FlowComponent<{
  initial?: boolean;
  exitBeforeEnter?: boolean;
}> = (props) => {
  // eslint-disable-next-line solid/reactivity
  let initial = props.initial !== false;

  const render = (
    <PresenceContext.Provider value={() => initial}>
      <ParentContext.Provider value={undefined}>
        <>
          {createSwitchTransition(
            // eslint-disable-next-line solid/reactivity
            resolveFirst(() => props.children),
            {
              appear: initial,
              mode: props.exitBeforeEnter ? 'out-in' : 'parallel',
              onExit(el, remove) {
                const state = mountedStates.get(el as Element);

                if (state && (state.getOptions() as MotionOptions).exit) {
                  onCompleteExit(el as Element, remove);
                } else {
                  remove();
                }
              },
            }
          )}
        </>
      </ParentContext.Provider>
    </PresenceContext.Provider>
  );

  initial = true;

  return render;
};
