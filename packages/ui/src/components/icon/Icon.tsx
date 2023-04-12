import { isString } from '@resolid/utils';
import type { JSX } from 'solid-js';
import { mergeProps, splitProps } from 'solid-js';
import type { Size } from '../../utils/types';

export type IconProps = JSX.SvgSVGAttributes<SVGSVGElement> & { size?: Size | number };

const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
};

export const Icon = (props: IconProps) => {
  const propsWithDefault = mergeProps(
    {
      'stroke-width': 2,
      'stroke-linecap': 'round' as IconProps['stroke-linecap'],
      'stroke-linejoin': 'round' as IconProps['stroke-linejoin'],
      size: 'md',
      class: '',
      stroke: 'currentColor',
      viewBox: '1 1 22 22',
      fill: 'none',
    },
    props
  );

  const [local, rest] = splitProps(propsWithDefault, ['size', 'width', 'height', 'children']);

  const sizeValue = () => (isString(local.size) ? iconSizes[local.size as Size] : local.size);

  return (
    <svg
      width={local.width ?? sizeValue()}
      height={local.height ?? sizeValue()}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {local.children}
    </svg>
  );
};
