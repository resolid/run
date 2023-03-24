import { createSignal, Show } from 'solid-js';
import { Motion, MotionPresence } from '@resolid/ui';

export default function () {
  const [show, setShow] = createSignal(false);

  return (
    <div class={'flex flex-col gap-3'}>
      <p>About</p>
      <p>
        <button
          class={'border-gray-300 border px-3 py-1 rounded-sm hover:bg-gray-50'}
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
    </div>
  );
}
