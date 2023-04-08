import { DefaultLayout } from '~/common/components/DefaultLayout';
import { HelmetTitle } from '@resolid/run';

export default function About() {
  return (
    <>
      <HelmetTitle text={'About'} />
      <DefaultLayout>About</DefaultLayout>
    </>
  );
}
