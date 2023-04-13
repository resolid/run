import { cx } from '@resolid/utils';
import { mergeProps, splitProps, type JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { createPolymorphic } from '../../primitives';
import { buttonVariants } from './Button.style';
import type { ButtonBaseProps } from './ButtonGroup';

export type ButtonProps = ButtonBaseProps & {
  type?: 'submit' | 'reset' | 'button';
  active?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  spinner?: JSX.Element;
  spinnerPlacement?: 'start' | 'end';
};

export const Button = createPolymorphic<'button', ButtonProps>((props) => {
  const propsWithDefault = mergeProps(
    { as: 'button', type: 'button', active: false, loading: false, fullWidth: false } as ButtonProps,
    props
  );

  const [local, variants, rest] = splitProps(
    propsWithDefault,
    ['as', 'ref', 'class', 'children', 'fullWidth', 'active', 'loading', 'spinner', 'spinnerPlacement'],
    ['color', 'size', 'variant']
  );

  return (
    <Dynamic component={local.as} class={cx('', buttonVariants(variants), local.class)} {...rest}>
      {local.children}
    </Dynamic>
  );
});
