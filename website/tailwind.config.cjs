const resolid = require('@resolid/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [resolid()],
  content: ['./src/**/*.{js,ts,tsx}'],
  theme: {},
};
