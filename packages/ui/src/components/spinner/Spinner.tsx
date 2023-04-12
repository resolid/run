import { cx } from '@resolid/utils';
import { mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { createPolymorphic } from '../../primitives';
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden';
import type { SpinnerVariants } from './Spinner.style';
import { spinnerVariants } from './Spinner.style';

export type SpinnerProps = SpinnerVariants & {
  /**
   * Label
   * @default 'Loading…'
   */
  label?: string;
};

export const Spinner = createPolymorphic<'span', SpinnerProps>((props) => {
  const propsWithDefault = mergeProps({ as: 'span', label: 'Loading' }, props);

  const [local, variants, rest] = splitProps(propsWithDefault, ['as', 'class', 'label', 'children'], ['size', 'color']);

  return (
    <Dynamic component={local.as} class={cx(spinnerVariants(variants), local.class)} {...rest}>
      <VisuallyHidden>{local.label}</VisuallyHidden>
    </Dynamic>
  );
});
