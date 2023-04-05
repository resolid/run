/** @type {import('tailwindcss').Config} */

module.exports = {
  presets: [require('@resolid/tailwind')],
  content: ['./src/**/*.{js,ts,tsx}'],
  theme: {},
  plugins: [require('@tailwindcss/typography')],
};
