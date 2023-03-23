import { createRouteData } from '@resolid/run';
import { server$ } from '@resolid/run/server';

let count = 0;

export const increment = server$(async () => {
  count = count + 1;
});

export const homeData = () => {
  return createRouteData(
    server$(async () => {
      return { count };
    })
  );
};

export type HomeData = typeof homeData;
