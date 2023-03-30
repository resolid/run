export * from './a11y/a11y';

import { render, renderHook } from '@solidjs/testing-library';

import { mockImage } from './mocks/image';

export const mocks = {
  image: mockImage,
};

export const testRender = render;
export const testRenderHook = renderHook;
