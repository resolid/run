import { createRouteAction, useRouteData } from '@resolid/run';
import { createSignal, Show, Suspense } from 'solid-js';
import { Alert, Button, Motion, MotionPresence } from '@resolid/ui';
import { type HomeData, increment } from './Home.data';

function Home() {
  const routeData = useRouteData<HomeData>();
  const [, submit] = createRouteAction(increment);
  const [show, setShow] = createSignal(false);

  return (
    <div class={'flex flex-col gap-3'}>
      <p>Home</p>
      <div>
        <Alert>测试</Alert>
      </div>
      <p>
        <Suspense fallback={'Loading'}>
          <Show when={routeData()} keyed>
            {routeData()?.count}
          </Show>
        </Suspense>
      </p>
      <p>
        <Button onClick={() => submit()}>Increment</Button>
      </p>
      <p>
        <Button color={'gray'} variant={'outline'} onClick={() => setShow((prev) => !prev)}>
          Animation
        </Button>
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
    </div>
  );
}

export default Home;
