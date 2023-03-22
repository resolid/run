import { type JSX } from 'solid-js';

const extractCSSRegex = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;

export const stringStyleToObject = (style: string): JSX.CSSProperties => {
  const object: Record<string, string> = {};
  let match: RegExpExecArray | null;

  while ((match = extractCSSRegex.exec(style))) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    object[match[1]!] = match[2]!;
  }

  return object;
};

export const combineStyle = (
  a: JSX.CSSProperties | string,
  b: JSX.CSSProperties | string
): JSX.CSSProperties | string => {
  if (typeof a === 'object' && typeof b === 'object') return { ...a, ...b };
  if (typeof a === 'string' && typeof b === 'string') return `${a};${b}`;

  const objA = typeof a === 'object' ? a : stringStyleToObject(a);
  const objB = typeof b === 'object' ? b : stringStyleToObject(b);

  return { ...objA, ...objB };
};
