type Argument = string | boolean | null | undefined;

export const cx = (...args: Argument[]): string => {
  let str = '',
    i = 0,
    arg: unknown;

  for (; i < args.length; ) {
    // eslint-disable-next-line prefer-rest-params
    if ((arg = args[i++]) && typeof arg === 'string') {
      str && (str += ' ');
      str += arg;
    }
  }
  return str;
};
