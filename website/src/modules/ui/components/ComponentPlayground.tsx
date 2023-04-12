import type { JSXElement } from 'solid-js';
import { createEffect, For, Match, Show, Switch } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Check } from '~/common/icons/Check';

export type ComponentPlaygroundProps<ComponentProps> = {
  componentName: string;
  componentProps: {
    propName: Extract<keyof ComponentProps, string>;
    control?: 'select' | 'input' | 'color' | 'radio' | 'number' | 'placement' | 'switch';
    options?: ComponentProps[Extract<keyof ComponentProps, string>][];
    labels?: string[];
    defaultValue?: ComponentProps[Extract<keyof ComponentProps, string>];
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: (props: ComponentProps) => JSXElement;
  snippet: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any
export const ComponentPlayground = <T extends { [k: string]: any } = {}>(props: ComponentPlaygroundProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any
  const [demoProps, setDemoProps] = createStore<T>({} as T);
  const [codeProps, setCodeProps] = createStore<T>({} as T);

  createEffect(() => {
    props.componentProps.forEach((p) => {
      // @ts-expect-error Argument of type
      setDemoProps(p.propName, p.defaultValue);

      if (!p.control) {
        // @ts-expect-error Argument of type
        setCodeProps(p.propName, p.defaultValue);
      }
    });
  });

  const codePropsReplace = () => {
    const propsReplace = Object.keys(codeProps)
      .map((p) => {
        return `${p}="${codeProps[p]}"`;
      })
      .join(' ');

    return propsReplace.length > 0 ? ` ${propsReplace}` : propsReplace;
  };

  return (
    <div class={'flex min-h-[20em] flex-col laptop:flex-row w-full rounded border'}>
      <div class={'flex flex-1 flex-col p-5'}>
        <div class={'m-auto flex-grow flex items-center'}>{props.preview(demoProps)}</div>
        <pre class={'bg-black rounded text-fg-emphasized p-4 mt-6 overflow-x-auto scrollbar scrollbar-thin'}>
          <code class={'text-xs'}>{props.snippet.replace(' {...props}', codePropsReplace())}</code>
        </pre>
      </div>
      <div class={'flex-shrink-0 gap-2 p-3 min-w-[15em] laptop:border-t-0 laptop:border-s border-t'}>
        <div>
          <h3 class={'font-medium text-lg mb-3'}>Playground</h3>
        </div>
        <div class={'flex flex-col gap-2'}>
          <For each={props.componentProps}>
            {(prop) => {
              if (!prop.control) {
                return null;
              }

              const propValue = () => demoProps[prop.propName] ?? prop.defaultValue;

              return (
                <div class={'flex flex-row laptop:flex-col justify-between laptop:items-start items-center gap-1.5'}>
                  <label class={'capitalize'}>{prop.propName}</label>

                  <Switch>
                    <Match when={prop.control == 'select'}>
                      <select
                        class={'px-2 h-8 border rounded laptop:w-full w-auto'}
                        value={(propValue() || '') as string}
                        onChange={(e) => {
                          // @ts-expect-error Argument of type
                          setDemoProps(prop.propName, e.target.value);
                          // @ts-expect-error Argument of type
                          setCodeProps(prop.propName, e.target.value);
                        }}
                      >
                        <For each={prop.options}>{(option) => <option value={option}>{option}</option>}</For>
                      </select>
                    </Match>
                    <Match when={prop.control == 'color'}>
                      <div class={'inline-flex gap-1 justify-between w-auto laptop:w-full'}>
                        <For each={prop.options}>
                          {(option) => (
                            <button
                              title={option}
                              style={{ 'background-color': `rgb(var(--re-bg-${option}-emphasis)` }}
                              class={'w-8 h-8 flex items-center justify-center rounded'}
                              onClick={() => {
                                // @ts-expect-error Argument of type
                                setDemoProps(prop.propName, option);
                                // @ts-expect-error Argument of type
                                setCodeProps(prop.propName, option);
                              }}
                            >
                              <Show when={propValue() == option}>
                                <Check stroke-width={'3'} class={'text-white dark:text-black'} size={'xs'} />
                              </Show>
                            </button>
                          )}
                        </For>
                      </div>
                    </Match>
                  </Switch>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};
