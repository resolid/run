import plugin from 'tailwindcss/plugin';

export const scrollbar = plugin(({ addUtilities, theme }) => {
  addUtilities({
    '.scrollbar': {
      '&::-webkit-scrollbar-thumb': {
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderRadius: '5px',
        backgroundClip: 'padding-box',
        backgroundColor: theme('colors.gray.200'),
      },
    },
    '.scrollbar-base': {
      '&::-webkit-scrollbar': {
        width: '12px',
        height: '12px',
      },
    },
    '.scrollbar-thin': {
      '&::-webkit-scrollbar': {
        width: '9px',
        height: '9px',
      },
    },
  });
});
