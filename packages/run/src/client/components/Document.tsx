import type { JSX, JSXElement } from 'solid-js';
import { children, type ComponentProps } from 'solid-js';
import { escape, insert, spread, ssr, ssrElement, useAssets } from 'solid-js/web';
import { useRunContext } from '../../base/RunContext';
import { renderTags } from '@solidjs/meta';

const Meta = () => {
  const context = useRunContext();
  // @ts-expect-error The ssr() types do not match the Assets child types
  useAssets(() => ssr(renderTags(context.tags)));

  return null;
};

const Links = () => {
  const context = useRunContext();

  if (!import.meta.env.DEV) {
    useAssets(() => {
      const links: Record<string, JSXElement> = {};

      context.components?.forEach((key) => {
        context.manifest?.[key].forEach((entry) => {
          links[entry.href] =
            entry.type == 'style' ? (
              <link rel="stylesheet" href={entry.href} $ServerOnly />
            ) : entry.type === 'script' ? (
              <link rel="modulepreload" href={entry.href} $ServerOnly />
            ) : undefined;
        });
      });

      return Object.values(links);
    });
  }

  return null;
};

// noinspection JSUnusedGlobalSymbols
export const Html = (props: ComponentProps<'html'>) => {
  if (import.meta.env.SSR) {
    return ssrElement('html', props, undefined, false) as unknown as JSX.Element;
  }

  spread(document.documentElement, props, false, true);

  // eslint-disable-next-line solid/reactivity
  return props.children;
};

// noinspection JSUnusedGlobalSymbols
export const Head = (props: ComponentProps<'head'>) => {
  if (import.meta.env.SSR) {
    return ssrElement(
      'head',
      props,
      () => (
        <>
          {escape(props.children as string)}
          <Meta />
          <Links />
        </>
      ),
      false
    ) as unknown as JSX.Element;
  }

  spread(document.head, props, false, true);

  // eslint-disable-next-line solid/reactivity
  return props.children;
};

// noinspection JSUnusedGlobalSymbols
export const Body = (props: ComponentProps<'body'>) => {
  if (import.meta.env.SSR) {
    // eslint-disable-next-line solid/reactivity
    return ssrElement('body', props, () => escape(props.children as string), false) as unknown as JSX.Element;
  }

  const child = children(() => props.children);

  spread(document.body, props, false, true);

  insert(
    document.body,
    () => {
      const childNodes = child();

      if (childNodes) {
        if (Array.isArray(childNodes)) {
          const els = childNodes.filter((n) => Boolean(n));

          if (!els.length) {
            return null;
          }

          return els;
        }
        return childNodes;
      }
      return null;
    },
    null,
    [...document.body.childNodes]
  );

  return document.body;
};
