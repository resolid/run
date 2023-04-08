import { createRouteAction, useRouteData, HelmetTitle } from '@resolid/run';
import { createSignal, Show, Suspense } from 'solid-js';
import { Motion, MotionPresence } from '@resolid/ui';
import { type HomeData, increment } from './Index.data';
import { DefaultLayout } from '~/common/components/DefaultLayout';

function Index() {
  const routeData = useRouteData<HomeData>();
  const [, submit] = createRouteAction(increment);
  const [show, setShow] = createSignal(false);

  return (
    <>
      <HelmetTitle text={''} />
      <DefaultLayout class={'flex flex-col gap-4'}>
        <p>Home</p>
        <p>
          <Suspense fallback={'Loading'}>
            <Show when={routeData()} keyed>
              {routeData()?.count}
            </Show>
          </Suspense>
        </p>
        <p>
          <button onClick={() => submit()}>Increment</button>
        </p>
        <p>
          <button onClick={() => setShow((prev) => !prev)}>Animation</button>
        </p>
        <div>
          <MotionPresence>
            <Show when={show()} keyed>
              <Motion
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3 }}
              >
                <p>Motion One</p>
              </Motion>
            </Show>
          </MotionPresence>
        </div>
      </DefaultLayout>
    </>
  );
}

export default Index;
