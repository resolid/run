import crypto from 'crypto';
import nodePath from 'path';
import type * as Babel from '@babel/core';

const INLINE_SERVER_ROUTE_PREFIX = '/_m';

type PluginState = {
  refs: Set<Babel.NodePath<Babel.types.Identifier>>;
  done: boolean;
  servers: number;
  filename: string;
  opts: {
    ssr: boolean;
    root: string;
    minify: boolean;
  };
};

const transformServer = ({ types: t, template }: typeof Babel): Babel.PluginObj<PluginState> => {
  const getLocal = (
    e: Babel.NodePath<null | Babel.types.PatternLike | Babel.types.LVal>
  ): Babel.NodePath<Babel.types.Identifier> | null => {
    if (e.node && e.node.type === 'Identifier') {
      return e as Babel.NodePath<Babel.types.Identifier>;
    } else if (e.node && e.node.type === 'RestElement') {
      return e.get('argument') as Babel.NodePath<Babel.types.Identifier>;
    }

    return null;
  };

  const getIdentifier = (
    path:
      | Babel.NodePath<Babel.types.FunctionDeclaration>
      | Babel.NodePath<Babel.types.FunctionExpression>
      | Babel.NodePath<Babel.types.ArrowFunctionExpression>
  ): Babel.NodePath<Babel.types.Identifier> | null => {
    const parentPath = path.parentPath;

    if (parentPath.type === 'VariableDeclarator') {
      const name = (parentPath as Babel.NodePath<Babel.types.VariableDeclarator>).get('id');

      return name.node.type === 'Identifier' ? (name as Babel.NodePath<Babel.types.Identifier>) : null;
    }

    if (parentPath.type === 'AssignmentExpression') {
      const name = (parentPath as Babel.NodePath<Babel.types.AssignmentExpression>).get('left');

      return name.node.type === 'Identifier' ? (name as Babel.NodePath<Babel.types.Identifier>) : null;
    }

    if (path.node.type === 'ArrowFunctionExpression') {
      return null;
    }

    return path.node.id && path.node.id.type === 'Identifier'
      ? (path.get('id') as Babel.NodePath<Babel.types.Identifier>)
      : null;
  };

  const isIdentifierReferenced = (ident: Babel.NodePath<Babel.types.Identifier>): boolean => {
    const b = ident.scope.getBinding(ident.node.name);

    if (b && b.referenced) {
      if (b.path.type === 'FunctionDeclaration') {
        return !b.constantViolations.concat(b.referencePaths).every((ref) => ref.findParent((p) => p === b.path));
      }

      return true;
    }

    return false;
  };

  const markFunction = (
    path:
      | Babel.NodePath<Babel.types.FunctionDeclaration>
      | Babel.NodePath<Babel.types.FunctionExpression>
      | Babel.NodePath<Babel.types.ArrowFunctionExpression>,
    state: PluginState
  ) => {
    const ident = getIdentifier(path);

    if (ident && ident.node && isIdentifierReferenced(ident)) {
      state.refs.add(ident);
    }
  };

  const markImport = (
    path:
      | Babel.NodePath<Babel.types.ImportSpecifier>
      | Babel.NodePath<Babel.types.ImportDefaultSpecifier>
      | Babel.NodePath<Babel.types.ImportNamespaceSpecifier>,
    state: PluginState
  ) => {
    state.refs.add(path.get('local') as Babel.NodePath<Babel.types.Identifier>);
  };

  const hashFn = (str: string) => {
    return crypto.createHash('shake256', { outputLength: 5 }).update(str).digest('hex');
  };

  return {
    visitor: {
      Program: {
        enter(path, state) {
          state.refs = new Set<Babel.NodePath<Babel.types.Identifier>>();
          state.done = false;
          state.servers = 0;
          path.traverse(
            {
              VariableDeclarator(variablePath, variableState) {
                if (variablePath.node.id.type === 'Identifier') {
                  const local = variablePath.get('id') as Babel.NodePath<Babel.types.Identifier>;

                  if (isIdentifierReferenced(local)) {
                    variableState.refs.add(local);
                  }
                } else if (variablePath.node.id.type === 'ObjectPattern') {
                  (variablePath.get('id') as Babel.NodePath<Babel.types.ObjectPattern>)
                    .get('properties')
                    .forEach((p) => {
                      const local = p.get(
                        p.node.type === 'ObjectProperty'
                          ? 'value'
                          : p.node.type === 'RestElement'
                          ? 'argument'
                          : (function () {
                              throw new Error('invariant');
                            })()
                      ) as Babel.NodePath<Babel.types.Identifier>;

                      if (isIdentifierReferenced(local)) {
                        variableState.refs.add(local);
                      }
                    });
                } else if (variablePath.node.id.type === 'ArrayPattern') {
                  (variablePath.get('id') as Babel.NodePath<Babel.types.ArrayPattern>).get('elements').forEach((e) => {
                    const local = getLocal(e);

                    if (local == null) {
                      return;
                    }

                    if (isIdentifierReferenced(local)) {
                      variableState.refs.add(local);
                    }
                  });
                }
              },
              CallExpression: (path) => {
                if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'server$') {
                  const serverFn = path.get('arguments')[0] as Babel.NodePath<Babel.types.Expression>;
                  const serverFnOpts = path.get('arguments')[1];

                  const program = path.findParent((p) => t.isProgram(p)) as Babel.NodePath<Babel.types.Program>;
                  const statement = path.findParent((p) =>
                    program.get('body').includes(p as Babel.NodePath<Babel.types.Statement>)
                  ) as Babel.NodePath<Babel.types.Statement>;
                  const decl = path.findParent(
                    (p) => p.isVariableDeclarator() || p.isFunctionDeclaration() || p.isObjectProperty()
                  ) as Babel.NodePath<
                    Babel.types.VariableDeclarator | Babel.types.FunctionDeclaration | Babel.types.ObjectProperty
                  >;

                  const serverIndex = state.servers++;
                  const filename = state.filename.replace(state.opts.root, '').slice(1);
                  const hash = (state.opts.minify ? hashFn : (str: string) => str)(
                    nodePath.join(filename, String(serverIndex))
                  );

                  serverFn.traverse({
                    MemberExpression(path) {
                      const obj = path.get('object');
                      if (obj.node.type === 'Identifier' && obj.node.name === 'server$') {
                        obj.replaceWith(t.identifier('$$ctx'));
                        return;
                      }
                    },
                  });

                  if (serverFn.node.type === 'ArrowFunctionExpression') {
                    const body = serverFn.get('body') as Babel.NodePath<
                      Babel.types.Expression | Babel.types.BlockStatement
                    >;

                    if (body.node.type !== 'BlockStatement') {
                      body.replaceWith(t.blockStatement([t.returnStatement(body.node)]));
                    }

                    serverFn.replaceWith(
                      t.functionExpression(
                        t.identifier('$$serverHandler' + serverIndex),
                        serverFn.node.params,
                        serverFn.node.body as Babel.types.BlockStatement,
                        false,
                        true
                      )
                    );
                  }

                  if (serverFn.node.type === 'FunctionExpression') {
                    (serverFn.get('body') as Babel.NodePath<Babel.types.BlockStatement>).unshiftContainer(
                      'body',
                      t.variableDeclaration('const', [t.variableDeclarator(t.identifier('$$ctx'), t.thisExpression())])
                    );
                  }

                  const route = nodePath
                    .join(
                      INLINE_SERVER_ROUTE_PREFIX,
                      hash,
                      // @ts-expect-error Property 'id' does not exist
                      decl?.node.id?.elements?.[0]?.name ?? decl?.node.id?.name ?? decl?.node.key?.name ?? 'fn'
                    )
                    .replaceAll('\\', '/');

                  if (state.opts.ssr) {
                    statement.insertBefore(
                      template(`
                      const $$server_module${serverIndex} = server$.createHandler(%%source%%, "${route}", %%options%%);
                      server$.registerHandler("${route}", $$server_module${serverIndex});
                      `)({
                        source: serverFn.node,
                        options: serverFnOpts?.node || t.identifier('undefined'),
                      })
                    );
                  } else {
                    statement.insertBefore(
                      template(
                        `
                        ${
                          process.env.TEST_ENV === 'client'
                            ? `server$.registerHandler("${route}", server$.createHandler(%%source%%, "${route}", %%options%%);`
                            : ``
                        }
                        const $$server_module${serverIndex} = server$.createFetcher("${route}", %%options%%);`,
                        {
                          syntacticPlaceholders: true,
                        }
                      )(
                        process.env.TEST_ENV === 'client'
                          ? {
                              source: serverFn.node,
                              options: serverFnOpts?.node || t.identifier('undefined'),
                            }
                          : {
                              options: serverFnOpts?.node || t.identifier('undefined'),
                            }
                      )
                    );
                  }
                  path.replaceWith(t.identifier(`$$server_module${serverIndex}`));
                }
              },
              FunctionDeclaration: markFunction,
              FunctionExpression: markFunction,
              ArrowFunctionExpression: markFunction,
              ImportSpecifier: function (path, state) {
                // Rewrite imports to `@resolid/run` to `@resolid/run/server` during SSR
                if (state.opts.ssr && (path.node.imported as Babel.types.Identifier).name === 'server$') {
                  const importDeclaration = path.findParent((p) =>
                    p.isImportDeclaration()
                  ) as Babel.NodePath<Babel.types.ImportDeclaration>;
                  if (importDeclaration) {
                    importDeclaration.node.source.value += '/server';
                  }
                }
                markImport(path, state);
              },
              ImportDefaultSpecifier: markImport,
              ImportNamespaceSpecifier: markImport,
            },
            state
          );

          const refs = state.refs;

          let count: number;

          const sweepFunction = (
            sweepPath:
              | Babel.NodePath<Babel.types.FunctionDeclaration>
              | Babel.NodePath<Babel.types.FunctionExpression>
              | Babel.NodePath<Babel.types.ArrowFunctionExpression>
          ): void => {
            const ident = getIdentifier(sweepPath);

            if (ident && ident.node && refs.has(ident) && !isIdentifierReferenced(ident)) {
              ++count;

              if (t.isAssignmentExpression(sweepPath.parentPath) || t.isVariableDeclarator(sweepPath.parentPath)) {
                sweepPath.parentPath.remove();
              } else {
                sweepPath.remove();
              }
            }
          };

          const sweepImport = (
            sweepPath:
              | Babel.NodePath<Babel.types.ImportSpecifier>
              | Babel.NodePath<Babel.types.ImportDefaultSpecifier>
              | Babel.NodePath<Babel.types.ImportNamespaceSpecifier>
          ): void => {
            const local = sweepPath.get('local') as Babel.NodePath<Babel.types.Identifier>;

            if (refs.has(local) && !isIdentifierReferenced(local)) {
              ++count;
              sweepPath.remove();
              if (!state.opts.ssr) {
                if ((sweepPath.parent as Babel.types.ImportDeclaration).specifiers.length === 0) {
                  sweepPath.parentPath.remove();
                }
              }
            }
          };

          do {
            path.scope.crawl();
            count = 0;
            path.traverse({
              VariableDeclarator(variablePath) {
                if (variablePath.node.id.type === 'Identifier') {
                  const local = variablePath.get('id') as Babel.NodePath<Babel.types.Identifier>;

                  if (refs.has(local) && !isIdentifierReferenced(local)) {
                    ++count;
                    variablePath.remove();
                  }
                } else if (variablePath.node.id.type === 'ObjectPattern') {
                  const pattern = variablePath.get('id') as Babel.NodePath<Babel.types.ObjectPattern>;
                  const beforeCount = count;
                  const properties = pattern.get('properties');

                  properties.forEach((p) => {
                    const local = p.get(
                      p.node.type === 'ObjectProperty'
                        ? 'value'
                        : p.node.type === 'RestElement'
                        ? 'argument'
                        : (function () {
                            throw new Error('invariant');
                          })()
                    ) as Babel.NodePath<Babel.types.Identifier>;

                    if (refs.has(local) && !isIdentifierReferenced(local)) {
                      ++count;
                      p.remove();
                    }
                  });

                  if (beforeCount !== count && pattern.get('properties').length < 1) {
                    variablePath.remove();
                  }
                } else if (variablePath.node.id.type === 'ArrayPattern') {
                  const pattern = variablePath.get('id') as Babel.NodePath<Babel.types.ArrayPattern>;
                  const beforeCount = count;
                  const elements = pattern.get('elements');

                  elements.forEach((e) => {
                    const local = getLocal(e);

                    if (local == null) {
                      return;
                    }

                    if (refs.has(local) && !isIdentifierReferenced(local)) {
                      ++count;
                      e.remove();
                    }
                  });

                  if (beforeCount !== count && pattern.get('elements').length < 1) {
                    variablePath.remove();
                  }
                }
              },
              FunctionDeclaration: sweepFunction,
              FunctionExpression: sweepFunction,
              ArrowFunctionExpression: sweepFunction,
              ImportSpecifier: sweepImport,
              ImportDefaultSpecifier: sweepImport,
              ImportNamespaceSpecifier: sweepImport,
            });
          } while (count);
        },
      },
    },
  };
};

export default transformServer;
