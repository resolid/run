import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@resolid/ui';
import { Info } from '~/common/icons/Info';
import { ComponentExample } from '~/modules/ui/components/ComponentExample';

export const Demo = () => {
  return (
    <ComponentExample
      preview={() => (
        <div class={'flex flex-col justify-center gap-3'}>
          <Alert class={'w-full'}>
            <AlertIcon>
              <Info size={'sm'} />
            </AlertIcon>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description</AlertDescription>
          </Alert>
          <Alert color={'success'} class={'w-full'}>
            <AlertIcon>
              <Info size={'sm'} />
            </AlertIcon>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description</AlertDescription>
          </Alert>
          <Alert color={'warning'} class={'w-full'}>
            <AlertIcon>
              <Info size={'sm'} />
            </AlertIcon>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description</AlertDescription>
          </Alert>
          <Alert color={'danger'} class={'w-full'}>
            <AlertIcon>
              <Info size={'sm'} />
            </AlertIcon>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description</AlertDescription>
          </Alert>
          <Alert color={'neutral'} class={'w-full'}>
            <AlertIcon>
              <Info size={'sm'} />
            </AlertIcon>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>Alert Description</AlertDescription>
          </Alert>
        </div>
      )}
      snippet={`<div class={'flex flex-col justify-center gap-3'}>
  <Alert class={'w-full'}>
    <AlertIcon>
      <Info size={'sm'} />
    </AlertIcon>
    <AlertTitle>Alert Title</AlertTitle>
    <AlertDescription>Alert Description</AlertDescription>
  </Alert>
  <Alert color={'success'} class={'w-full'}>
    <AlertIcon>
      <Info size={'sm'} />
    </AlertIcon>
    <AlertTitle>Alert Title</AlertTitle>
    <AlertDescription>Alert Description</AlertDescription>
  </Alert>
  <Alert color={'warning'} class={'w-full'}>
    <AlertIcon>
      <Info size={'sm'} />
    </AlertIcon>
    <AlertTitle>Alert Title</AlertTitle>
    <AlertDescription>Alert Description</AlertDescription>
  </Alert>
  <Alert color={'danger'} class={'w-full'}>
    <AlertIcon>
      <Info size={'sm'} />
    </AlertIcon>
    <AlertTitle>Alert Title</AlertTitle>
    <AlertDescription>Alert Description</AlertDescription>
  </Alert>
  <Alert color={'neutral'} class={'w-full'}>
    <AlertIcon>
      <Info size={'sm'} />
    </AlertIcon>
    <AlertTitle>Alert Title</AlertTitle>
    <AlertDescription>Alert Description</AlertDescription>
  </Alert>
</div>`}
    />
  );
};
