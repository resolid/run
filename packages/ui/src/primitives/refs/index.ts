import { type Accessor, createMemo, type JSX } from 'solid-js';

export type Ref<T> = T | ((el: T) => void) | undefined;

export const mergeRefs = <T extends Element>(...refs: Ref<T>[]): ((el: T) => void) => {
  return (el: T) => {
    for (const ref of refs) {
      (ref as ((el: T) => void) | undefined)?.(el);
    }
  };
};

export const defaultElementPredicate: (item: JSX.Element | Element) => item is Element = process.env.SSR
  ? (item): item is Element => item != null && typeof item === 'object' && 't' in item
  : (item): item is Element => item instanceof Element;

export const getFirstChild = <T extends object>(
  value: JSX.Element,
  predicate: (item: JSX.Element | T) => item is T
): T | null => {
  if (predicate(value)) {
    return value;
  }

  if (typeof value === 'function' && !value.length) {
    return getFirstChild(value(), predicate);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const result = getFirstChild(item, predicate);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export const resolveFirst = (
  fn: Accessor<JSX.Element>,
  predicate = defaultElementPredicate,
  serverPredicate = defaultElementPredicate
): Accessor<Element | null> => {
  const children = createMemo(fn);

  // eslint-disable-next-line solid/reactivity
  return createMemo(() => getFirstChild(children(), process.env.SSR ? serverPredicate : predicate));
};
