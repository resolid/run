import type { PrimitiveProps } from '@resolid/ui';
import { splitProps } from 'solid-js';
import { cx } from '@resolid/utils';

export const DefaultLayout = (props: PrimitiveProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);

  return (
    <div class={cx('p-4', local.class)} {...rest}>
      {local.children}
    </div>
  );
};
