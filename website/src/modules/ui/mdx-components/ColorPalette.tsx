import { tw } from '@twind/core';
import { For } from 'solid-js';
import { isString } from '@resolid/utils';

type Color = { name: string; value: Record<string, string> | string };

export const ColorPalette = () => {
  const themeColors = tw.config.theme.colors;

  const colors: Color[] = themeColors
    ? Object.keys(themeColors)
        .filter((key) => !['inherit', 'current', 'transparent'].includes(key))
        .map((key) => {
          const color = themeColors[key];

          return { name: key, value: color };
        })
    : [];

  return (
    <div class={'flex flex-col gap-5'}>
      <For each={colors}>
        {(color: Color) => (
          <div class={'flex flex-row gap-3'}>
            {isString(color.value) ? (
              <div class={'flex flex-row gap-3'}>
                <div
                  class={'dark:(ring-1 ring-inset ring-white/10) h-10 w-10 rounded'}
                  style={{
                    'background-color': tw.theme('colors', `${color.name}`, '#000').toString(),
                  }}
                />
                <div>
                  <div class={'font-medium capitalize'}>{color.name}</div>
                  <div class={'font-mono text-xs uppercase'}>{color.value}</div>
                </div>
              </div>
            ) : (
              <>
                <div class={'w-16 shrink-0'}>
                  <div class={'flex h-10 flex-col justify-center font-medium capitalize'}>{color.name}</div>
                </div>
                <div class={'grid min-w-0 flex-1 grid-cols-5 gap-3 tablet:grid-cols-10'}>
                  <For each={Object.keys(color.value)}>
                    {(key) => {
                      const value = (color.value as Record<string, string>)[key];

                      return (
                        <div class={'flex flex-col gap-1'}>
                          <div
                            class={'dark:(ring-1 ring-white/10) h-10 w-full rounded ring-inset'}
                            style={{
                              'background-color': tw.theme('colors', `${color.name}-${key}`, '#000').toString(),
                            }}
                          />
                          <div>
                            <div class={'font-medium capitalize'}>{key}</div>
                            <div class={'font-mono text-xs'}>{value}</div>
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>
              </>
            )}
          </div>
        )}
      </For>
    </div>
  );
};
