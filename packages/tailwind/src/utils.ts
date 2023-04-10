// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flattenColorPalette = (colors: Record<string, any>): Record<string, string> =>
  Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(flattenColorPalette(values)).map(([name, value]) => ({
            [`${color}-${name}`]: value,
          }))
        : [{ [color]: values }]
    )
  );

export const hexToRGB = (hex: string) => {
  const rgb = { r: 0, g: 0, b: 0 };

  if (hex.length == 4) {
    rgb.r = parseInt(hex[1] + hex[1], 16);
    rgb.g = parseInt(hex[2] + hex[2], 16);
    rgb.b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length == 7) {
    rgb.r = parseInt(hex[1] + hex[2], 16);
    rgb.g = parseInt(hex[3] + hex[4], 16);
    rgb.b = parseInt(hex[5] + hex[6], 16);
  }

  return rgb;
};
