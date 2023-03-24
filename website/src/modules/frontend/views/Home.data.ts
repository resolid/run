import { createRouteData } from '@resolid/run';
import { server$ } from '@resolid/run/server';

let count = 0;

export const increment = server$(async () => {
  count = count + 2;
});

export const homeData = () =>
  createRouteData(
    server$(async () => {
      return { count };
    })
  );

export type HomeData = typeof homeData;
