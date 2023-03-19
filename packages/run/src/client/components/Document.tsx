import type { JSX } from 'solid-js';
import { children, type ComponentProps, useContext } from 'solid-js';
import { escape, insert, spread, ssr, ssrElement, useAssets } from 'solid-js/web';
import { RunContext } from '../../base/RunContext';
import { renderTags } from '@solidjs/meta';

const Meta = () => {
  const context = useContext(RunContext);
  // @ts-expect-error The ssr() types do not match the Assets child types
  useAssets(() => ssr(renderTags(context.tags)));

  return null;
};

const Links = () => {
  const context = useContext(RunContext);

  if (!import.meta.env.DEV) {
    useAssets(() => {
      console.log(context.components);

      return undefined;
    });
  }

  return null;
};

export const Html = (props: ComponentProps<'html'>) => {
  if (import.meta.env.SSR) {
    return ssrElement('html', props, undefined, false) as unknown as JSX.Element;
  }

  spread(document.documentElement, props, false, true);

  // eslint-disable-next-line solid/reactivity
  return props.children;
};

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
