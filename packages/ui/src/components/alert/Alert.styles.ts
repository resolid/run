import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(['relative flex items-center gap-2 overflow-hidden rounded border p-3'], {
  variants: {
    color: {
      primary: '',
      neutral: '',
      success: '',
      warning: '',
      danger: '',
    },
    variant: {
      solid: 'text-fg-emphasized',
      outline: 'bg-bg-default',
      light: '',
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      color: 'primary',
      class: 'bg-bg-primary-emphasis border-bg-primary-emphasis',
    },
    {
      variant: 'solid',
      color: 'neutral',
      class: 'bg-bg-neutral-emphasis border-bg-neutral-emphasis',
    },
    {
      variant: 'solid',
      color: 'success',
      class: 'bg-bg-success-emphasis border-bg-success-emphasis',
    },
    {
      variant: 'solid',
      color: 'warning',
      class: 'bg-bg-warning-emphasis border-bg-warning-emphasis',
    },
    {
      variant: 'solid',
      color: 'danger',
      class: 'bg-bg-danger-emphasis border-bg-danger-emphasis',
    },
    {
      variant: 'outline',
      color: 'primary',
      class: 'border-bg-primary-emphasis text-fg-primary',
    },
    {
      variant: 'outline',
      color: 'neutral',
      class: 'border-bg-neutral-emphasis text-fg-neutral',
    },
    {
      variant: 'outline',
      color: 'success',
      class: 'border-bg-success-emphasis text-fg-success',
    },
    {
      variant: 'outline',
      color: 'warning',
      class: 'border-bg-warning-emphasis text-fg-warning',
    },
    {
      variant: 'outline',
      color: 'danger',
      class: 'border-bg-danger-emphasis text-fg-danger',
    },
    {
      variant: 'light',
      color: 'primary',
      class: 'bg-bg-primary border-bg-primary text-fg-primary',
    },
    {
      variant: 'light',
      color: 'neutral',
      class: 'bg-bg-neutral border-bg-neutral text-fg-neutral',
    },
    {
      variant: 'light',
      color: 'success',
      class: 'bg-bg-success border-bg-success text-fg-success',
    },
    {
      variant: 'light',
      color: 'warning',
      class: 'bg-bg-warning border-bg-warning text-fg-warning',
    },
    {
      variant: 'light',
      color: 'danger',
      class: 'bg-bg-danger border-bg-danger text-fg-danger',
    },
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'light',
  },
});

export type AlertVariants = VariantProps<typeof alertVariants>;
