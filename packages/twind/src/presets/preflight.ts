import { type Preflight } from '@twind/core';
import theme from './theme';

// FROM: https://www.joshwcomeau.com/css/custom-css-reset/

const preflight: Preflight = {
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  '*': {
    margin: '0',
  },
  'body,html': {
    height: '100%',
  },
  html: {
    colorScheme: 'light',
    fontFamily: `theme(fontFamily.sans, ${theme.fontFamily.sans})`,
  },
  body: {
    fontSize: `theme(fontSize.base[0], ${theme.fontSize.base[0]})`,
    lineHeight: `theme(fontSize.base[1], ${theme.fontSize.base[1]})`,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  '.dark': {
    colorScheme: 'dark',
  },
  'img,picture,video,canvas,svg': {
    display: 'block',
    maxWidth: '100%',
  },
  'input,button,textarea,select': {
    font: 'initial',
  },
  button: {
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  'p,h1,h2,h3,h4,h5,h6': {
    overflowWrap: 'break-word',
  },
  'code,pre,samp,kbd': {
    fontFamily: `theme(fontFamily.mono, ${theme.fontFamily.mono})`,
  },
};

export default preflight;
