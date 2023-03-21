import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
import { fetch, File, FormData, Headers, Request, Response } from 'undici';
import { webcrypto as crypto } from 'crypto';

const globals: Record<string, unknown> = {
  crypto,
  fetch,
  Response,
  Request,
  Headers,
  ReadableStream,
  TransformStream,
  WritableStream,
  FormData,
  File,
};

export const installPolyfills = () => {
  for (const name in globals) {
    if (!(name in globalThis)) {
      Object.defineProperty(globalThis, name, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: globals[name],
      });
    }
  }
};
