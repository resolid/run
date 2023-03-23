import type { ParentProps } from 'solid-js';
import { ColorModeProvider, useColorMode } from './ColorModeProvider';

export { ColorModeScript } from './ColorModeScript';

export { useColorMode };

export const ResolidProvider = (props: ParentProps) => {
  return <ColorModeProvider>{props.children}</ColorModeProvider>;
};
