/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@resolid/tailwind')()],
  content: [
    './src/**/*.{js,ts,tsx}',
    './node_modules/@resolid/ui/dist/**/*.{js,cjs,mjs}',
    './node_modules/@resolid/ui/src/**/*.{ts,tsx}',
  ],
  theme: {},
};
