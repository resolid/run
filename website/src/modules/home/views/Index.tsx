import { HelmetTitle, createRouteAction, useRouteData } from '@resolid/run';
import { Motion, MotionPresence } from '@resolid/ui';
import { Show, Suspense, createSignal } from 'solid-js';
import { DefaultLayout } from '~/common/components/DefaultLayout';
import { decrement, increment, type HomeData } from './Index.data';

function Index() {
  const routeData = useRouteData<HomeData>();
  const [, submitIncrement] = createRouteAction(increment);
  const [, submitDecrement] = createRouteAction(decrement);
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
        <p class={'flex gap-3'}>
          <button
            class={
              'px-3 py-1.5 rounded bg-bg-primary-emphasis hover:bg-bg-primary-emphasis-hovered active:bg-bg-primary-emphasis-pressed text-fg-emphasized'
            }
            onClick={() => submitIncrement()}
          >
            Increment
          </button>
          <button
            class={
              'px-3 py-1.5 rounded bg-bg-primary-emphasis hover:bg-bg-primary-emphasis-hovered active:bg-bg-primary-emphasis-pressed text-fg-emphasized'
            }
            onClick={() => submitDecrement()}
          >
            Decrement
          </button>
        </p>
        <p>
          <button
            class={
              'px-3 py-1.5 rounded bg-bg-primary-emphasis hover:bg-bg-primary-emphasis-hovered active:bg-bg-primary-emphasis-pressed text-fg-emphasized'
            }
            onClick={() => setShow((prev) => !prev)}
          >
            Animation
          </button>
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
