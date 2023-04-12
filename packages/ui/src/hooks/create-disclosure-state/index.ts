import type { Accessor } from 'solid-js';
import { unAccessor, type MaybeAccessor } from '../../primitives';
import { createControllableBooleanSignal } from '../create-controllable-signal';

export type CreateDisclosureStateProps = {
  opened?: MaybeAccessor<boolean | undefined>;
  defaultOpened?: MaybeAccessor<boolean | undefined>;
  onOpenedChange?: (opened: boolean) => void;
};

export type CreateDisclosureStateResult = {
  opened: Accessor<boolean>;
  setOpened: (next: boolean | ((prev: boolean) => boolean)) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export function createDisclosureState(props: CreateDisclosureStateProps = {}): CreateDisclosureStateResult {
  const [opened, setOpened] = createControllableBooleanSignal({
    value: () => unAccessor(props.opened),
    defaultValue: () => !!unAccessor(props.defaultOpened),
    onChange: (value) => props.onOpenedChange?.(value),
  });

  const open = () => {
    setOpened(true);
  };

  const close = () => {
    setOpened(false);
  };

  const toggle = () => {
    opened() ? close() : open();
  };

  return {
    opened,
    setOpened,
    open,
    close,
    toggle,
  };
}
