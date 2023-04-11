import { lazy, type JSXElement } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export const demos = import.meta.glob<boolean, string, { Demo: () => JSXElement }>('../demos/**/*.tsx');

export const MdxDemo = (props: { demo: string }) => {
  const demo = () => {
    const path = `../demos/${props.demo}`;

    return lazy(async () => {
      const module = await demos[path]();

      return { default: module.Demo };
    });
  };

  return <Dynamic component={demo()} />;
};
