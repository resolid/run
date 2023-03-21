import { createResource } from 'solid-js';

const createDelay = (): Promise<number> => {
  return new Promise((resolve) => {
    const delay = Math.random() * 420 + 160;
    setTimeout(() => resolve(delay), delay);
  });
};

export const AsyncComponent = () => {
  const [time] = createResource<number>(createDelay);

  return <div>Async Component after {time()?.toFixed()}ms.</div>;
};
