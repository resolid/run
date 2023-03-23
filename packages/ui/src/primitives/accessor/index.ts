import type { Accessor } from 'solid-js';
import { getOwner, onCleanup } from 'solid-js';

export type MaybeAccessor<T> = T | Accessor<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MaybeAccessorValue<T extends MaybeAccessor<any>> = T extends () => any ? ReturnType<T> : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unAccessor = <T extends MaybeAccessor<any>>(v: T): MaybeAccessorValue<T> => {
  return typeof v === 'function' && !v.length ? v() : v;
};

export const tryOnCleanup: typeof onCleanup = (fn) => (getOwner() ? onCleanup(fn) : fn);
