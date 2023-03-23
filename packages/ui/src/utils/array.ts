// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asArray = <T>(value: T): (T extends any[] ? T[number] : T)[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Array.isArray(value) ? (value as any) : [value];
};
