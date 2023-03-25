import type { RunContextValue } from '@resolid/run';
import { RunServer } from '@resolid/run';
import { createHandler } from '@resolid/run/server';
import { renderToStream } from 'solid-js/web';
import TwindStream from '@twind/with-react/readableStream';
import tw from './twind';

export default createHandler(
  (request: Request, responseStatusCode: number, responseHeaders: Headers, runContext: RunContextValue) => {
    const { readable, writable } = new TwindStream(tw);

    const stream = renderToStream(() => <RunServer context={runContext} url={request.url} />);

    responseHeaders.set('Content-Type', 'text/html');

    stream.pipeTo(writable);

    return new Response(readable, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }
);
