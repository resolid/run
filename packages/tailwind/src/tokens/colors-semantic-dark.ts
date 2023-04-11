import { colorsPalette } from './colors-palette';

export const colorsSemanticDark = {
  fg: {
    default: colorsPalette.gray[200],
    emphasized: colorsPalette.gray[500],
    muted: colorsPalette.gray[300],
    subtle: colorsPalette.gray[400],

    primary: colorsPalette.blue[200],
    success: colorsPalette.green[200],
    warning: colorsPalette.yellow[200],
    danger: colorsPalette.red[200],
  },

  bg: {
    default: colorsPalette.gray[900],
    muted: colorsPalette.gray[600],
    subtle: colorsPalette.gray[700],
    accent: colorsPalette.blue[800],

    primary: {
      DEFAULT: colorsPalette.blue[900],
      hovered: colorsPalette.blue[800],
      pressed: colorsPalette.blue[700],
      emphasis: {
        DEFAULT: colorsPalette.blue[300],
        hovered: colorsPalette.blue[200],
        pressed: colorsPalette.blue[100],
      },
    },

    neutral: {
      DEFAULT: colorsPalette.gray[900],
      hovered: colorsPalette.gray[800],
      pressed: colorsPalette.gray[700],
      emphasis: {
        DEFAULT: colorsPalette.gray[300],
        hovered: colorsPalette.gray[200],
        pressed: colorsPalette.gray[100],
      },
    },

    success: {
      DEFAULT: colorsPalette.green[900],
      hovered: colorsPalette.green[800],
      pressed: colorsPalette.green[700],
      emphasis: {
        DEFAULT: colorsPalette.green[300],
        hovered: colorsPalette.green[200],
        pressed: colorsPalette.green[100],
      },
    },

    warning: {
      DEFAULT: colorsPalette.yellow[900],
      hovered: colorsPalette.yellow[800],
      pressed: colorsPalette.yellow[700],
      emphasis: {
        DEFAULT: colorsPalette.yellow[300],
        hovered: colorsPalette.yellow[200],
        pressed: colorsPalette.yellow[100],
      },
    },

    danger: {
      DEFAULT: colorsPalette.red[900],
      hovered: colorsPalette.red[800],
      pressed: colorsPalette.red[700],
      emphasis: {
        DEFAULT: colorsPalette.red[300],
        hovered: colorsPalette.red[200],
        pressed: colorsPalette.red[100],
      },
    },
  },
  border: {
    default: colorsPalette.gray[600],
  },
  link: {
    DEFAULT: colorsPalette.blue[300],
    pressed: colorsPalette.blue[400],
  },
};
