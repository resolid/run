export type Merge<T, P> = P & Omit<T, keyof P>;
