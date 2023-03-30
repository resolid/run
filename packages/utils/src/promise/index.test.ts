import { to, wait } from './index';
import { describe, expect, test } from 'vitest';

describe('utils/promise', () => {
  test('async await', async () => {
    const start = performance.now();
    await wait(20);
    expect(performance.now() - start).toBeGreaterThanOrEqual(19);
  });

  test('should return a value when resolved', async () => {
    const testInput = 41;
    const promise = Promise.resolve(testInput);

    const [err, data] = await to<number>(promise);

    expect(err).toBeNull();
    expect(data).toEqual(testInput);
  });

  test('should return an error when promise is rejected', async () => {
    const promise = Promise.reject('Error');

    const [err, data] = await to<number>(promise);

    expect(err).toEqual('Error');
    expect(data).toBeUndefined();
  });

  test('should receive the type of the parent if no type was passed', async () => {
    const [, user] = await to<{ name: string }>(Promise.resolve({ name: 'userName' }));

    expect(user?.name).toEqual('userName');
  });
});
