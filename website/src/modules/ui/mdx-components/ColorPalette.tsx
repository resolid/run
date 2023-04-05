import { For } from 'solid-js';
import { isString } from '@resolid/utils';

type Color = { name: string; value: Record<string, string> | string };

export const ColorPalette = () => {
  const themeColors = {
    black: '#091E42',
    white: '#ffffff',

    gray: {
      50: '#F7F8F9',
      100: '#F1F2F4',
      200: '#DCDFE4',
      300: '#B3B9C4',
      400: '#8590A2',
      500: '#758195',
      600: '#626F86',
      700: '#44546F',
      800: '#2C3E5D',
      900: '#172B4D',
    },

    blue: {
      50: '#E9F2FF',
      100: '#CCE0FF',
      200: '#85B8FF',
      300: '#579DFF',
      400: '#388BFF',
      500: '#1D7AFC',
      600: '#0C66E4',
      700: '#0055CC',
      800: '#09326C',
      900: '#082145',
    },

    green: {
      50: '#DFFCF0',
      100: '#BAF3DB',
      200: '#7EE2B8',
      300: '#4BCE97',
      400: '#2ABB7F',
      500: '#22A06B',
      600: '#1F845A',
      700: '#216E4E',
      800: '#164B35',
      900: '#133527',
    },

    red: {
      50: '#FFEDEB',
      100: '#FFD2CC',
      200: '#FF9C8F',
      300: '#F87462',
      400: '#EF5C48',
      500: '#E34935',
      600: '#CA3521',
      700: '#AE2A19',
      800: '#601E16',
      900: '#391813',
    },

    yellow: {
      50: '#FFF7D6',
      100: '#F8E6A0',
      200: '#F5CD47',
      300: '#E2B203',
      400: '#CF9F02',
      500: '#B38600',
      600: '#946F00',
      700: '#7F5F01',
      800: '#533F04',
      900: '#3D2E00',
    },
  };

  const colors: Color[] = themeColors
    ? Object.keys(themeColors)
        .filter((key) => !['inherit', 'current', 'transparent'].includes(key))
        .map((key) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
