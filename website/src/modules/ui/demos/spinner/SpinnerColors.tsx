import { Spinner } from '@resolid/ui';
import { ComponentExample } from '~/modules/ui/components/ComponentExample';

export const Demo = () => {
  return (
    <ComponentExample
      preview={() => (
        <div class={'flex flex-row gap-3'}>
          <Spinner />
          <Spinner color={'success'} />
          <Spinner color={'warning'} />
          <Spinner color={'danger'} />
          <Spinner color={'neutral'} />
        </div>
      )}
      snippet={`<div class={'flex flex-row gap-3'}>
  <Spinner />
  <Spinner color={'success'} />
  <Spinner color={'warning'} />
  <Spinner color={'danger'} />
  <Spinner color={'neutral'} />
</div>`}
    />
  );
};
