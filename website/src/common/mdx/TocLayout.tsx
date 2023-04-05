import { type GetMdxPath, TocSection } from './TocSection';
import { type ParentProps } from 'solid-js';

export const TocLayout = (props: ParentProps<{ getMdxPath: GetMdxPath }>) => {
  return (
    <div class={'flex justify-between'}>
      <article class={'prose prose-sm desktop:w-[calc(100%-14rem)] w-full max-w-none'}>{props.children}</article>
      <nav class={'desktop:block hidden w-52'}>
        <TocSection getMdxPath={props.getMdxPath} />
      </nav>
    </div>
  );
};
