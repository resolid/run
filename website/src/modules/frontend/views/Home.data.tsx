import { createRouteData } from '@resolid/run';
import { server$ } from '@resolid/run/server';

export const homeData = () => {
  return createRouteData(
    server$(() => {
      return { message: 'Home Server Message' };
    })
  );
};

export type HomeData = typeof homeData;
