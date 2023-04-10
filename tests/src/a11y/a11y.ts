import { expect } from 'vitest';
import { axe, type AxeConfigureOptions } from './axe';
import { render } from '@solidjs/testing-library';
import { type Component, type JSX } from 'solid-js';
import type { Queries } from '@testing-library/dom';
import { queries } from '@testing-library/dom';

type RenderOptions = {
  container?: HTMLElement;
  baseElement?: HTMLElement;
  queries?: Queries & typeof queries;
  hydrate?: boolean;
  wrapper?: Component<{ children: JSX.Element }>;
};

export const testA11y = async (
  ui: () => JSX.Element | HTMLElement,
  options: RenderOptions & { axeOptions?: AxeConfigureOptions } = {}
) => {
  const { axeOptions, ...rest } = options;
  const container = typeof ui == 'function' ? render(ui, rest).container : ui;
  const results = await axe(container, axeOptions);
  // @ts-expect-error Property
  expect(results).toHaveNoViolations();
};
