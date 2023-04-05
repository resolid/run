import { type TocItem, TocSection } from './TocSection';
import { type Accessor, type ParentProps } from 'solid-js';

export const TocLayout = (props: ParentProps<{ toc: Accessor<TocItem[]> }>) => {
  return (
    <div class={'flex justify-between'}>
      <article class={'prose prose-sm desktop:w-[calc(100%-14rem)] w-full max-w-none'}>{props.children}</article>
      <nav class={'desktop:block hidden w-52'}>
        <TocSection toc={props.toc} />
      </nav>
    </div>
  );
};
