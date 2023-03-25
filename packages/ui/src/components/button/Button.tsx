import { type ButtonBaseProps, useButtonGroup } from './ButtonGroupContext';
import { type NumberSize } from '../../utils/types';
import { createMemo, type JSX, mergeProps, Show, splitProps } from 'solid-js';
import { createPolymorphic, mergeRefs } from '../../primitives';
import { isNumber } from '@resolid/utils';
import { cx } from '@resolid/twind';
import { ButtonSpinner } from './ButtonSpinner';
import { Dynamic } from 'solid-js/web';
import { createTagName } from '../../hooks';

export type ButtonProps = ButtonBaseProps & {
  /**
   * 边框圆角
   * @default 'md'
   */
  radius?: NumberSize;

  /**
   * 类型
   * @default 'button'
   */
  type?: 'submit' | 'reset' | 'button';

  /**
   * 是否激活
   * @default false
   */
  active?: boolean;

  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean;

  /**
   * 加载文本
   */
  loadingText?: string;

  /**
   * 是否全宽度
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 加载器
   */
  spinner?: JSX.Element;

  /**
   * 加载器位置
   * @default 'start'
   */
  spinnerPlacement?: 'start' | 'end';
};

const buttonSizes = {
  xs: 'h-6 px-3 text-sm',
  sm: 'h-7 px-4',
  md: 'h-8 px-5',
  lg: 'h-9 px-6',
  xl: 'h-10 px-7 text-lg',
};

const buttonVariants = (color: string, group?: { vertical: boolean }) => {
  return {
    solid: [
      `no-underline text-white border-transparent bg-${color}-500 disabled:bg-${color}-500 hover:bg-${color}-600 active:bg-${color}-700`,
      group && `not-last-child:(border-${group.vertical ? 'b' : 'r'}-current)`,
    ],
    outline: [
      `no-underline border-current text-${color}-500 bg-white disabled:bg-white hover:bg-${color}-50 active:bg-${color}-100`,
      group && `not-first-child:(-m${group.vertical ? 't' : 'l'}-[1px])`,
    ],
    light: [
      `no-underline border-transparent text-${color}-500 bg-${color}-50 disabled:bg-${color}-50 hover:bg-${color}-100 active:bg-${color}-200`,
      group && `not-last-child:(border-${group.vertical ? 'b' : 'r'}-${color}-100)`,
    ],
    subtle: [
      `no-underline border-transparent text-${color}-500 bg-transparent disabled:bg-transparent hover:bg-${color}-100 active:bg-${color}-200`,
    ],
    link: [
      `border-transparent underline underline-offset-2 text-${color}-500 disabled:text-${color}-500 hover:text-${color}-600 active:text-${color}-700`,
    ],
  };
};

const isButton = (element: { tagName: string; type?: string }) => {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'button') {
    return true;
  }

  if (tagName === 'input' && element.type) {
    return ['button', 'color', 'file', 'image', 'reset', 'submit'].indexOf(element.type) !== -1;
  }

  return false;
};

export const Button = createPolymorphic<'button', ButtonProps>((props) => {
  const group = useButtonGroup();

  const propsWithDefault = mergeProps(
    {
      as: 'button',
      type: 'button',
      size: group?.size || 'md',
      color: group?.color || 'blue',
      variant: group?.variant || 'solid',
      active: false,
      disabled: group?.disabled || false,
      loading: false,
      fullWidth: false,
      spinnerPlacement: 'start',
    },
    props
  );

  const [local, rest] = splitProps(propsWithDefault, [
    'as',
    'ref',
    'type',
    'size',
    'color',
    'radius',
    'variant',
    'disabled',
    'active',
    'fullWidth',
    'children',
    'class',
    'loading',
    'loadingText',
    'spinner',
    'spinnerPlacement',
  ]);

  const rounded = () => (local.radius ? (isNumber(local.radius) ? `-[${local.radius}px]` : `-${local.radius}`) : '');

  let ref: HTMLButtonElement | undefined;

  const tagName = createTagName(
    () => ref,
    () => local.as || 'button'
  );

  const isNativeButton = createMemo(() => {
    const elementTagName = tagName();

    if (elementTagName == null) {
      return false;
    }

    return isButton({ tagName: elementTagName, type: local.type });
  });

  const isNativeInput = createMemo(() => {
    return tagName() === 'input';
  });

  const isNativeLink = createMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return tagName() === 'a' && (rest as any).href != null;
  });

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs((el) => (ref = el), local.ref)}
      type={isNativeButton() || isNativeInput() ? local.type : undefined}
      role={!isNativeButton() && !isNativeLink() ? 'button' : undefined}
      class={cx(
        'inline-flex items-center justify-center ',
        'select-none appearance-none outline-none',
        'whitespace-nowrap border transition-colors',
        'disabled:(cursor-not-allowed opacity-50)',
        `focus-visible:(ring ring-${local.color}-300)`,
        group
          ? `first:(${
              group.vertical
                ? `rounded-tl${rounded()} rounded-tr${rounded()}`
                : `rounded-tl${rounded()} rounded-bl${rounded()}`
            }) last:(${
              group.vertical
                ? `rounded-bl${rounded()} rounded-br${rounded()}`
                : `rounded-tr${rounded()} rounded-br${rounded()}`
            })`
          : `rounded${rounded()}`,
        local.fullWidth ? 'w-full' : 'w-auto',
        buttonSizes[local.size],
        buttonVariants(local.color, group && { vertical: group.vertical || false })[local.variant],
        local.class
      )}
      disabled={local.disabled || local.loading}
      {...rest}
    >
      <Show when={local.loading && local.spinnerPlacement == 'start'} keyed>
        <ButtonSpinner size={local.size} label={local.loadingText} placement="start">
          {local.spinner}
        </ButtonSpinner>
      </Show>
      <Show when={local.loading} fallback={local.children} keyed>
        <Show fallback={<span class={'opacity-0'}>{local.children}</span>} when={local.loadingText} keyed>
          {local.loadingText}
        </Show>
      </Show>
      <Show when={local.loading && local.spinnerPlacement == 'end'} keyed>
        <ButtonSpinner size={local.size} label={local.loadingText} placement="end">
          {local.spinner}
        </ButtonSpinner>
      </Show>
    </Dynamic>
  );
});
