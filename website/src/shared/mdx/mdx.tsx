import { type ComponentProps, splitProps } from 'solid-js';
import { Title } from '@resolid/run';

export const mdx = {
  h1: (props: ComponentProps<'h1'>) => {
    const [local, rest] = splitProps(props, ['id', 'children']);

    return (
      <h1 class={'text-xl font-bold mb-4'} {...rest}>
        <Title>{local.children}</Title>
        {local.children}
      </h1>
    );
  },
  h2: (props: ComponentProps<'h2'>) => {
    const [local, rest] = splitProps(props, ['id', 'children']);

    return (
      <h2 id={local.id} class={'group scroll-mt-20 text-lg font-bold mt-4 mb-4'} {...rest}>
        {local.children}
        <a
          tabIndex={-1}
          class={'ml-2 text-green-500 opacity-0 transition-opacity group-hover:opacity-100'}
          aria-hidden={true}
          href={`#${local.id}`}
        >
          #
        </a>
      </h2>
    );
  },
  h3: (props: ComponentProps<'h3'>) => {
    const [local, rest] = splitProps(props, ['id', 'children']);

    return (
      <h3 class={'group font-bold mt-4 mb-4'} {...rest}>
        {local.children}
        <a
          tabIndex={-1}
          class={'ml-2 text-green-500 opacity-0 transition-opacity group-hover:opacity-100'}
          aria-hidden={true}
          href={`#${local.id}`}
        >
          #
        </a>
      </h3>
    );
  },
  a: (props: ComponentProps<'a'>) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a class={'text-blue-500 hover:(text-blue-600 underline)'} target="_blank" rel="noreferrer" {...props} />;
  },
  p: (props: ComponentProps<'p'>) => {
    return <p class={'mt-3 mb-3'} {...props} />;
  },
  ul: (props: ComponentProps<'ul'>) => {
    return <ul class={'mt-2 ml-5 list-disc'} {...props} />;
  },
  li: (props: ComponentProps<'li'>) => {
    return <li class={'mt-1'} {...props} />;
  },
};
