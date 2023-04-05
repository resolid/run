type ManifestFile = {
  file: string;
  imports?: string[];
  css?: string[];
  src?: string;
  isEntry?: boolean;
  isDynamicEntry?: boolean;
};

export const prepareManifest = (
  manifest: Record<string, ManifestFile>,
  ssrManifest: Record<string, string[]>,
  routeComponents: Set<string>,
  basePath: string
) => {
  basePath = basePath.endsWith('/') ? basePath : basePath + '/';

  const collectAssets = () => {
    const files: { type: string; href: string }[] = [];
    const visitedFiles = new Set<string>();

    const visitFile = (file: ManifestFile) => {
      if (visitedFiles.has(file.file)) {
        return;
      }

      visitedFiles.add(file.file);

      files.push({
        type: file.file.endsWith('.css') ? 'style' : file.file.endsWith('.js') ? 'script' : 'asset',
        href: basePath + file.file,
      });

      file.imports?.forEach((imp) => {
        visitFile(manifest[imp]);
      });

      file.css?.forEach((css) => {
        if (visitedFiles.has(css)) return;
        files.push({ type: 'style', href: basePath + css });
        visitedFiles.add(css);
      });
    };

    return {
      addAsset(val: string) {
        const asset = Object.values(manifest).find((f) => basePath + f.file === val);

        if (!asset) {
          return;
        }

        visitFile(asset);
      },
      addSrc(val: string) {
        const asset = Object.values(manifest).find((f) => f.src === val);

        if (!asset) {
          return;
        }

        visitFile(asset);
      },
      getFiles() {
        return files;
      },
    };
  };

  const routes = Object.keys(ssrManifest)
    .filter((key) => routeComponents.has(key))
    .map((key) => {
      const value = ssrManifest[key];
      const assets = collectAssets();

      value.forEach((val) => {
        assets.addAsset(val);
      });

      if (!value.length) {
        assets.addSrc(key);
      }

      if (key.match(new RegExp(`entry-client\\.(${['ts', 'tsx'].join('|')})$`))) {
        return null;
      }

      return [key, assets.getFiles()];
    })
    .filter(Boolean) as [string, { type: string; href: string }[]][];

  const clientEntry = Object.keys(ssrManifest).find((key) =>
    key.match(new RegExp(`entry-client\\.(${['ts', 'tsx'].join('|')})$`))
  );

  const clientEntryAssets = collectAssets();

  if (clientEntry) {
    clientEntryAssets.addSrc(clientEntry);
  }

  return Object.fromEntries([...routes, ['entry-client', clientEntryAssets.getFiles()]]);
};
