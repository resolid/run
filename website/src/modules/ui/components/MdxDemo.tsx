import { lazy, type JSXElement } from 'solid-js';

export const demos = import.meta.glob<boolean, string, { Demo: () => JSXElement }>('../demos/**/*.tsx');

export const MdxDemo = (props: { demo: string }) => {
  const DemoComponent = lazy(() => {
    // eslint-disable-next-line solid/reactivity
    return new Promise<{ default: () => JSXElement }>((resolve) => {
      demos[`../demos/${props.demo}`]().then((module) => {
        resolve({ default: module.Demo });
      });
    });
  });

  return <DemoComponent />;
};
