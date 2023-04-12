import { splitProps, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { createPolymorphic, mergeRefs, mergeStyle } from '../../primitives';
import { ParentContext, PresenceContext } from './MotionContext';
import type { MotionPreset } from './MotionPresets';
import { MotionPresets } from './MotionPresets';
import { createMotionOneState } from './primitives';
import type { MotionEventHandlers, MotionOptions } from './types';

export type MotionComponentProps = {
  /**
   * Motion Preset
   * @default 'fade'
   */
  motionPreset?: MotionPreset;

  /**
   * Motion Props @see https://motion.dev/solid/motion#props
   */
  motionProps?: MotionOptions;
};

export const getMotionProps = (
  motionPreset: MotionPreset,
  motionProps: MotionOptions | undefined
): MotionOptions | undefined => {
  return { ...MotionPresets[motionPreset], ...motionProps };
};

export type MotionProps = MotionEventHandlers & MotionOptions;

export const Motion = createPolymorphic<'div', MotionProps>((props) => {
  const [options, local, rest] = splitProps(
    props,
    ['initial', 'animate', 'inView', 'inViewOptions', 'hover', 'press', 'variants', 'transition', 'exit'],
    [
      'as',
      'ref',
      'style',
      'onMotionStart',
      'onMotionComplete',
      'onHoverStart',
      'onHoverEnd',
      'onPressStart',
      'onPressEnd',
      'onViewEnter',
      'onViewLeave',
    ]
  );

  const [state, style] = createMotionOneState(
    () => root,
    () => ({ ...options }),
    useContext(PresenceContext),
    useContext(ParentContext)
  );

  let root!: Element;

  return (
    <ParentContext.Provider value={state}>
      <Dynamic
        component={local.as || 'div'}
        ref={mergeRefs((el) => (root = el), local.ref)}
        style={local.style ? mergeStyle(local.style, style) : style}
        on:motionstart={local.onMotionStart}
        on:motioncomplete={local.onMotionComplete}
        on:hoverstart={local.onHoverStart}
        on:hoverend={local.onHoverEnd}
        on:pressstart={local.onPressStart}
        on:pressend={local.onPressEnd}
        on:viewenter={local.onViewEnter}
        on:viewleave={local.onViewLeave}
        {...rest}
      />
    </ParentContext.Provider>
  );
});
