import { existsSync } from 'fs';
import { join } from 'path';

export const findAny = (path: string, name: string, extensions = ['.ts', '.tsx']) => {
  for (const extension of extensions) {
    const file = join(path, name + extension);

    if (existsSync(file)) {
      return file;
    }
  }

  return null;
};
