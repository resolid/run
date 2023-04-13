import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'select-none appearance-none outline-none',
    'whitespace-nowrap border transition-colors',
    'disabled:(cursor-not-allowed opacity-50)',
  ],
  {
    variants: {
      size: { xs: 'h-6 px-3 text-sm', sm: 'h-7 px-4', md: 'h-8 px-5', lg: 'h-9 px-6', xl: 'h-10 px-7 text-lg' },
      variant: {
        solid: 'text-fg-emphasized',
        outline: 'bg-bg-default',
        light: '',
        link: '',
      },
      color: {
        primary: '',
        neutral: '',
        success: '',
        warning: '',
        danger: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'solid',
      color: 'primary',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
