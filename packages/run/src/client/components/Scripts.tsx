import { HydrationScript, isServer, NoHydration } from 'solid-js/web';

const isDev = import.meta.env.MODE === 'development';

export const Scripts = () => {
  // noinspection HtmlUnknownTarget
  return (
    <>
      <HydrationScript />
      <NoHydration>
        {isServer && isDev && (
          <>
            <script type="module" src="/@vite/client" $ServerOnly></script>
            <script type="module" async src={'/@fs/' + import.meta.env.ENTRY_CLIENT} $ServerOnly></script>
          </>
        )}
      </NoHydration>
    </>
  );
};
