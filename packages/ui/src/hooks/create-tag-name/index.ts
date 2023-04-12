import { isString } from '@resolid/utils';
import { createEffect, createSignal, type Accessor, type Component } from 'solid-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stringOrUndefined = (value: any) => {
  return isString(value) ? value : undefined;
};

export const createTagName = (
  ref: Accessor<HTMLElement | undefined>,
  fallback?: Accessor<string | Component | undefined>
) => {
  const [tagName, setTagName] = createSignal(stringOrUndefined(fallback?.()));

  createEffect(() => {
    setTagName(ref()?.tagName.toLowerCase() || stringOrUndefined(fallback?.()));
  });

  return tagName;
};
