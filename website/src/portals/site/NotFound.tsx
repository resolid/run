import { HelmetTitle } from '@resolid/run';
import { DefaultLayout } from '~/common/components/DefaultLayout';

export default function NotFound() {
  return (
    <>
      <HelmetTitle text={'Not Found'} />
      <DefaultLayout>Not found</DefaultLayout>
    </>
  );
}
