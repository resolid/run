import type * as Babel from '@babel/core';
import { type Options } from 'vite-plugin-solid';

export const isReturnJsxElement = (nodeBody: Babel.types.BlockStatement | Babel.types.Expression): boolean => {
  if (nodeBody.type != 'BlockStatement') {
    return false;
  }

  if (nodeBody.body.length == 0) {
    return false;
  }

  return (
    nodeBody.body.findIndex((body) => {
      return body.type == 'ReturnStatement' && body.argument?.type == 'JSXElement';
    }) >= 0
  );
};

export const babelOptions =
  (fn: (source: string, id: string, ssr: boolean) => { plugins: Babel.PluginItem[] }, babel?: Options['babel']) =>
  async (source: string, id: string, ssr: boolean) => {
    let babelTransformOptions: { plugins: Babel.PluginItem[] };

    if (babel) {
      if (typeof babel === 'function') {
        const transformOptionsFn = babel(source, id, ssr);
        const transformOptions = transformOptionsFn instanceof Promise ? await transformOptionsFn : transformOptionsFn;
        babelTransformOptions = transformOptions.plugins ? (transformOptions as { plugins: [] }) : { plugins: [] };
      } else {
        babelTransformOptions = babel.plugins ? (babel as { plugins: [] }) : { plugins: [] };
      }
    } else {
      babelTransformOptions = { plugins: [] };
    }

    const d = fn(source, id, ssr);

    return {
      plugins: [...babelTransformOptions.plugins, ...d.plugins],
    };
  };
