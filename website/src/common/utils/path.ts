export const getPathname = (path: string) => {
  return new URL(path, 'http://mock.test').pathname;
};
