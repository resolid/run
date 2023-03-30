import { Alert, AlertDescription, AlertIcon, AlertTitle } from './Alert';
import { describe, expect, test } from 'vitest';
import { testRender, testA11y } from '@resolid/tests';

describe('Alert', () => {
  test('passes a11y test', async () => {
    await testA11y(() => (
      <Alert>
        <AlertIcon />
        <AlertTitle>Alert title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    ));
  });

  test("should have role='alert'", async () => {
    const { getByRole } = testRender(() => (
      <Alert>
        <AlertIcon />
        <AlertTitle>Alert title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    ));

    expect(getByRole('alert')).toBeInTheDocument();
  });
});
