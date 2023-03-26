import { type ComponentProps, splitProps } from 'solid-js';

export const mdxComponents = {
  h1: (props: ComponentProps<'h1'>) => {
    const [local, others] = splitProps(props, ['children']);

    return <h1 {...others}>{local.children}</h1>;
  },
  a: (props: ComponentProps<'a'>) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  },
};
