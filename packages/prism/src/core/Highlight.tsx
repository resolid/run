import type { JSXElement } from 'solid-js';
import { createMemo, createSignal } from 'solid-js';
import type { Language, PrismGrammar, PrismLib, PrismToken } from '../lib/types';
import type { Token } from '../utils/normalizeTokens';
import { normalizeTokens } from '../utils/normalizeTokens';
import type { PrismTheme, StyleObj, ThemeDict } from '../utils/themeToDict';
import { themeToDict } from '../utils/themeToDict';

export type { PrismTheme, Language };

type LineInputProps = {
  style?: StyleObj;
  className?: string;
  line: Token[];
  [key: string]: unknown;
};

type LineOutputProps = {
  style?: StyleObj;
  className: string;
  [key: string]: unknown;
};

type TokenInputProps = {
  style?: StyleObj;
  className?: string;
  token: Token;
  [key: string]: unknown;
};

type TokenOutputProps = {
  style?: StyleObj;
  className: string;
  children: string;
  [key: string]: unknown;
};

export type HighlightProps = {
  prism: PrismLib;
  theme?: PrismTheme;
  language: Language;
  code: string;
  children: (props: {
    tokens: Token[][];
    className: string;
    style: StyleObj;
    getLineProps: (input: LineInputProps) => LineOutputProps;
    getTokenProps: (input: TokenInputProps) => TokenOutputProps;
  }) => JSXElement;
};

export const Highlight = (props: HighlightProps): JSXElement => {
  const [prevTheme, setPrevTheme] = createSignal<PrismTheme | undefined>(undefined);
  const [prevLanguage, setPrevLanguage] = createSignal<Language | undefined>(undefined);
  const [themeDict, setThemeDict] = createSignal<ThemeDict | undefined>(undefined);

  const getThemeDict = createMemo(() => {
    if (themeDict() !== undefined && props.theme === prevTheme() && props.language === prevLanguage()) {
      return themeDict();
    }

    setPrevTheme(props.theme);
    setPrevLanguage(props.language);

    const newThemeDict = props.theme ? themeToDict(props.theme, props.language) : undefined;
    setThemeDict(newThemeDict);

    return newThemeDict;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getLineProps = ({ className, style, line, ...rest }: LineInputProps): LineOutputProps => {
    const output: LineOutputProps = {
      ...rest,
      className: 'token-line',
      style: undefined,
    };

    const currentThemeDict = getThemeDict();

    if (currentThemeDict !== undefined) {
      output.style = currentThemeDict.plain;
    }

    if (style !== undefined) {
      output.style = output.style !== undefined ? { ...output.style, ...style } : style;
    }

    if (className) {
      output.className += ` ${className}`;
    }

    return output;
  };

  const getStyleForToken = ({ types, empty }: Token) => {
    const typesSize = types.length;
    const currentThemeDict = getThemeDict();

    if (currentThemeDict === undefined) {
      return undefined;
    } else if (typesSize === 1 && types[0] === 'plain') {
      return empty ? { display: 'inline-block' } : undefined;
    } else if (typesSize === 1 && !empty) {
      return currentThemeDict[types[0]];
    }

    const baseStyle = empty ? { display: 'inline-block' } : {};
    const typeStyles = types.map((type) => currentThemeDict[type]);
    return Object.assign(baseStyle, ...typeStyles);
  };

  const getTokenProps = ({ className, style, token, ...rest }: TokenInputProps): TokenOutputProps => {
    const output: TokenOutputProps = {
      ...rest,
      className: `token ${token.types.join(' ')}`,
      children: token.content,
      style: getStyleForToken(token),
    };

    if (style !== undefined) {
      output.style = output.style !== undefined ? { ...output.style, ...style } : style;
    }

    if (className) {
      output.className += ` ${className}`;
    }

    return output;
  };

  const tokenize = (prism: PrismLib, code: string, grammar: PrismGrammar, language: Language) => {
    const env = {
      code,
      grammar,
      language,
      tokens: [] as (PrismToken | string)[],
    };

    prism.hooks.run('before-tokenize', env);
    const tokens = (env.tokens = prism.tokenize(env.code, env.grammar));
    prism.hooks.run('after-tokenize', env);

    return tokens;
  };

  const tokens = createMemo(() => {
    const grammar = props.prism.languages[props.language];
    const mixedTokens =
      grammar !== undefined ? tokenize(props.prism, props.code, grammar, props.language) : [props.code];

    return normalizeTokens(mixedTokens);
  });

  return (
    <>
      {props.children({
        tokens: tokens(),
        className: `prism-code language-${props.language}`,
        style: getThemeDict()?.root ?? {},
        getLineProps: getLineProps,
        getTokenProps: getTokenProps,
      })}
    </>
  );
};
