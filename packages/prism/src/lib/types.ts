export type Language = 'markup' | 'clike' | 'javascript' | 'jsx' | 'typescript' | 'tsx';

export type PrismGrammar = {
  [key: string]: PrismGrammar | string | RegExp | Array<PrismGrammar | string | RegExp>;
};

export type PrismToken = {
  type: string | string[];
  alias: string | string[];
  content: (PrismToken | string)[] | string;
};

type LanguagesDict = {
  [lang in Language]: PrismGrammar;
};

export type PrismLib = {
  languages: LanguagesDict;
  tokenize: (code: string, grammar: PrismGrammar) => Array<PrismToken | string>;
  highlight: (code: string, grammar: PrismGrammar, language: Language) => string;
  hooks: {
    run: (name: string, env: { code: string; grammar: PrismGrammar; language: Language }) => void;
  };
};
