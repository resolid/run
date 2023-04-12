import { type JSXElement } from 'solid-js';

export type ComponentExampleProps = {
  preview: () => JSXElement;
  snippet: string;
};

export const ComponentExample = (props: ComponentExampleProps) => {
  return (
    <div class={'my-4 border rounded'}>
      <div class={'overflow-x-auto scrollbar scrollbar-thin p-3'}>{props.preview()}</div>
      <pre class={'p-4 bg-black text-white overflow-x-auto scrollbar scrollbar-thin'}>
        <code class={'text-xs'}>{props.snippet}</code>
      </pre>
    </div>
  );
};
