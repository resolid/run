import { Spinner, type SpinnerProps } from '@resolid/ui';
import { ComponentPlayground } from '~/modules/ui/components/ComponentPlayground';

export const Demo = () => {
  return (
    <ComponentPlayground<SpinnerProps>
      componentName={'Spinner'}
      componentProps={[
        {
          propName: 'size',
          control: 'select',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          defaultValue: 'md',
        },
        {
          propName: 'color',
          control: 'color',
          options: ['primary', 'neutral', 'success', 'warning', 'danger'],
          defaultValue: 'primary',
        },
      ]}
      preview={(props) => <Spinner {...props} />}
      snippet={`<Spinner {...props} />`}
    />
  );
};
