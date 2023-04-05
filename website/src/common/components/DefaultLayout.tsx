import type { ParentProps } from 'solid-js';

export const DefaultLayout = (props: ParentProps) => {
  return <div class={'p-4'}>{props.children}</div>;
};
