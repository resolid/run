import { cx } from '@resolid/utils';
import { createContext, splitProps, useContext, type Accessor } from 'solid-js';
import type { PrimitiveProps } from '../../primitives';
import { alertVariants, type AlertVariants } from './Alert.styles';

type AlertContextValue = {
  variant: Accessor<AlertVariants['variant']>;
};

const AlertContext = createContext<AlertContextValue>();

const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('[Resolid]: `useAlert` must be used within an `<Alert />` component');
  }

  return context;
};

export type AlertProps = AlertVariants;

export const Alert = (props: PrimitiveProps<'div', AlertProps>) => {
  const [local, variants, rest] = splitProps(props, ['class', 'children'], ['color', 'variant']);

  const context: AlertContextValue = {
    variant: () => variants.variant,
  };

  return (
    <AlertContext.Provider value={context}>
      <div role={'alert'} class={cx(alertVariants(variants), local.class)} {...rest}>
        {local.children}
      </div>
    </AlertContext.Provider>
  );
};

export const AlertTitle = (props: PrimitiveProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <div class={cx('font-medium', local.class)} {...rest} />;
};

export const AlertDescription = (props: PrimitiveProps<'div'>) => {
  const { variant } = useAlert();
  const [local, rest] = splitProps(props, ['class']);

  return <div class={cx(variant() != 'solid' && 'text-fg-default', local.class)} {...rest} />;
};

export const AlertIcon = (props: PrimitiveProps<'span'>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <span class={cx(`shrink-0`, local.class)} {...rest} />;
};
