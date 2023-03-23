import { MetaProvider } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { RunContext } from '../components/RunContext';

// @ts-expect-error Cannot find module
import Root from '~resolid-run/root';

// noinspection JSUnusedGlobalSymbols
export const RunClient = () => {
  return (
    <RunContext.Provider value={{}}>
      <MetaProvider>
        <Router base={import.meta.env.BASE_URL}>
          <Root />
        </Router>
      </MetaProvider>
    </RunContext.Provider>
  );
};
