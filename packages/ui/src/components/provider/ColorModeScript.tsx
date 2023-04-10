import { isServer, NoHydration } from 'solid-js/web';
import { COLOR_MODE_STORAGE_KEY } from './ColorModeProvider';

export const ColorModeScript = (props: { nonce?: string }) => {
  return (
    <NoHydration>
      {isServer && (
        <script id="color-mode-script" nonce={props.nonce} $ServerOnly>{`
try {
  var dark = localStorage.getItem('${COLOR_MODE_STORAGE_KEY}');
  if (dark ? dark == '"dark"' : matchMedia('(prefers-color-scheme:dark)').matches) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
      `}</script>
      )}
    </NoHydration>
  );
};
