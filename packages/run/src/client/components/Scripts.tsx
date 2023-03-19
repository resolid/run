import { HydrationScript, NoHydration } from 'solid-js/web';
import { useRunContext } from '../../base/RunContext';

export const Scripts = () => {
  const context = useRunContext();

  // noinspection HtmlUnknownTarget
  return (
    <>
      <HydrationScript />
      <NoHydration>
        {import.meta.env.DEV ? (
          <>
            <script type="module" src="/@vite/client" $ServerOnly />
            <script type="module" async src={'/@fs/' + import.meta.env.ENTRY_CLIENT} $ServerOnly />
          </>
        ) : (
          <>
            <script type="module" async src={context.manifest?.['entry-client'][0].href} $ServerOnly />
          </>
        )}
      </NoHydration>
    </>
  );
};
