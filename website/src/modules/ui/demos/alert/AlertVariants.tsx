import { Alert, AlertDescription, AlertTitle } from '@resolid/ui';
import { ComponentExample } from '~/modules/ui/components/ComponentExample';

export const Demo = () => {
  return (
    <ComponentExample
      preview={() => (
        <div class={'flex flex-row justify-center gap-3'}>
          <Alert class={'w-full'}>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description</AlertDescription>
          </Alert>
          <Alert variant={'solid'} class={'w-full'}>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description</AlertDescription>
          </Alert>
          <Alert variant={'outline'} class={'w-full'}>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description</AlertDescription>
          </Alert>
        </div>
      )}
      snippet={`<div class={'flex flex-row justify-center gap-3'}>
  <Alert class={'w-full'}>
    <AlertTitle>Alert Title</AlertTitle>
    <AlertDescription>Alert Description</AlertDescription>
  </Alert>
  <Alert variant={'solid'} class={'w-full'}>
    <AlertTitle>Alert Title</AlertTitle>
    <AlertDescription>Alert Description</AlertDescription>
  </Alert>
  <Alert variant={'outline'} class={'w-full'}>
    <AlertTitle>Alert Title</AlertTitle>
    <AlertDescription>Alert Description</AlertDescription>
  </Alert>
</div>`}
    />
  );
};
