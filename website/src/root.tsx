/* @refresh reload */
import { Body, ErrorBoundary, Head, HelmetProvider, Html, Link, Meta, Routes, Scripts } from '@resolid/run';
import { ColorModeScript, ResolidProvider } from '@resolid/ui';
import { Suspense } from 'solid-js';
import routes from './routes';

import './root.css';

// noinspection JSUnusedGlobalSymbols
export default function Root() {
  return (
    <Html lang="en">
      <HelmetProvider defaultTitle={'Resolid Run'} titleTemplate={'%s - Resolid Run'}>
        <Head>
          <Meta charset="utf-8" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta name="description" content="Get your app up and running with SolidJS!" />
          <Meta name="keywords" content="solidjs, vite, typescript, framework, meta-framework" />
          <Meta name="theme-color" content="#4586be" />
          <Link rel="manifest" href="/manifest.webmanifest" />
          <Link rel="icon" href="/favicon.ico" sizes="any" />
          <Link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Head>
        <Body class={'min-h-screen overflow-y-scroll'}>
          <ColorModeScript />
          <ErrorBoundary>
            <ResolidProvider>
              <Suspense>
                <Routes base={import.meta.env.BASE_URL}>{routes as never}</Routes>
              </Suspense>
            </ResolidProvider>
          </ErrorBoundary>
          <Scripts />
        </Body>
      </HelmetProvider>
    </Html>
  );
}
