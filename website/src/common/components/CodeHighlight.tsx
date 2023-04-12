import type { Language } from '@resolid/prism';

import { Highlight, Prism, nightOwl, nightOwlLight } from '@resolid/prism';
import { useColorMode } from '@resolid/ui';
import { cx } from '@resolid/utils';
import { For, splitProps, type ComponentProps } from 'solid-js';

export type CodeHighlightProps = Omit<ComponentProps<'pre'>, 'children' | 'style'> & {
  language: Language;
  code: string;
};

export const CodeHighlight = (props: CodeHighlightProps) => {
  const [local, rest] = splitProps(props, ['class', 'code', 'language']);

  const { darkMode } = useColorMode();

  const code = () => {
    return props.code?.replace(/\n$/, '') || '';
  };

  return (
    <Highlight code={code()} theme={darkMode() ? nightOwl : nightOwlLight} language={local.language} prism={Prism}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const children = (
          <For each={tokens}>
            {(line) => {
              return (
                <div {...getLineProps({ line })}>
                  <For each={line}>
                    {(token) => {
                      return <span {...getTokenProps({ token })} />;
                    }}
                  </For>
                </div>
              );
            }}
          </For>
        );

        return (
          <pre
            translate={'no'}
            class={cx(className, 'whitespace-pre-wrap text-sm', local.class)}
            style={style}
            {...rest}
          >
            {children}
          </pre>
        );
      }}
    </Highlight>
  );
};
