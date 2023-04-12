import { testA11y, testRender } from '@resolid/tests';
import { describe, expect, test } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  test('should render correctly', async () => {
    const { getByText } = testRender(() => <VisuallyHidden>Click me</VisuallyHidden>);

    expect(getByText(/Click me/i)).toBeInTheDocument();
  });

  test('should have no accessibility violations', async () => {
    await testA11y(() => (
      <button>
        <VisuallyHidden>Click Me</VisuallyHidden>
        <span>Submit</span>
      </button>
    ));
  });
});
