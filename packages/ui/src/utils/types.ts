export type Merge<T, P> = P & Omit<T, keyof P>;

export type Many<T> = T | T[];
