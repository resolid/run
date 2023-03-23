import { useRouteData } from '@resolid/run';
import { Show } from 'solid-js';
import { type HomeData } from './Home.data';

function Home() {
  const routeData = useRouteData<HomeData>();

  return (
    <div>
      <p>Home</p>
      <p>
        <Show when={routeData()} keyed>
          {routeData()?.message}
        </Show>
      </p>
    </div>
  );
}

export default Home;
