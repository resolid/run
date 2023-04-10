import { isString } from '@resolid/utils';
import { For } from 'solid-js';

// noinspection ES6PreferShortImport
import { colorsPalette } from '../../../../../packages/tailwind/src/tokens/colors-palette';

type Color = { name: string; value: Record<string, string> | string };

export const MdxColorPalette = () => {
  const themeColors: Color[] = Object.keys(colorsPalette)
    .filter((key) => !['inherit', 'current', 'transparent'].includes(key))
    .map((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const color = colorsPalette[key];

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
                  class={'h-10 w-10 rounded border'}
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
                            class={'h-10 w-full rounded border'}
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
