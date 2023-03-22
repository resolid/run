import { defineConfig } from 'tsup-preset-solid';
import { dependencies, devDependencies, peerDependencies } from './package.json';

export default defineConfig(
  { entry: 'src/index.tsx', serverEntry: true },
  {
    cjs: true,
    writePackageJson: true,
    tsupOptions: (config) => {
      return {
        ...config,
        external: [...Object.keys(peerDependencies), ...Object.keys(devDependencies)],
        noExternal: Object.keys(dependencies),
        minify: true,
        clean: true,
      };
    },
  }
);
