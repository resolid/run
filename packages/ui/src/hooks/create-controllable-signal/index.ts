import { type Accessor, createMemo, createSignal, untrack } from 'solid-js';
import { runIfFn } from '../../utils/function';

export type CreateControllableSignalProps<T> = {
  value?: Accessor<T | undefined>;
  defaultValue?: Accessor<T | undefined>;
  onChange?: (value: T) => void;
};

export function createControllableSignal<T>(props: CreateControllableSignalProps<T>) {
  const [_value, _setValue] = createSignal(props.defaultValue?.());

  const controlled = createMemo(() => props.value?.() !== undefined);

  const value = createMemo(() => (controlled() ? props.value?.() : _value()));

  // eslint-disable-next-line @typescript-eslint/ban-types
  const setValue = (next: Exclude<T, Function> | ((prev: T) => T)) => {
    untrack(() => {
      const nextValue = runIfFn(next, value() as T);

      if (!Object.is(nextValue, value())) {
        if (!controlled()) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          _setValue(nextValue as Exclude<T, Function>);
        }

        props.onChange?.(nextValue);
      }

      return nextValue;
    });
  };

  return [value, setValue] as const;
}

export const createControllableBooleanSignal = (props: CreateControllableSignalProps<boolean>) => {
  const [_value, setValue] = createControllableSignal(props);
  const value: Accessor<boolean> = () => _value() ?? false;

  return [value, setValue] as const;
};
