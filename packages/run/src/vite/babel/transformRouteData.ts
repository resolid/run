import type * as Babel from '@babel/core';

const RESOLID_RUN_DATA = '@resolid/run/base';
const RESOLID_RUN_SERVER = '@resolid/run/server';

const transformRouteData = ({ types: t }: typeof Babel): Babel.PluginObj => {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          state.refs = new Set();
          state.resourceRequired = false;
          state.actionRequired = false;
          state.serverImported = false;
          state.routeDataImported = false;
          state.routeActionImported = false;
          state.routeMultiActionImported = false;
          path.traverse(
            {
              ImportSpecifier(path) {
                const imported = path.get('imported');

                if (imported.isIdentifier()) {
                  if (imported.node.name === 'createRouteData') {
                    state.routeDataImported = true;
                  }
                  if (imported.node.name === 'createRouteAction') {
                    state.routeActionImported = true;
                  }
                  if (imported.node.name === 'createRouteMultiAction') {
                    state.routeMultiActionImported = true;
                  }
                }
              },
              ImportDeclaration(path) {
                if (path.node.source.value === RESOLID_RUN_SERVER) {
                  if (path.node.specifiers.some((v) => t.isImportDefaultSpecifier(v))) {
                    state.serverImported = true;
                  }
                }
              },
              CallExpression(callPath, callState) {
                if (callPath.get('callee').isIdentifier({ name: 'createServerData$' })) {
                  const args = callPath.node.arguments;

                  // need to handle more cases assumes inline options object
                  args[0] = t.callExpression(t.identifier('server$'), [args[0]]);
                  callPath.replaceWith(t.callExpression(t.identifier('createRouteData'), callPath.node.arguments));
                  callState.resourceRequired = true;
                  callPath.get('arguments')[0].setData('serverResource', true);
                }

                if (callPath.get('callee').isIdentifier({ name: 'createServerAction$' })) {
                  const args = callPath.node.arguments;

                  args[0] = t.callExpression(t.identifier('server$'), [args[0]]);
                  callPath.replaceWith(t.callExpression(t.identifier('createRouteAction'), callPath.node.arguments));
                  callState.actionRequired = true;
                  callPath.get('arguments')[0].setData('serverResource', true);
                }

                if (callPath.get('callee').isIdentifier({ name: 'createServerMultiAction$' })) {
                  const args = callPath.node.arguments;

                  args[0] = t.callExpression(t.identifier('server$'), [args[0]]);
                  callPath.replaceWith(
                    t.callExpression(t.identifier('createRouteMultiAction'), callPath.node.arguments)
                  );
                  callState.actionRequired = true;
                  callPath.get('arguments')[0].setData('serverResource', true);
                }
              },
            },
            state
          );

          if ((state.resourceRequired || state.actionRequired) && !state.serverImported) {
            path.unshiftContainer(
              'body',
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier('server$'))],
                t.stringLiteral(RESOLID_RUN_SERVER)
              )
            );
          }

          if (state.resourceRequired && !state.routeDataImported) {
            path.unshiftContainer(
              'body',
              t.importDeclaration(
                [t.importSpecifier(t.identifier('createRouteData'), t.identifier('createRouteData'))],
                t.stringLiteral(RESOLID_RUN_DATA)
              )
            );
          }

          if (state.actionRequired && !state.routeActionImported) {
            path.unshiftContainer(
              'body',
              t.importDeclaration(
                [t.importSpecifier(t.identifier('createRouteAction'), t.identifier('createRouteAction'))],
                t.stringLiteral(RESOLID_RUN_DATA)
              )
            );
          }

          if (state.actionRequired && !state.routeActionImported) {
            path.unshiftContainer(
              'body',
              t.importDeclaration(
                [t.importSpecifier(t.identifier('createRouteMultiAction'), t.identifier('createRouteMultiAction'))],
                t.stringLiteral(RESOLID_RUN_DATA)
              )
            );
          }
        },
      },
    },
  };
};

export default transformRouteData;
