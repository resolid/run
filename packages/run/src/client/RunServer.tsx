import { MetaProvider } from '@solidjs/meta';
import { Router } from './components/Router';
import { ssr } from 'solid-js/web';
import { RunContext, type RunContextValue } from '../base/RunContext';

// @ts-expect-error Cannot find module
import Root from '~resolid-run/root';

export { useRunContext, type RunContextValue } from '../base/RunContext';

export type RunServerProps = {
  url: string;
  context: RunContextValue;
};

export const RunServer = (props: RunServerProps) => {
  return (
    // eslint-disable-next-line solid/reactivity
    <RunContext.Provider value={props.context}>
      <MetaProvider tags={props.context.tags}>
        <Router url={props.url}>
          {ssr('<!DOCTYPE html>') as unknown as Element}
          <Root />
        </Router>
      </MetaProvider>
    </RunContext.Provider>
  );
};
