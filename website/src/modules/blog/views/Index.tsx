import { DefaultLayout } from '~/common/components/DefaultLayout';
import { HelmetTitle } from '@resolid/run';

export default function Index() {
  return (
    <>
      <HelmetTitle text={'Blog'} />
      <DefaultLayout>Blog</DefaultLayout>
    </>
  );
}
