/* eslint-disable */
// @ts-nocheck
// noinspection EqualityComparisonWithCoercionJS,ES6ConvertVarToLetConst,JSUnusedGlobalSymbols,JSUnresolvedReference,JSCheckFunctionSignatures,JSValidateTypes,JSDuplicatedDeclaration

// This is a slimmed down version of `prism-core.js`

var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
var uniqueId = 0;

// The grammar object for plaintext
var plainTextGrammar = {};

var _ = {
  util: {
    encode: function encode(tokens) {
      if (tokens instanceof Token) {
        return new Token(tokens.type, encode(tokens.content), tokens.alias);
      } else if (Array.isArray(tokens)) {
        return tokens.map(encode);
      } else {
        return tokens
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/\u00a0/g, ' ');
      }
    },

    type: function (o) {
      return Object.prototype.toString.call(o).slice(8, -1);
    },

    objId: function (obj) {
      if (!obj['__id']) {
        Object.defineProperty(obj, '__id', { value: ++uniqueId });
      }
      return obj['__id'];
    },

    clone: function deepClone(o, visited) {
      visited = visited || {};

      var clone;
      var id;
      switch (_.util.type(o)) {
        case 'Object':
          id = _.util.objId(o);
          if (visited[id]) {
            return visited[id];
          }
          clone = /** @type {Record<string, any>} */ ({});
          visited[id] = clone;

          for (var key in o) {
            if (o.hasOwnProperty(key)) {
              clone[key] = deepClone(o[key], visited);
            }
          }

          return /** @type {any} */ (clone);

        case 'Array':
          id = _.util.objId(o);
          if (visited[id]) {
            return visited[id];
          }
          clone = [];
          visited[id] = clone;

          /** @type {Array} */ (/** @type {any} */ (o)).forEach(function (v, i) {
            clone[i] = deepClone(v, visited);
          });

          return /** @type {any} */ (clone);

        default:
          return o;
      }
    },

    getLanguage: function (element) {
      while (element) {
        var m = lang.exec(element.className);
        if (m) {
          return m[1].toLowerCase();
        }
        element = element.parentElement;
      }
      return 'none';
    },

    setLanguage: function (element, language) {
      // remove all `language-xxx` classes
      // (this might leave behind a leading space)
      element.className = element.className.replace(RegExp(lang, 'gi'), '');

      // add the new `language-xxx` class
      // (using `classList` will automatically clean up spaces for us)
      element.classList.add('language-' + language);
    },

    isActive: function (element, className, defaultActivation) {
      var no = 'no-' + className;

      while (element) {
        var classList = element.classList;
        if (classList.contains(className)) {
          return true;
        }
        if (classList.contains(no)) {
          return false;
        }
        element = element.parentElement;
      }
      return !!defaultActivation;
    },
  },

  languages: {
    /**
     * The grammar for plain, unformatted text.
     */
    plain: plainTextGrammar,
    plaintext: plainTextGrammar,
    text: plainTextGrammar,
    txt: plainTextGrammar,

    extend: function (id, redef) {
      var lang = _.util.clone(_.languages[id]);

      for (var key in redef) {
        lang[key] = redef[key];
      }

      return lang;
    },

    insertBefore: function (inside, before, insert, root) {
      root = root || /** @type {any} */ (_.languages);
      var grammar = root[inside];
      var ret = {};

      for (var token in grammar) {
        if (grammar.hasOwnProperty(token)) {
          if (token == before) {
            for (var newToken in insert) {
              if (insert.hasOwnProperty(newToken)) {
                ret[newToken] = insert[newToken];
              }
            }
          }

          // Do not insert token which also occur in insert. See #1525
          if (!insert.hasOwnProperty(token)) {
            ret[token] = grammar[token];
          }
        }
      }

      var old = root[inside];
      root[inside] = ret;

      // Update references in other language definitions
      _.languages.DFS(_.languages, function (key, value) {
        if (value === old && key != inside) {
          this[key] = ret;
        }
      });

      return ret;
    },

    // Traverse a language definition with Depth First Search
    DFS: function DFS(o, callback, type, visited) {
      visited = visited || {};

      var objId = _.util.objId;

      for (var i in o) {
        if (o.hasOwnProperty(i)) {
          callback.call(o, i, o[i], type || i);

          var property = o[i];
          var propertyType = _.util.type(property);

          if (propertyType === 'Object' && !visited[objId(property)]) {
            visited[objId(property)] = true;
            DFS(property, callback, null, visited);
          } else if (propertyType === 'Array' && !visited[objId(property)]) {
            visited[objId(property)] = true;
            DFS(property, callback, i, visited);
          }
        }
      }
    },
  },

  plugins: {},

  highlight: function (text, grammar, language) {
    var env = {
      code: text,
      grammar: grammar,
      language: language,
    };
    _.hooks.run('before-tokenize', env);
    if (!env.grammar) {
      throw new Error('The language "' + env.language + '" has no grammar.');
    }
    env.tokens = _.tokenize(env.code, env.grammar);
    _.hooks.run('after-tokenize', env);
    return Token.stringify(_.util.encode(env.tokens), env.language);
  },

  tokenize: function (text, grammar) {
    var rest = grammar.rest;
    if (rest) {
      for (var token in rest) {
        grammar[token] = rest[token];
      }

      delete grammar.rest;
    }

    var tokenList = new LinkedList();
    addAfter(tokenList, tokenList.head, text);

    matchGrammar(text, tokenList, grammar, tokenList.head, 0);

    return toArray(tokenList);
  },

  hooks: {
    all: {},

    add: function (name, callback) {
      var hooks = _.hooks.all;

      hooks[name] = hooks[name] || [];

      hooks[name].push(callback);
    },

    run: function (name, env) {
      var callbacks = _.hooks.all[name];

      if (!callbacks || !callbacks.length) {
        return;
      }

      for (var i = 0, callback; (callback = callbacks[i++]); ) {
        callback(env);
      }
    },
  },

  Token: Token,
};

