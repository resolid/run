import { cx } from '@resolid/utils';
import { createContext, mergeProps, splitProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { PrimitiveProps } from '../../primitives';
import type { ButtonVariants } from './Button.style';

export type ButtonBaseProps = ButtonVariants & {
  disabled?: boolean;
};

export type ButtonGroupProps = ButtonBaseProps & {
  vertical?: boolean;
};

const ButtonGroupContext = createContext<ButtonGroupProps>();

export const useButtonGroup = () => useContext(ButtonGroupContext);

export const ButtonGroup = (props: PrimitiveProps<'div', ButtonGroupProps>) => {
  const propsWithDefault = mergeProps(
    {
      vertical: false,
    } as ButtonGroupProps,
    props
  );

  const [local, variants, rest] = splitProps(
    propsWithDefault,
    ['class', 'children', 'vertical', 'disabled'],
    ['variant', 'size', 'color']
  );

  const [state] = createStore<ButtonGroupProps>({
    get size() {
      return variants.size;
    },
    get color() {
      return variants.color;
    },
    get variant() {
      return variants.variant;
    },
    get vertical() {
      return local.vertical;
    },
    get disabled() {
      return local.disabled;
    },
  });

  return (
    <div role={'group'} class={cx('inline-flex', local.vertical ? 'flex-col' : 'flex-row', local.class)} {...rest}>
      <ButtonGroupContext.Provider value={state}>{local.children}</ButtonGroupContext.Provider>
    </div>
  );
};
