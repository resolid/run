import { ReadableStream, TextDecoderStream, TextEncoderStream, WritableStream } from 'node:stream/web';
import { fetch, File, FormData, Headers, Request, Response } from 'undici';

import crypto from 'crypto';

export const installPolyfills = () => {
  if (
    typeof global !== 'undefined' &&
    typeof globalThis.fetch !== 'function' &&
    typeof process !== 'undefined' &&
    process.versions.node
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.fetch = fetch as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.Headers = Headers as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.Request = Request as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.Response = Response as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.FormData = FormData as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.File = File as any;
  }
  if (typeof globalThis.TextEncoderStream === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.TextEncoderStream = TextEncoderStream as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.TextDecoderStream = TextDecoderStream as any;
  }
  if (typeof globalThis.WritableStream === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.WritableStream = WritableStream as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.ReadableStream = ReadableStream as any;
  }
  if (typeof globalThis.crypto === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.crypto = crypto.webcrypto as any;
  }
};
