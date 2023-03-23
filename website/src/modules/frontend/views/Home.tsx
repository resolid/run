import { createRouteAction, useRouteData } from '@resolid/run';
import { Show, Suspense } from 'solid-js';
import { type HomeData, increment } from './Home.data';

function Home() {
  const routeData = useRouteData<HomeData>();
  const [, submit] = createRouteAction(increment);

  return (
    <div>
      <p>Home</p>
      <p>
        <Suspense fallback={'Loading'}>
          <Show when={routeData()} keyed>
            {routeData()?.count}
          </Show>
        </Suspense>
      </p>
      <p>
        <button class={'border-gray-300 border px-3 py-1'} onClick={() => submit()}>
          Increment
        </button>
      </p>
    </div>
  );
}

export default Home;
