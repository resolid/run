import { RunClient } from '@resolid/run';
import { hydrate } from 'solid-js/web';
import { setup } from './twind';

if (import.meta.env.DEV) {
  console.log(`import.meta.env.DEV = ${import.meta.env.DEV}`);
  console.log(`import.meta.env.PROD = ${import.meta.env.PROD}`);
  console.log(`import.meta.env.SSR = ${import.meta.env.SSR}`);
}

setup();

hydrate(() => <RunClient />, document);
