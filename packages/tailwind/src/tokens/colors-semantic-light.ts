import { colorsPalette } from './colors-palette';

export const colorsSemanticLight = {
  fg: {
    default: colorsPalette.black,
    emphasized: colorsPalette.white,
    muted: colorsPalette.gray[800],
    subtle: colorsPalette.gray[700],

    primary: colorsPalette.blue[700],
    success: colorsPalette.green[800],
    warning: colorsPalette.yellow[800],
    danger: colorsPalette.red[800],
  },
  bg: {
    default: colorsPalette.white,
    muted: colorsPalette.gray[200],
    subtle: colorsPalette.gray[100],
    accent: colorsPalette.blue[50],

    primary: {
      DEFAULT: colorsPalette.blue[50],
      hovered: colorsPalette.blue[100],
      pressed: colorsPalette.blue[200],
      emphasis: {
        DEFAULT: colorsPalette.blue[600],
        hovered: colorsPalette.blue[700],
        pressed: colorsPalette.blue[800],
      },
    },

    neutral: {
      DEFAULT: colorsPalette.gray[50],
      hovered: colorsPalette.gray[100],
      pressed: colorsPalette.gray[200],
      emphasis: {
        DEFAULT: colorsPalette.gray[600],
        hovered: colorsPalette.gray[700],
        pressed: colorsPalette.gray[800],
      },
    },

    success: {
      DEFAULT: colorsPalette.green[50],
      hovered: colorsPalette.green[100],
      pressed: colorsPalette.green[200],
      emphasis: {
        DEFAULT: colorsPalette.green[600],
        hovered: colorsPalette.green[700],
        pressed: colorsPalette.green[800],
      },
    },

    warning: {
      DEFAULT: colorsPalette.yellow[50],
      hovered: colorsPalette.yellow[100],
      pressed: colorsPalette.yellow[200],
      emphasis: {
        DEFAULT: colorsPalette.yellow[600],
        hovered: colorsPalette.yellow[700],
        pressed: colorsPalette.yellow[800],
      },
    },

    danger: {
      DEFAULT: colorsPalette.red[50],
      hovered: colorsPalette.red[100],
      pressed: colorsPalette.red[200],
      emphasis: {
        DEFAULT: colorsPalette.red[600],
        hovered: colorsPalette.red[700],
        pressed: colorsPalette.red[800],
      },
    },
  },
  border: {
    default: colorsPalette.gray[200],
  },
  link: {
    DEFAULT: colorsPalette.blue[500],
    pressed: colorsPalette.blue[600],
  },
};
