import { TableOfContents } from './TableOfContents';
import { type ParentProps } from 'solid-js';

export const TocLayout = (props: ParentProps<{ module: string; path: string }>) => {
  return (
    <div class={'flex justify-between'}>
      <article class={'w-full prose prose-sm max-w-none desktop:w-[calc(100%-14rem)]'}>{props.children}</article>
      <nav class={'hidden w-52 desktop:block'}>
        <TableOfContents module={props.module} path={props.path} />
      </nav>
    </div>
  );
};
