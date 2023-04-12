import { Spinner } from '@resolid/ui';
import { ComponentExample } from '~/modules/ui/components/ComponentExample';

export const Demo = () => {
  return (
    <ComponentExample
      preview={() => (
        <div class={'flex flex-row gap-3'}>
          <Spinner size={'xs'} />
          <Spinner size={'sm'} />
          <Spinner />
          <Spinner size={'lg'} />
          <Spinner size={'xl'} />
        </div>
      )}
      snippet={`<div class={'flex flex-row gap-3'}>
  <Spinner size={'xs'} />
  <Spinner size={'sm'} />
  <Spinner />
  <Spinner size={'lg'} />
  <Spinner size={'xl'} />
</div>`}
    />
  );
};
