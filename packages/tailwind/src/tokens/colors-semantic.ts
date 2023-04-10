import { colorsPalette } from './colors-palette';

export const colorsSemantic = {
  light: {
    fg: {
      default: colorsPalette.black,
      emphasized: colorsPalette.white,
      muted: colorsPalette.gray[600],
      subtle: colorsPalette.gray[500],
    },
    bg: {
      default: colorsPalette.white,
      muted: colorsPalette.gray[200],
      subtle: colorsPalette.gray[100],
      accent: colorsPalette.blue[50],
    },
    border: {
      default: colorsPalette.gray[200],
    },
    link: {
      DEFAULT: colorsPalette.blue[500],
      pressed: colorsPalette.blue[600],
    },
  },
  dark: {
    fg: {
      default: colorsPalette.gray[200],
      emphasized: colorsPalette.gray[500],
      muted: colorsPalette.gray[300],
      subtle: colorsPalette.gray[400],
    },
    bg: {
      default: colorsPalette.gray[900],
      muted: colorsPalette.gray[600],
      subtle: colorsPalette.gray[700],
      accent: colorsPalette.blue[800],
    },
    border: {
      default: colorsPalette.gray[600],
    },
    link: {
      DEFAULT: colorsPalette.blue[300],
      pressed: colorsPalette.blue[400],
    },
  },
};
