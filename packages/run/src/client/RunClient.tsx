import { MetaProvider } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { RunContext } from '../base/RunContext';

// @ts-expect-error Cannot find module
import Root from '~resolid-run/root';

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