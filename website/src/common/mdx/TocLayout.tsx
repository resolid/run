import { type Accessor, type ParentProps } from 'solid-js';
import { TocSection, type TocItem } from './TocSection';

export const TocLayout = (props: ParentProps<{ toc: Accessor<TocItem[]> }>) => {
  return (
    <div class={'flex justify-between'}>
      <article class={'desktop:w-[calc(100%-14rem)] w-full max-w-none px-1'}>{props.children}</article>
      <nav class={'desktop:block hidden w-52'}>
        <TocSection toc={props.toc} />
      </nav>
    </div>
  );
};
