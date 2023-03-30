import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { toHaveNoViolations } from './a11y/axe';

expect.extend(matchers);
expect.extend(toHaveNoViolations);
