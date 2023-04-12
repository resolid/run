import type { PrimitiveProps } from '@resolid/ui';
import { cx } from '@resolid/utils';
import { splitProps } from 'solid-js';

export const DefaultLayout = (props: PrimitiveProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);

  return (
    <div class={cx('p-4', local.class)} {...rest}>
      {local.children}
    </div>
  );
};
