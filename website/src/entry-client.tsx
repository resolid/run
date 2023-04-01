import { RunClient } from '@resolid/run';
import { hydrate } from 'solid-js/web';

if (import.meta.env.DEV) {
  console.log(`import.meta.env.DEV = ${import.meta.env.DEV}`);
  console.log(`import.meta.env.PROD = ${import.meta.env.PROD}`);
  console.log(`import.meta.env.SSR = ${import.meta.env.SSR}`);
}

hydrate(() => <RunClient />, document);
