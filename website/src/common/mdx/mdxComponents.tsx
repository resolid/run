// noinspection JSUnusedGlobalSymbols

import { HelmetTitle } from '@resolid/run';
import { cx } from '@resolid/utils';
import { splitProps, type ComponentProps } from 'solid-js';
import { MdxCode } from '~/common/mdx/MdxPreCode';

export const mdxComponents = (module: string) => {
  return {
    h1: (props: ComponentProps<'h1'>) => {
      const [local, rest] = splitProps(props, ['id', 'class', 'children']);

      return (
        <h1 class={cx('mb-3 mt-2 text-[1.75em] font-bold', local.class)} {...rest}>
          <HelmetTitle text={`${local.children} - ${module}`} />
          {local.children}
        </h1>
      );
    },
    h2: (props: ComponentProps<'h2'>) => {
      const [local, rest] = splitProps(props, ['id', 'class', 'children']);

      return (
        <h2 id={local.id} class={cx('group mb-3 mt-6 scroll-mt-24 text-xl font-bold', local.class)} {...rest}>
          {local.children}
          <a
            tabIndex={-1}
            class={'ms-2 text-green-500 opacity-0 transition-opacity group-hover:opacity-100'}
            aria-hidden={true}
            href={`#${local.id}`}
          >
            #
          </a>
        </h2>
      );
    },
    h3: (props: ComponentProps<'h3'>) => {
      const [local, rest] = splitProps(props, ['id', 'class', 'children']);

      return (
        <h3 id={local.id} class={cx('group mb-3 mt-6 scroll-mt-24 text-xl font-medium', local.class)} {...rest}>
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
    ul: (props: ComponentProps<'ul'>) => {
      const [local, rest] = splitProps(props, ['class', 'children']);
      return (
        <ul class={cx('my-4 list-disc ps-6', local.class)} {...rest}>
          {local.children}
        </ul>
      );
    },
    ol: (props: ComponentProps<'ol'>) => {
      const [local, rest] = splitProps(props, ['class', 'children']);
      return (
        <ol class={cx('my-4 list-decimal ps-6', local.class)} {...rest}>
          {local.children}
        </ol>
      );
    },
    li: (props: ComponentProps<'li'>) => {
      const [local, rest] = splitProps(props, ['class', 'children']);
      return (
        <li class={cx('my-1 ps-1', local.class)} {...rest}>
          {local.children}
        </li>
      );
    },
    p: (props: ComponentProps<'p'>) => {
      const [local, rest] = splitProps(props, ['class', 'children']);
      return (
        <p class={cx('my-4', local.class)} {...rest}>
          {local.children}
        </p>
      );
    },
    code: (props: ComponentProps<'code'>) => {
      return <MdxCode {...props} />;
    },
    pre: (props: ComponentProps<'pre'>) => {
      return <>{props.children}</>;
    },
    a: (props: ComponentProps<'a'>) => {
      const [local, rest] = splitProps(props, ['class', 'children']);

      return (
        <a
          class={cx('text-link hover:underline underline-offset-2 active:text-link-pressed', local.class)}
          target="_blank"
          rel="noreferrer"
          {...rest}
        >
          {local.children}
        </a>
      );
    },
  };
};
