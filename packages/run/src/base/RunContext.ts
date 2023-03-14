import { createContext } from 'solid-js';

type TagDescription = {
  tag: string;
  props: Record<string, unknown>;
};

type ContextMatches = {
  originalPath: string;
  pattern: string;
  path: string;
  params: unknown;
};

type RouterContext = {
  matches?: ContextMatches[][];
  url?: string;
};

export type RunContextValue = {
  tags?: TagDescription[];
  routerContext?: RouterContext;
};

export const RunContext = createContext<RunContextValue>({} as unknown as RunContextValue);
