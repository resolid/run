// noinspection JSUnusedGlobalSymbols

import {
  createResource,
  onCleanup,
  startTransition,
  untrack,
  type Resource,
  type ResourceFetcher,
  type ResourceFetcherInfo,
  type ResourceOptions,
  type Signal,
} from 'solid-js';
import { createStore, reconcile, unwrap, type ReconcileOptions } from 'solid-js/store';
import { isServer } from 'solid-js/web';
import { useNavigate } from '../components/Router';
import { LocationHeader, isRedirectResponse } from './reponses';

// eslint-disable-next-line @typescript-eslint/ban-types
type RouteDataEvent = {};

type RouteDataSource<S> = S | false | null | undefined | (() => S | false | null | undefined);

type RouteDataFetcher<S, T> = (source: S, event: RouteDataEvent) => T | Promise<T>;

type RouteDataOptions<T, S> = ResourceOptions<T> & {
  key?: RouteDataSource<S>;
  reconcileOptions?: ReconcileOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resources = new Set<(k: any) => void>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const promises = new Map<any, Promise<any>>();

export function createRouteData<T, S = true>(
  fetcher: RouteDataFetcher<S, T>,
  options?: RouteDataOptions<undefined, S>
): Resource<T | undefined>;
export function createRouteData<T, S = true>(
  fetcher: RouteDataFetcher<S, T>,
  options: RouteDataOptions<T, S>
): Resource<T>;
export function createRouteData<T, S>(
  fetcher?: RouteDataFetcher<S, T>,
  options: RouteDataOptions<T, S> | RouteDataOptions<undefined, S> = {}
): Resource<T> | Resource<T | undefined> {
  const navigate = useNavigate();

  const handleResponse = (response: Response) => {
    if (isRedirectResponse(response)) {
      // noinspection JSIgnoredPromiseFromCall
      startTransition(() => {
        const url = response.headers.get(LocationHeader);
        if (url && url.startsWith('/')) {
          navigate(url, {
            replace: true,
          });
        } else {
          if (!isServer && url) {
            window.location.href = url;
          }
        }
      });
    }
  };

  const resourceFetcher: ResourceFetcher<S, T> = async (key: S) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (fetcher as any).call({}, key);

      if (response instanceof Response) {
        if (isServer) {
          handleResponse(response);
        } else {
          setTimeout(() => handleResponse(response), 0);
        }
      }
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any | Error) {
      if (e instanceof Response) {
        if (isServer) {
          handleResponse(e);
        } else {
          setTimeout(() => handleResponse(e), 0);
        }
        return e;
      }
      throw e;
    }
  };

  const dedupe = (fetcher: ResourceFetcher<S, T>): ResourceFetcher<S, T> => {
    return (key: S, info: ResourceFetcherInfo<T>) => {
      if (info.refetching && info.refetching !== true && !partialMatch(key, info.refetching) && info.value) {
        return info.value;
      }

      if (key == true) return fetcher(key, info);

      let promise = promises.get(key);
      if (promise) return promise;
      promise = fetcher(key, info) as Promise<T>;
      promises.set(key, promise);
      return promise.finally(() => promises.delete(key));
    };
  };

  // noinspection JSUnusedGlobalSymbols
  const [resource, { refetch }] = createResource<T, S>(
    (options.key || true) as RouteDataSource<S>,
    dedupe(resourceFetcher),
    {
      storage: (init: T | undefined) => createDeepSignal(init, options.reconcileOptions),
      ...options,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  );

  if (!isServer) {
    resources.add(refetch);
    onCleanup(() => resources.delete(refetch));
  }

  return resource;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const refetchRouteData = (key?: string | any[] | void) => {
  if (isServer) throw new Error('Cannot refetch route data on the server.');
  return startTransition(() => {
    for (const refetch of resources) {
      refetch(key);
    }
  });
};

const createDeepSignal = <T,>(value: T, options?: ReconcileOptions) => {
  const [store, setStore] = createStore({
    value,
  });
  return [
    // eslint-disable-next-line solid/reactivity
    () => store.value,
    // eslint-disable-next-line solid/reactivity
    (v: T) => {
      const unwrapped = untrack(() => unwrap(store.value));
      typeof v === 'function' && (v = v(unwrapped));
      setStore('value', reconcile(v, options));
      return store.value;
    },
  ] as Signal<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const partialMatch = (a: any, b: any) => {
  return partialDeepEqual(ensureQueryKeyArray(a), ensureQueryKeyArray(b));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ensureQueryKeyArray = <V extends any | any[], R = V extends [] ? V : [V]>(value: V): R => {
  return (Array.isArray(value) ? value : [value]) as R;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const partialDeepEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (a.length && !b.length) return false;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return !Object.keys(b).some((key) => !partialDeepEqual(a[key], b[key]));
  }

  return false;
};
