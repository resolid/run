import { isServer, NoHydration } from 'solid-js/web';
import { COLOR_MODE_STORAGE_KEY } from './ColorModeProvider';

export const ColorModeScript = (props: { nonce?: string }) => {
  return (
    <NoHydration>
      {isServer && (
        <script id="color-mode-script" nonce={props.nonce} $ServerOnly>{`
try {
  var t = localStorage.getItem('${COLOR_MODE_STORAGE_KEY}');
  var isDark = t ? t == '"dark"' : matchMedia('(prefers-color-scheme:dark)').matches;
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
      `}</script>
      )}
    </NoHydration>
  );
};
