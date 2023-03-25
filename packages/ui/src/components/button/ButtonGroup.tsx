import { createStore } from 'solid-js/store';
import { mergeProps, splitProps } from 'solid-js';
import { type PrimitiveProps } from '../../primitives';
import { cx } from '@resolid/twind';
import { ButtonGroupContext, type ButtonGroupProps } from './ButtonGroupContext';

export const ButtonGroup = (props: PrimitiveProps<'div', ButtonGroupProps>) => {
  const propsWithDefault = mergeProps(
    {
      size: 'md',
      color: 'blue',
      variant: 'solid',
      vertical: false,
    } as ButtonGroupProps,
    props
  );

  const [local, rest] = splitProps(propsWithDefault, ['size', 'color', 'variant', 'vertical', 'children', 'class']);

  const [state] = createStore<ButtonGroupProps>({
    get size() {
      return local.size;
    },
    get color() {
      return local.color;
    },
    get variant() {
      return local.variant;
    },
    get vertical() {
      return local.vertical;
    },
  });

  return (
    <div role={'group'} class={cx('inline-flex', local.vertical ? 'flex-col' : 'flex-row', local.class)} {...rest}>
      <ButtonGroupContext.Provider value={state}>{local.children}</ButtonGroupContext.Provider>
    </div>
  );
};
