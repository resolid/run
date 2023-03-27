import { type ComponentProps, splitProps } from 'solid-js';
import { Title } from '@resolid/run';
import { ColorPalette } from './mdx-components/ColorPalette';

export const mdx = {
  h1: (props: ComponentProps<'h1'>) => {
    const [local, rest] = splitProps(props, ['id', 'children']);

    return (
      <h1 class={'text-xl font-bold'} {...rest}>
        <Title>{local.children}</Title>
        {local.children}
      </h1>
    );
  },
  h2: (props: ComponentProps<'h2'>) => {
    const [local, rest] = splitProps(props, ['id', 'children']);

    return (
      <h2 class={'group text-lg font-bold'} {...rest}>
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
  a: (props: ComponentProps<'a'>) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  },
  ColorPalette: ColorPalette,
};
