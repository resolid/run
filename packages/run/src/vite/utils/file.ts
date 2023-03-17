import { join } from 'path';
import { existsSync } from 'fs';

export const findAny = (path: string, name: string, extensions = ['.ts', '.tsx']) => {
  for (const extension of extensions) {
    const file = join(path, name + extension);

    if (existsSync(file)) {
      return file;
    }
  }

  return null;
};
