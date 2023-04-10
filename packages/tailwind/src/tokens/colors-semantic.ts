import { colorsPalette } from './colors-palette';

export const colorsSemantic = {
  light: {
    fg: {
      default: colorsPalette.gray[900],
      emphasized: colorsPalette.gray[700],
      muted: colorsPalette.gray[600],
      subtle: colorsPalette.gray[500],
    },
    bg: {
      default: colorsPalette.white,
      muted: colorsPalette.gray[200],
      subtle: colorsPalette.gray[100],
    },
    border: {
      default: colorsPalette.gray[200],
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
      muted: colorsPalette.gray[400],
      subtle: colorsPalette.gray[500],
    },
    border: {
      default: colorsPalette.gray[400],
    },
  },
};
