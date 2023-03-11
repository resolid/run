import { css } from '@twind/core';

// FROM: https://www.joshwcomeau.com/css/custom-css-reset/

export default css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html,
  body {
    height: 100%;
  }

  html {
    @apply font-sans;
    color-scheme: light;
  }

  body {
    @apply text-base antialiased;
  }

  .dark {
    color-scheme: dark;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  button {
    border: none;
    cursor: pointer;
    background-color: transparent;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }
`;
