import { asArray, isFunction, type Many } from '@resolid/utils';
import { createEffect, createRenderEffect } from 'solid-js';
import { isServer } from 'solid-js/web';
import { tryOnCleanup, unAccessor, type MaybeAccessor } from '../../primitives';

export type TargetWithEventMap = Window | Document | HTMLElement | MediaQueryList;

export type EventMapOf<Target> = Target extends Window
  ? WindowEventMap
  : Target extends Document
  ? DocumentEventMap
  : Target extends HTMLElement
  ? HTMLElementEventMap
  : Target extends MediaQueryList
  ? MediaQueryListEventMap
  : never;

type CreateEventListener = {
  <EventMap extends WindowEventMap, EventType extends keyof WindowEventMap>(
    type: MaybeAccessor<Many<EventType>>,
    handler: (event: EventMap[EventType]) => void,
    target?: undefined,
    options?: boolean | AddEventListenerOptions
  ): void;
  <Target extends TargetWithEventMap, EventMap extends EventMapOf<Target>, EventType extends keyof EventMap>(
    type: MaybeAccessor<Many<EventType>>,
    handler: (event: EventMap[EventType]) => void,
    target: MaybeAccessor<Many<Target | undefined>>,
    options?: boolean | AddEventListenerOptions
  ): void;
  <EventMap extends Record<string, Event>, EventType extends keyof EventMap = keyof EventMap>(
    type: MaybeAccessor<Many<EventType>>,
    handler: (event: EventMap[EventType]) => void,
    target: MaybeAccessor<Many<EventTarget | undefined>>,
    options?: boolean | AddEventListenerOptions
  ): void;
};

export const createEventListener: CreateEventListener = (
  type: MaybeAccessor<Many<string>>,
  handler: (event: Event) => void,
  target?: MaybeAccessor<Many<EventTarget | undefined>>,
  options?: boolean | AddEventListenerOptions
) => {
  if (isServer) {
    return;
  }

  const make = (
    type: string,
    handler: (event: Event) => void,
    target: EventTarget,
    options?: boolean | AddEventListenerOptions
  ): VoidFunction => {
    target.addEventListener(type, handler, options);

    return tryOnCleanup(() => target.removeEventListener(type, handler, options));
  };

  const register = () => {
    asArray(target ? unAccessor(target) : window).forEach((el) => {
      if (el) {
        asArray(unAccessor(type)).forEach((type) => make(type, handler, el, options));
      }
    });
  };

  if (isFunction(target)) {
    createEffect(register);
  } else {
    createRenderEffect(register);
  }
};
