import { type ParentProps } from 'solid-js';

export const AsideLayoutMain = (props: ParentProps) => {
  return (
    <div class={'tablet:ps-56'}>
      <main class={'tablet:pt-4 mx-auto h-full p-4 pt-16'}>{props.children}</main>
    </div>
  );
};
