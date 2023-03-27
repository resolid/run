import { createContext, createEffect, type ParentProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useLocation } from '@resolid/run';

type Section = {
  title: string;
  href: string;
};

type TOCData = {
  sections: () => readonly Section[];
  addSection: (title: string, href: string) => void;
};

export const TOCContext = createContext<TOCData>({
  sections: () => [],
  addSection() {
    //empty
  },
});

export const TOCProvider = (props: ParentProps) => {
  const [store, setStore] = createStore<{ sections: Section[]; path: string }>({
    sections: [],
    path: '',
  });

  const data: TOCData = {
    sections() {
      return store.sections;
    },
    addSection(title, href) {
      setStore('sections', (sections) => [...new Set([...sections, { title, href }])]);
    },
  };

  createEffect(() => {
    const { pathname } = useLocation();
    setStore('sections', []);
    setStore('path', pathname);
  });

  return <TOCContext.Provider value={data}>{props.children}</TOCContext.Provider>;
};

export function useTOC() {
  return useContext(TOCContext);
}
