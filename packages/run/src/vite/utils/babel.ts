import type * as Babel from '@babel/core';

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
