import { type PrimitiveProps } from '../../primitives';
import { splitProps } from 'solid-js';
import { type Size } from '../../utils/types';
import { Spinner } from '../spinner/Spinner';
import { cx } from '@resolid/twind';

export type ButtonSpinnerProps = {
  size: Size;
  label?: string;
  placement?: 'start' | 'end';
};

const SpinnerSizes: Record<string, Size> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

export const ButtonSpinner = (props: PrimitiveProps<'span', ButtonSpinnerProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'size', 'placement', 'children']);

  return (
    <span
      class={cx(
        'flex items-center',
        local.label ? 'relative' : 'absolute',
        local.placement == 'start' ? local.label && 'mr-2' : local.label && 'ml-2',
        local.class
      )}
      {...rest}
    >
      {local.children || <Spinner size={SpinnerSizes[local.size]} />}
    </span>
  );
};
