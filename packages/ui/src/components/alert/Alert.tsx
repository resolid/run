import { cx } from '@resolid/twind';
import type { ScaleColor, Variant } from '../../utils/types';
import { type ComponentProps, createContext, mergeProps, splitProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { type PrimitiveProps } from '../../primitives';

export type AlertProps = {
  /**
   * 颜色
   * @default 'blue'
   */
  color?: ScaleColor;

  /**
   * 形式
   * @default 'light'
   */
  variant?: Variant;
};

const AlertContext = createContext<AlertProps>();

const alertVariants = (color: ScaleColor) => {
  return {
    solid: `text-white border-transparent bg-${color}-500`,
    outline: `border-${color}-500 text-${color}-500 bg-white`,
    light: `border-transparent bg-${color}-100 text-${color}-500`,
  };
};

export const Alert = (props: PrimitiveProps<'div', AlertProps>) => {
  const propsWithDefault = mergeProps(
    {
      color: 'blue' as ScaleColor,
      variant: 'light' as Variant,
    },
    props
  );

  const [local, rest] = splitProps(propsWithDefault, ['class', 'children', 'color', 'variant']);

  const [state] = createStore<AlertProps>({
    get color() {
      return local.color;
    },
    get variant() {
      return local.variant;
    },
  });

  return (
    <AlertContext.Provider value={state}>
      <div
        role="alert"
        class={cx(
          'relative flex items-center gap-2 overflow-hidden rounded border p-3',
          alertVariants(local.color)[local.variant],
          local.class
        )}
        {...rest}
      >
        {local.children}
      </div>
    </AlertContext.Provider>
  );
};

export const AlertTitle = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <div class={cx('', local.class)} {...rest} />;
};

export const AlertDescription = (props: ComponentProps<'div'>) => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('[Resolid]: `AlertDescription` must be used within an `<Alert />` component');
  }

  const [local, rest] = splitProps(props, ['class']);

  return <div class={cx(context.variant != 'solid' && 'text-black', local.class)} {...rest} />;
};

export const AlertIcon = (props: ComponentProps<'span'>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <span class={cx(`shrink-0`, local.class)} {...rest} />;
};