function Token(type, content, alias, matchedStr) {
  this.type = type;
  this.content = content;
  this.alias = alias;
  this.length = (matchedStr || '').length | 0;
}

Token.stringify = function stringify(o, language) {
  if (typeof o == 'string') {
    return o;
  }
  if (Array.isArray(o)) {
    var s = '';
    o.forEach(function (e) {
      s += stringify(e, language);
    });
    return s;
  }

  var env = {
    type: o.type,
    content: stringify(o.content, language),
    tag: 'span',
    classes: ['token', o.type],
    attributes: {},
    language: language,
  };

  var aliases = o.alias;
  if (aliases) {
    if (Array.isArray(aliases)) {
      Array.prototype.push.apply(env.classes, aliases);
    } else {
      env.classes.push(aliases);
    }
  }

  _.hooks.run('wrap', env);

  var attributes = '';
  for (var name in env.attributes) {
    attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
  }

  return (
    '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>'
  );
};

function matchPattern(pattern, pos, text, lookbehind) {
  pattern.lastIndex = pos;
  var match = pattern.exec(text);
  if (match && lookbehind && match[1]) {
    // change the match to remove the text matched by the Prism lookbehind group
    var lookbehindLength = match[1].length;
    match.index += lookbehindLength;
    match[0] = match[0].slice(lookbehindLength);
  }
  return match;
}

function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
  for (var token in grammar) {
    if (!grammar.hasOwnProperty(token) || !grammar[token]) {
      continue;
    }

    var patterns = grammar[token];
    patterns = Array.isArray(patterns) ? patterns : [patterns];

    for (var j = 0; j < patterns.length; ++j) {
      if (rematch && rematch.cause == token + ',' + j) {
        return;
      }

      var patternObj = patterns[j];
      var inside = patternObj.inside;
      var lookbehind = !!patternObj.lookbehind;
      var greedy = !!patternObj.greedy;
      var alias = patternObj.alias;

      if (greedy && !patternObj.pattern.global) {
        // Without the global flag, lastIndex won't work
        var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
        patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
      }

      /** @type {RegExp} */
      var pattern = patternObj.pattern || patternObj;

      for (
        // iterate the token list and keep track of the current token/string position
        var currentNode = startNode.next, pos = startPos;
        currentNode !== tokenList.tail;
        pos += currentNode.value.length, currentNode = currentNode.next
      ) {
        if (rematch && pos >= rematch.reach) {
          break;
        }

        var str = currentNode.value;

        if (tokenList.length > text.length) {
          // Something went terribly wrong, ABORT, ABORT!
          return;
        }

        if (str instanceof Token) {
          continue;
        }

        var removeCount = 1; // this is the to parameter of removeBetween
        var match;

        if (greedy) {
          match = matchPattern(pattern, pos, text, lookbehind);
          if (!match || match.index >= text.length) {
            break;
          }

          var from = match.index;
          var to = match.index + match[0].length;
          var p = pos;

          // find the node that contains the match
          p += currentNode.value.length;
          while (from >= p) {
            currentNode = currentNode.next;
            p += currentNode.value.length;
          }
          // adjust pos (and p)
          p -= currentNode.value.length;
          pos = p;

          // the current node is a Token, then the match starts inside another Token, which is invalid
          if (currentNode.value instanceof Token) {
            continue;
          }

          // find the last node which is affected by this match
          for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === 'string'); k = k.next) {
            removeCount++;
            p += k.value.length;
          }
          removeCount--;

          // replace with the new match
          str = text.slice(pos, p);
          match.index -= pos;
        } else {
          match = matchPattern(pattern, 0, str, lookbehind);
          if (!match) {
            continue;
          }
        }

        // eslint-disable-next-line no-redeclare
        var from = match.index;
        var matchStr = match[0];
        var before = str.slice(0, from);
        var after = str.slice(from + matchStr.length);

        var reach = pos + str.length;
        if (rematch && reach > rematch.reach) {
          rematch.reach = reach;
        }

        var removeFrom = currentNode.prev;

        if (before) {
          removeFrom = addAfter(tokenList, removeFrom, before);
          pos += before.length;
        }

        removeRange(tokenList, removeFrom, removeCount);

        var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
        currentNode = addAfter(tokenList, removeFrom, wrapped);

        if (after) {
          addAfter(tokenList, currentNode, after);
        }

        if (removeCount > 1) {
          var nestedRematch = {
            cause: token + ',' + j,
            reach: reach,
          };
          matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

          // the reach might have been extended because of the rematching
          if (rematch && nestedRematch.reach > rematch.reach) {
            rematch.reach = nestedRematch.reach;
          }
        }
      }
    }
  }
}

function LinkedList() {
  var head = { value: null, prev: null, next: null };
  var tail = { value: null, prev: head, next: null };
  head.next = tail;

  this.head = head;
  this.tail = tail;
  this.length = 0;
}

function addAfter(list, node, value) {
  // assumes that node != list.tail && values.length >= 0
  var next = node.next;

  var newNode = { value: value, prev: node, next: next };
  node.next = newNode;
  next.prev = newNode;
  list.length++;

  return newNode;
}

function removeRange(list, node, count) {
  var next = node.next;
  for (var i = 0; i < count && next !== list.tail; i++) {
    next = next.next;
  }
  node.next = next;
  next.prev = node;
  list.length -= i;
}

function toArray(list) {
  var array = [];
  var node = list.head.next;
  while (node !== list.tail) {
    array.push(node.value);
    node = node.next;
  }
  return array;
}

export const Prism = _;
