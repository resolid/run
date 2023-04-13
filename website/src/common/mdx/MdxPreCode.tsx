import type { Language } from '@resolid/prism';
import type { ComponentProps } from 'solid-js';
import { Show } from 'solid-js';
import { CodeHighlight } from '~/common/components/CodeHighlight';

export const MdxCode = (props: ComponentProps<'code'>) => {
  return (
    <Show
      when={props.class}
      fallback={<code class={'m-0 px-[0.4em] py-[0.2em] bg-bg-subtle rounded text-sm'}>{props.children}</code>}
    >
      <div class={'rounded mt-6 border overflow-x-auto scrollbar scrollbar-thin'}>
        <CodeHighlight
          class={'p-3'}
          language={(props.class?.replace('language-', '') as Language) || 'jsx'}
          code={props.children as string}
        />
      </div>
    </Show>
  );
};
