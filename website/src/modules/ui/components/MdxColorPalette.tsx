import { For } from 'solid-js';
import { isString } from '@resolid/utils';

// noinspection ES6PreferShortImport
import { colors } from '../../../../../packages/tailwind/src/tokens/colors';

type Color = { name: string; value: Record<string, string> | string };

export const MdxColorPalette = () => {
  const themeColors: Color[] = Object.keys(colors)
    .filter((key) => !['inherit', 'current', 'transparent'].includes(key))
    .map((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const color = colors[key];

      return { name: key, value: color };
    });

  return (
    <div class={'flex flex-col gap-5'}>
      <For each={themeColors}>
        {(color: Color) => (
          <div class={'flex flex-row gap-3'}>
            {isString(color.value) ? (
              <div class={'flex flex-row gap-3'}>
                <div
                  class={'dark:(ring-1 ring-white/10) h-10 w-10 rounded ring-inset'}
                  style={{
                    'background-color': color.value,
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
                <div class={'tablet:grid-cols-10 grid min-w-0 flex-1 grid-cols-5 gap-3'}>
                  <For each={Object.keys(color.value)}>
                    {(key) => {
                      const value = (color.value as Record<string, string>)[key];

                      return (
                        <div class={'flex flex-col gap-1'}>
                          <div
                            class={'h-10 w-full rounded ring-inset dark:ring-1 dark:ring-white/10'}
                            style={{
                              'background-color': value,
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