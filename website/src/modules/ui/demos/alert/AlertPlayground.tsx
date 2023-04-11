import { Alert, AlertDescription, AlertIcon, AlertTitle, type AlertProps } from '@resolid/ui';
import { Info } from '~/common/icons/Info';
import { ComponentPlayground } from '~/modules/ui/components/ComponentPlayground';

export const Demo = () => {
  return (
    <ComponentPlayground<AlertProps>
      componentName={'Alert'}
      componentProps={[
        {
          propName: 'variant',
          control: 'select',
          options: ['light', 'solid', 'outline'],
          defaultValue: 'light',
        },
        {
          propName: 'color',
          control: 'color',
          options: ['primary', 'neutral', 'success', 'warning', 'danger'],
          defaultValue: 'primary',
        },
      ]}
      preview={(props) => (
        <Alert {...props}>
          <AlertIcon>
            <Info size={'sm'} />
          </AlertIcon>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert Description</AlertDescription>
        </Alert>
      )}
      snippet={`<Alert {...props}>
  <AlertIcon>
    <Info size={'sm'} />
  </AlertIcon>
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Alert Description</AlertDescription>
</Alert>`}
    />
  );
};
