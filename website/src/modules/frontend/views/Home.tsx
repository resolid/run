import { createRouteAction, useRouteData } from '@resolid/run';
import { createSignal, Show, Suspense } from 'solid-js';
import { type HomeData, increment } from './Home.data';
import { Motion, MotionPresence } from '@resolid/ui';

function Home() {
  const routeData = useRouteData<HomeData>();
  const [, submit] = createRouteAction(increment);
  const [show, setShow] = createSignal(false);

  return (
    <div class={'flex flex-col gap-3'}>
      <p>Home</p>
      <p>
        <Suspense fallback={'Loading'}>
          <Show when={routeData()} keyed>
            {routeData()?.count}
          </Show>
        </Suspense>
      </p>
      <p>
        <button class={'border-gray-300 border px-3 py-1 rounded-sm'} onClick={() => submit()}>
          Increment
        </button>
      </p>
      <p>
        <button class={'border-gray-300 border px-3 py-1 rounded-sm'} onClick={() => setShow((prev) => !prev)}>
          Animation
        </button>
      </p>
      <p>
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
      </p>
    </div>
  );
}

export default Home;
