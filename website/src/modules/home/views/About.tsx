import { HelmetTitle } from '@resolid/run';
import { DefaultLayout } from '~/common/components/DefaultLayout';

export default function About() {
  return (
    <>
      <HelmetTitle text={'About'} />
      <DefaultLayout>About</DefaultLayout>
    </>
  );
}
