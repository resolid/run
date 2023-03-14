export const json = <Data>(data: Data, init: number | RequestInit = {}): Response => {
  const responseInit = typeof init === 'number' ? ({ status: init } as RequestInit) : init;

  const headers = new Headers(responseInit.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers,
  });
};

export const redirect = (url: string, init: number | ResponseInit = 302): Response => {
  const responseInit =
    typeof init === 'number' ? { status: init } : typeof init.status === 'undefined' ? { status: 302 } : init;

  if (url === '') {
    url = '/';
  }

  if (process.env.NODE_ENV === 'development') {
    if (url.startsWith('.')) {
      throw new Error('Relative URLs are not allowed in redirect');
    }
  }

  const headers = new Headers(responseInit.headers);

  headers.set('Location', url);

  return new Response(null, {
    ...responseInit,
    headers,
  });
};
