import type { JSX } from 'solid-js';
import { mergeProps, splitProps } from 'solid-js';
import { isNumber } from '@resolid/utils';

export type IconProps = JSX.SvgSVGAttributes<SVGSVGElement> & { size?: number | string };

export const Icon = (props: IconProps) => {
  const propsWithDefault = mergeProps(
    {
      'stroke-width': 2,
      'stroke-linecap': 'round' as IconProps['stroke-linecap'],
      'stroke-linejoin': 'round' as IconProps['stroke-linejoin'],
      size: '1em',
      class: '',
      stroke: 'currentColor',
      viewBox: '1 1 22 22',
      fill: 'none',
    },
    props
  );

  const [local, rest] = splitProps(propsWithDefault, ['size', 'class', 'children']);

  const sizeClassName = () =>
    isNumber(local.size) ? `h-${local.size} w-${local.size}` : `h-[${local.size}] w-[${local.size}]`;

  return (
    <svg class={`${sizeClassName()} ${local.class}`} xmlns="http://www.w3.org/2000/svg" {...rest}>
      {local.children}
    </svg>
  );
};
