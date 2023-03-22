import type { MotionPreset } from './MotionPresets';
import { MotionPresets } from './MotionPresets';
import { type ComponentProps, splitProps, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { MotionEventHandlers, MotionOptions } from './types';
import { ParentContext, PresenceContext } from './MotionContext';
import { createMotionOneState } from './primitives';
import { combineStyle, mergeRefs } from '../../primitives';
import { type Merge } from '../../utils/types';

export type MotionComponentProps = {
  /**
   * 预设动画
   * @default 'fade'
   */
  motionPreset?: MotionPreset;

  /**
   * 动画属性 @see https://motion.dev/solid/motion#props
   */
  motionProps?: MotionOptions;
};

export const getMotionProps = (
  motionPreset: MotionPreset,
  motionProps: MotionOptions | undefined
): MotionOptions | undefined => {
  return { ...MotionPresets[motionPreset], ...motionProps };
};

export type MotionProps = Merge<ComponentProps<'div'>, MotionEventHandlers & MotionOptions>;

export const Motion = (
  props: MotionProps & {
    tag?: string;
  }
) => {
  const [options, local, rest] = splitProps(
    props,
    ['initial', 'animate', 'inView', 'inViewOptions', 'hover', 'press', 'variants', 'transition', 'exit'],
    [
      'tag',
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
        component={local.tag || 'div'}
        ref={mergeRefs((el) => (root = el), local.ref)}
        style={local.style ? combineStyle(local.style, style) : style}
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
};
