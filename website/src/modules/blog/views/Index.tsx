import { HelmetTitle } from '@resolid/run';
import { DefaultLayout } from '~/common/components/DefaultLayout';

export default function Index() {
  return (
    <>
      <HelmetTitle text={'Blog'} />
      <DefaultLayout>Blog</DefaultLayout>
    </>
  );
}
