import { cva, type VariantProps } from 'class-variance-authority';

export const spinnerVariants = cva(['inline-block animate-spin rounded-full'], {
  variants: {
    size: {
      xs: 'h-3 w-3 border-2',
      sm: 'h-4 w-4 border-2',
      md: 'h-5 w-5 border-2',
      lg: 'h-6 w-6 border-[3px]',
      xl: 'h-7 w-7 border-[3px]',
    },
    color: {
      primary: 'border-t-fg-primary border-r-fg-primary border-b-bg-primary border-l-bg-primary',
      neutral: 'border-t-fg-neutral border-r-fg-primary border-b-bg-neutral border-l-bg-neutral',
      success: 'border-t-fg-success border-r-fg-primary border-b-bg-success border-l-bg-success',
      warning: 'border-t-fg-warning border-r-fg-primary border-b-bg-warning border-l-bg-warning',
      danger: 'border-t-fg-danger border-r-fg-primary border-b-bg-danger border-l-bg-danger',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
