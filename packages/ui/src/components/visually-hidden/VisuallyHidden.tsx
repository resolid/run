import type { ComponentProps } from 'solid-js';

export const VisuallyHidden = (props: ComponentProps<'span'>) => {
  return <span {...props} class={'sr-only'} />;
};
