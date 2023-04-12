import { type JSXElement } from 'solid-js';
import { CodeHighlight } from '~/common/components/CodeHighlight';

export type ComponentExampleProps = {
  preview: () => JSXElement;
  snippet: string;
};

export const ComponentExample = (props: ComponentExampleProps) => {
  return (
    <div class={'my-4 border rounded'}>
      <div class={'overflow-x-auto scrollbar scrollbar-thin p-3'}>{props.preview()}</div>
      <CodeHighlight
        class={'rounded p-3 border-t overflow-x-auto scrollbar scrollbar-thin'}
        language={'jsx'}
        code={props.snippet}
      />
    </div>
  );
};
