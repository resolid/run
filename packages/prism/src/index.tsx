import { Prism as PrismCore } from './lib/prism-core';
import type { PrismLib } from './lib/types';
import nightOwl from './themes/nightOwl';
import nightOwlLight from './themes/nightOwlLight';

export * from './core/Highlight';
export { nightOwl, nightOwlLight };

import bash from './lib/lang/bash';
import clike from './lib/lang/clike';
import javascript from './lib/lang/javascript';
import jsx from './lib/lang/jsx';
import markup from './lib/lang/markup';

clike(PrismCore);
markup(PrismCore);
javascript(PrismCore);
jsx(PrismCore);
bash(PrismCore);

export const Prism = PrismCore as unknown as PrismLib;
