/* @refresh reload */
import { Body, Head, Html, Link, Meta, Routes, Scripts, Title, ErrorBoundary } from '@resolid/run';
import { Suspense } from 'solid-js';
import routes from './routes';

// noinspection JSUnusedGlobalSymbols
export default function Root() {
  return (
    <Html lang="zh-CN">
      <Head>
        <Title>Resolid Run</Title>
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
      <Body class={'min-h-screen'}>
        <ErrorBoundary>
          <Suspense fallback={'Loading...'}>
            <Routes base={import.meta.env.BASE_URL}>{routes as never}</Routes>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
