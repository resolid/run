import type { Component, ParentProps } from 'solid-js';
import { createContext, createMemo, type JSX, useContext, children } from 'solid-js';
import { Title } from '@solidjs/meta';

type HelmetContextValue = {
  defaultTitle: string;
  titleTemplate: string;
};

const HelmetContext = createContext<HelmetContextValue>({ defaultTitle: '', titleTemplate: '' });

export const HelmetProvider = (props: ParentProps<HelmetContextValue>) => {
  return (
    // eslint-disable-next-line solid/reactivity
    <HelmetContext.Provider value={{ defaultTitle: props.defaultTitle, titleTemplate: props.titleTemplate }}>
      {props.children}
    </HelmetContext.Provider>
  );
};

export const HelmetTitle = (props: { text: string }) => {
  const context = useContext(HelmetContext);

  const title = createMemo(() => {
    return props.text !== '' ? context.titleTemplate.replace('%s', props.text) : context.defaultTitle;
  });

  return <Title>{title()}</Title>;
};
