import { createComponent, createContext, mergeProps, useContext, type JSX, type ParentProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { HTMLElements, SVGElements } from './elements';

export const MDXContext = createContext(
  Object.fromEntries(
    [...HTMLElements, ...SVGElements].map((el) => [
      el,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function (props: any) {
        return createComponent(
          Dynamic,
          // eslint-disable-next-line solid/reactivity
          mergeProps(props, {
            component: el,
          })
        );
      },
    ])
  )
);

export const MDXProvider = (
  props: ParentProps<{
    components: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [k: string]: (props: any) => JSX.Element;
    };
  }>
): JSX.Element => {
  const context = useContext(MDXContext);

  return createComponent(MDXContext.Provider, {
    get value() {
      return {
        ...context,
        ...(props.components ?? {}),
      };
    },
    get children() {
      return props.children;
    },
  });
};

export const useMDXComponents = () => {
  return useContext(MDXContext);
};
