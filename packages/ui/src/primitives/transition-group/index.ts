// noinspection CommaExpressionJS,BadExpressionStatementJS

// From: https://github.com/solidjs-community/solid-primitives/blob/main/packages/transition-group/src/index.ts

import {
  $TRACK,
  type Accessor,
  batch,
  createComputed,
  createMemo,
  createSignal,
  untrack,
  useTransition,
} from 'solid-js';
import { isServer } from 'solid-js/web';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noopTransition = (el: any, done: () => void) => done();

export type TransitionMode = 'out-in' | 'in-out' | 'parallel';

export type OnTransition<T> = (el: T, done: () => void) => void;

export type SwitchTransitionOptions<T> = {
  mode?: TransitionMode;
  appear?: boolean;
  onEnter?: OnTransition<T>;
  onExit?: OnTransition<T>;
};

// noinspection JSUnusedGlobalSymbols
export const createSwitchTransition = <T>(
  source: Accessor<T>,
  options: SwitchTransitionOptions<NonNullable<T>>
): Accessor<NonNullable<T>[]> => {
  const initSource = untrack(source);
  const initReturned = initSource ? [initSource] : [];

  if (isServer) {
    return () => initReturned;
  }

  const { onEnter = noopTransition, onExit = noopTransition } = options;

  const [returned, setReturned] = createSignal<NonNullable<T>[]>(options.appear ? [] : initReturned);
  const [isTransitionPending] = useTransition();

  let next: T | undefined;
  let isExiting = false;

  function exitTransition(el: T | undefined, after?: () => void) {
    if (!el) return after && after();
    isExiting = true;
    onExit(el, () => {
      batch(() => {
        isExiting = false;
        setReturned((p) => p.filter((e) => e !== el));
        after && after();
      });
    });
  }

  function enterTransition(after?: () => void) {
    const el = next;
    if (!el) return after && after();
    next = undefined;
    setReturned((p) => [el, ...p]);
    onEnter(el, after ?? noop);
  }

  const triggerTransitions: (prev: T | undefined) => void =
    options.mode === 'out-in'
      ? // exit -> enter
        (prev) => isExiting || exitTransition(prev, enterTransition)
      : options.mode === 'in-out'
      ? // enter -> exit
        (prev) => enterTransition(() => exitTransition(prev))
      : // exit & enter
        (prev) => {
          enterTransition();
          exitTransition(prev);
        };

  createComputed(
    (prev: T | undefined) => {
      const el = source();

      if (untrack(isTransitionPending)) {
        // wait for pending transition to end before animating
        isTransitionPending();
        return prev;
      }

      if (el !== prev) {
        next = el;
        batch(() => untrack(() => triggerTransitions(prev)));
      }

      return el;
    },
    options.appear ? undefined : initSource
  );

  return returned;
};

export type OnListChange<T> = (payload: {
  list: T[];
  added: T[];
  removed: T[];
  unchanged: T[];
  finishRemoved: (els: T[]) => void;
}) => void;

export type ExitMethod = 'remove' | 'move-to-end' | 'keep-index';

export type ListTransitionOptions<T> = {
  appear?: boolean;
  exitMethod?: ExitMethod;
  onChange: OnListChange<T>;
};

// noinspection JSUnusedGlobalSymbols
export const createListTransition = <T extends object>(
  source: Accessor<readonly T[]>,
  options: ListTransitionOptions<T>
): Accessor<T[]> => {
  const initSource = untrack(source);

  if (isServer) {
    const copy = initSource.slice();
    return () => copy;
  }

  const { onChange } = options;

  let prevSet: ReadonlySet<T> = new Set(options.appear ? undefined : initSource);
  const exiting = new WeakSet<T>();

  const [toRemove, setToRemove] = createSignal<T[]>([], { equals: false });
  const [isTransitionPending] = useTransition();

  const finishRemoved: (els: T[]) => void =
    options.exitMethod === 'remove'
      ? noop
      : (els) => {
          // eslint-disable-next-line prefer-spread
          setToRemove((p) => (p.push.apply(p, els), p));

          for (const el of els) {
            exiting.delete(el);
          }
        };

  const handleRemoved: (els: T[], el: T, i: number) => void =
    options.exitMethod === 'remove'
      ? noop
      : options.exitMethod === 'keep-index'
      ? (els, el, i) => els.splice(i, 0, el)
      : (els, el) => els.push(el);

  // eslint-disable-next-line solid/reactivity
  return createMemo(
    (prev) => {
      const elsToRemove = toRemove();
      const sourceList = source();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sourceList as any)[$TRACK];

      if (untrack(isTransitionPending)) {
        isTransitionPending();
        return prev;
      }

      if (elsToRemove.length) {
        const next = prev.filter((e) => !elsToRemove.includes(e));
        elsToRemove.length = 0;
        onChange({ list: next, added: [], removed: [], unchanged: next, finishRemoved });

        return next;
      }

      return untrack(() => {
        const nextSet: ReadonlySet<T> = new Set(sourceList);
        const next: T[] = sourceList.slice();

        const added: T[] = [];
        const removed: T[] = [];
        const unchanged: T[] = [];

        for (const el of sourceList) {
          (prevSet.has(el) ? unchanged : added).push(el);
        }

        let nothingChanged = !added.length;
        for (let i = 0; i < prev.length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const el = prev[i]!;

          if (!nextSet.has(el)) {
            if (!exiting.has(el)) {
              removed.push(el);
              exiting.add(el);
            }
            handleRemoved(next, el, i);
          }

          if (nothingChanged && el !== next[i]) {
            nothingChanged = false;
          }
        }

        if (!removed.length && nothingChanged) {
          return prev;
        }

        onChange({ list: next, added, removed, unchanged, finishRemoved });

        prevSet = nextSet;

        return next;
      });
    },
    options.appear ? [] : initSource.slice()
  );
};
