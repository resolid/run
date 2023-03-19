import { createContext, useContext } from 'solid-js';

type TagDescription = {
  tag: string;
  props: Record<string, unknown>;
  id: string;
};

export type ManifestEntry = {
  type: string;
  href: string;
};

export type RunContextValue = {
  tags?: TagDescription[];
  manifest?: Record<string, ManifestEntry[]>;
  components?: Set<string>;
};

export const RunContext = createContext<RunContextValue>({} as unknown as RunContextValue);

export const useRunContext = () => useContext(RunContext);
