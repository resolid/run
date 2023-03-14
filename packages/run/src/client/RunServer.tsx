import { MetaProvider } from '@solidjs/meta';
import { Router } from './components/Router';
import { ssr } from 'solid-js/web';
import { RunContext } from '../base/RunContext';

// @ts-expect-error Cannot find module
import Root from '~resolid-run/root';

export const RunServer = (props: { url: string }) => {
  const runContextValue = { tags: [], routerContext: {} };

  return (
    <RunContext.Provider value={runContextValue}>
      <MetaProvider tags={runContextValue.tags}>
        <Router url={props.url} out={runContextValue.routerContext}>
          {ssr('<!DOCTYPE html>') as unknown as Element}
          <Root />
        </Router>
      </MetaProvider>
    </RunContext.Provider>
  );
};
