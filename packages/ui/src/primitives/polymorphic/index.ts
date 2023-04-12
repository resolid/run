import { type Merge } from '@resolid/utils';
import { type Component, type ComponentProps, type JSX } from 'solid-js';

type DOMElements = keyof JSX.IntrinsicElements;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type ElementType<Props = any> = DOMElements | Component<Props> | (string & Record<string, never>);

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type As<Props = any> = ElementType<Props>;

export type PrimitiveProps<
  Type extends ElementType = ElementType,
  Props extends Record<string, unknown> = Record<never, never>
> = Merge<ComponentProps<Type>, Props>;

export type PolymorphicProps<
  Type extends ElementType = ElementType,
  Props extends Record<string, unknown> = Record<never, never>
> = Merge<ComponentProps<Type>, Props & { as?: Type | As }>;

export type PolymorphicComponent<
  DefaultType extends As,
  Props extends Record<string, unknown> = Record<never, never>
> = {
  <Type extends As>(props: PolymorphicProps<Type, Props> & { as: Type }): JSX.Element;
  (props: PolymorphicProps<DefaultType, Props>): JSX.Element;
};

export const createPolymorphic = <DefaultType extends As, Props extends Record<string, unknown> = Record<never, never>>(
  component: Component<PolymorphicProps<DefaultType, Props>>
) => {
  return component as unknown as PolymorphicComponent<DefaultType, Props>;
};
