import { HydrationScript, NoHydration } from 'solid-js/web';
import { useContext } from 'solid-js';
import { RunContext } from '../../base/RunContext';

export const Scripts = () => {
  const context = useContext(RunContext);

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
            <script type="module" async src={context.manifest['entry-client'][0].href} $ServerOnly />
          </>
        )}
      </NoHydration>
    </>
  );
};
