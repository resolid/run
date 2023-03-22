import type { JSX } from 'solid-js';
import type {
  CustomPointerEvent,
  InViewOptions,
  MotionEvent,
  MotionKeyframesDefinition,
  ValueKeyframesDefinition,
  ViewEvent,
} from '@motionone/dom';
import type { AnimationOptions } from '@motionone/types';

export type SolidCSSPropertyKeys = Exclude<
  keyof {
    [K in keyof JSX.CSSProperties as string extends K ? never : K]: never;
  },
  'transition'
>;

export type AnimationOptionsWithOverrides = AnimationOptions & {
  [K in keyof KeyframesDefinition]: AnimationOptions;
};

export type KeyframesDefinition = MotionKeyframesDefinition & {
  [K in SolidCSSPropertyKeys]?: ValueKeyframesDefinition;
};

export type Variant = KeyframesDefinition & {
  transition?: AnimationOptionsWithOverrides;
};

export type VariantDefinition = string | Variant;

export type MotionEventHandlers = {
  onMotionStart?: (event: MotionEvent) => void;
  onMotionComplete?: (event: MotionEvent) => void;
  onHoverStart?: (event: CustomPointerEvent) => void;
  onHoverEnd?: (event: CustomPointerEvent) => void;
  onPressStart?: (event: CustomPointerEvent) => void;
  onPressEnd?: (event: CustomPointerEvent) => void;
  onViewEnter?: (event: ViewEvent) => void;
  onViewLeave?: (event: ViewEvent) => void;
};

export type MotionOptions = {
  initial?: false | VariantDefinition;
  animate?: VariantDefinition;
  inView?: VariantDefinition;
  hover?: VariantDefinition;
  press?: VariantDefinition;
  exit?: VariantDefinition;
  variants?: Record<string, Variant>;
  inViewOptions?: InViewOptions;
  transition?: AnimationOptionsWithOverrides;
};
