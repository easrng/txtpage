import EventEmitter from "./events.js";
var unicodePunctuationRegex =
  /[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
var asciiAlpha = regexCheck(/[A-Za-z]/);
var asciiDigit = regexCheck(/\d/);
var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
var unicodeWhitespace = regexCheck(/\s/);
var unicodePunctuation = regexCheck(unicodePunctuationRegex);
function regexCheck(regex) {
  return check;
  function check(code2) {
    return code2 !== null && regex.test(String.fromCharCode(code2));
  }
}
var characterReferences = { '"': "quot", "&": "amp", "<": "lt", ">": "gt" };
function encode(value) {
  return value.replace(/["&<>]/g, replace);
  function replace(value2) {
    return "&" + characterReferences[value2] + ";";
  }
}
function sanitizeUri(url, protocol) {
  const value = encode(normalizeUri(url || ""));
  if (!protocol) {
    return value;
  }
  const colon = value.indexOf(":");
  const questionMark = value.indexOf("?");
  const numberSign = value.indexOf("#");
  const slash = value.indexOf("/");
  if (
    // If there is no protocol, it’s relative.
    colon < 0 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    (slash > -1 && colon > slash) ||
    (questionMark > -1 && colon > questionMark) ||
    (numberSign > -1 && colon > numberSign) || // It is a protocol, it should be allowed.
    protocol.test(value.slice(0, colon))
  ) {
    return value;
  }
  return "";
}
function normalizeUri(value) {
  const result = [];
  let index = -1;
  let start = 0;
  let skip = 0;
  while (++index < value.length) {
    const code2 = value.charCodeAt(index);
    let replace = "";
    if (
      code2 === 37 &&
      asciiAlphanumeric(value.charCodeAt(index + 1)) &&
      asciiAlphanumeric(value.charCodeAt(index + 2))
    ) {
      skip = 2;
    } else if (code2 < 128) {
      if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code2))) {
        replace = String.fromCharCode(code2);
      }
    } else if (code2 > 55295 && code2 < 57344) {
      const next = value.charCodeAt(index + 1);
      if (code2 < 56320 && next > 56319 && next < 57344) {
        replace = String.fromCharCode(code2, next);
        skip = 1;
      } else {
        replace = "\uFFFD";
      }
    } else {
      replace = String.fromCharCode(code2);
    }
    if (replace) {
      result.push(value.slice(start, index), encodeURIComponent(replace));
      start = index + skip + 1;
      replace = "";
    }
    if (skip) {
      index += skip;
      skip = 0;
    }
  }
  return result.join("") + value.slice(start);
}
function compiler(options) {
  const settings = options || {};
  let defaultLineEnding = settings.defaultLineEnding;
  const allowDangerousProtocol = settings.allowDangerousProtocol;
  let atEol;
  let slurpEol;
  let preformatted;
  let inList;
  return compile2;
  function compile2(tokens) {
    const results = [];
    let index = -1;
    if (!defaultLineEnding) {
      while (++index < tokens.length) {
        if (tokens[index].type === "eol") {
          defaultLineEnding = tokens[index].value;
          break;
        }
      }
    }
    index = -1;
    while (++index < tokens.length) {
      const token = tokens[index];
      if (
        inList &&
        ((token.type === "eol" && token.hard) ||
          (token.type !== "eol" &&
            token.type !== "listSequence" &&
            token.type !== "listText" &&
            token.type !== "whitespace"))
      ) {
        if (atEol) results.push(atEol, defaultLineEnding || "\n");
        results.push("</ul>");
        if (!atEol && defaultLineEnding) results.push(defaultLineEnding);
        inList = void 0;
        atEol = void 0;
      }
      if (token.type === "eol") {
        if (atEol) results.push(atEol);
        if (token.hard) results.push("<br />");
        if (!slurpEol) results.push(encode(token.value));
        atEol = void 0;
        slurpEol = void 0;
      } else if (token.type === "eof") {
        if (atEol) results.push(atEol);
        if (preformatted === "preAlt") results.push("</code>");
        if (preformatted) results.push("</pre>");
      } else if (token.type === "quoteSequence") {
        results.push("<blockquote>");
        atEol = "</blockquote>";
      } else if (token.type === "linkSequence") {
        results.push('<div><a href="');
        atEol = '"></a></div>';
      } else if (token.type === "linkUrl") {
        results.push(
          sanitizeUri(
            token.value,
            allowDangerousProtocol
              ? void 0
              : /^(gemini|https?|ircs?|mailto|xmpp)$/i
          ),
          '">'
        );
        atEol = "</a></div>";
      } else if (token.type === "listSequence") {
        if (!inList) {
          results.push("<ul>", defaultLineEnding || "\n");
          inList = true;
        }
        results.push("<li>");
        atEol = "</li>";
      } else if (token.type === "headingSequence") {
        results.push("<h", String(token.value.length), ">");
        atEol = "</h" + token.value.length + ">";
      } else if (token.type === "preSequence") {
        results.push(
          preformatted === "preAlt" ? "</code>" : "",
          "<",
          preformatted ? "/" : "",
          "pre>"
        );
        preformatted = !preformatted;
        if (preformatted) slurpEol = true;
      } else if (token.type === "preAlt") {
        if (preformatted) {
          results.push('<code class="language-', encode(token.value), '">');
          preformatted = "preAlt";
        }
      } else if (
        token.type === "headingText" ||
        token.type === "linkText" ||
        token.type === "listText" ||
        token.type === "preText"
      ) {
        results.push(encode(token.value));
      } else if (token.type === "quoteText") {
        results.push(
          defaultLineEnding || "\n",
          "<p>",
          token.value,
          "</p>",
          defaultLineEnding || "\n"
        );
      } else if (token.type === "text") {
        results.push("<p>", encode(token.value), "</p>");
      }
    }
    return results.join("");
  }
}
function parser() {
  const values = [];
  let line = 1;
  let column = 1;
  let offset = 0;
  let preformatted;
  return parse;
  function parse(buf, encoding, done) {
    let end = buf ? buf.indexOf("\n") : -1;
    let start = 0;
    const results = [];
    while (end > -1) {
      let value = values.join("") + buf.slice(start, end).toString(encoding);
      let eol;
      values.length = 0;
      if (value.charCodeAt(value.length - 1) === 13) {
        value = value.slice(0, -1);
        eol = "\r\n";
      } else {
        eol = "\n";
      }
      parseLine(value);
      add("eol", eol, { hard: !preformatted && value.length === 0 });
      start = end + 1;
      end = buf.indexOf("\n", start);
    }
    if (buf) values.push(buf.slice(start).toString(encoding));
    if (done) {
      parseLine(values.join(""));
      add("eof", "");
    }
    return results;
    function parseLine(value) {
      const code2 = value.charCodeAt(0);
      if (
        code2 === 96 &&
        value.charCodeAt(1) === 96 &&
        value.charCodeAt(2) === 96
      ) {
        add("preSequence", value.slice(0, 3));
        if (value.length !== 3) add("preAlt", value.slice(3));
        preformatted = !preformatted;
      } else if (preformatted) {
        if (value) add("preText", value);
      } else if (code2 === 35) {
        let index = 1;
        while (index < 3 && value.charCodeAt(index) === 35) index++;
        add("headingSequence", value.slice(0, index));
        const start2 = index;
        while (ws(value.charCodeAt(index))) index++;
        if (start2 !== index) add("whitespace", value.slice(start2, index));
        if (index !== value.length) add("headingText", value.slice(index));
      } else if (
        code2 === 42 &&
        (value.length === 1 || ws(value.charCodeAt(1)))
      ) {
        add("listSequence", "*");
        let index = 1;
        while (ws(value.charCodeAt(index))) index++;
        if (index > 1) add("whitespace", value.slice(1, index));
        if (value.length > index) add("listText", value.slice(index));
      } else if (code2 === 61 && value.charCodeAt(1) === 62) {
        add("linkSequence", value.slice(0, 2));
        let index = 2;
        while (ws(value.charCodeAt(index))) index++;
        if (index > 2) add("whitespace", value.slice(2, index));
        let start2 = index;
        while (index < value.length && !ws(value.charCodeAt(index))) index++;
        if (index > start2) add("linkUrl", value.slice(start2, index));
        start2 = index;
        while (ws(value.charCodeAt(index))) index++;
        if (index > start2) add("whitespace", value.slice(start2, index));
        if (value.length > index) add("linkText", value.slice(index));
      } else if (code2 === 62) {
        add("quoteSequence", value.slice(0, 1));
        let index = 1;
        while (ws(value.charCodeAt(index))) index++;
        if (index > 1) add("whitespace", value.slice(1, index));
        if (value.length > index) add("quoteText", value.slice(index));
      } else if (value.length > 0) {
        add("text", value);
      }
    }
    function add(type, value, fields) {
      const start2 = now();
      const token = {};
      offset += value.length;
      column += value.length;
      if (value.charCodeAt(value.length - 1) === 10) {
        line++;
        column = 1;
      }
      token.type = type;
      token.value = value;
      if (fields) Object.assign(token, fields);
      token.start = start2;
      token.end = now();
      results.push(token);
    }
    function now() {
      return { line, column, offset };
    }
  }
}
function ws(code2) {
  return code2 === 9 || code2 === 32;
}
function buffer(doc, encoding, options) {
  return compiler(options)(parser()(doc, encoding, true));
}
function fromGemtext(doc, encoding) {
  return compile(parser()(doc, encoding, true));
}
function compile(tokens) {
  const root4 = {
    type: "root",
    children: [],
    position: {
      start: point(tokens[0].start),
      end: point(tokens[tokens.length - 1].end),
    },
  };
  const stack = [root4];
  let index = -1;
  while (++index < tokens.length) {
    const token = tokens[index];
    if (token.type === "eol" && token.hard) {
      enter({ type: "break" }, token);
      exit(token);
    } else if (token.type === "headingSequence") {
      const node = enter(
        {
          type: "heading",
          // @ts-expect-error CST is perfect, `token.value.length` == `1|2|3`
          rank: token.value.length,
          value: "",
        },
        token
      );
      if (tokens[index + 1].type === "whitespace") index++;
      if (tokens[index + 1].type === "headingText") {
        index++;
        node.value = tokens[index].value;
      }
      exit(tokens[index]);
    } else if (token.type === "linkSequence") {
      const node = enter({ type: "link", url: null, value: "" }, token);
      if (tokens[index + 1].type === "whitespace") index++;
      if (tokens[index + 1].type === "linkUrl") {
        index++;
        node.url = tokens[index].value;
        if (tokens[index + 1].type === "whitespace") index++;
        if (tokens[index + 1].type === "linkText") {
          index++;
          node.value = tokens[index].value;
        }
      }
      exit(tokens[index]);
    } else if (token.type === "listSequence") {
      if (stack[stack.length - 1].type !== "list") {
        enter({ type: "list", children: [] }, token);
      }
      const node = enter({ type: "listItem", value: "" }, token);
      if (tokens[index + 1].type === "whitespace") index++;
      if (tokens[index + 1].type === "listText") {
        index++;
        node.value = tokens[index].value;
      }
      exit(tokens[index]);
      if (
        tokens[index + 1].type !== "eol" ||
        tokens[index + 2].type !== "listSequence"
      ) {
        exit(tokens[index]);
      }
    } else if (token.type === "preSequence") {
      const node = enter({ type: "pre", alt: null, value: "" }, token);
      const values = [];
      if (tokens[index + 1].type === "preAlt") {
        index++;
        node.alt = tokens[index].value;
      }
      if (tokens[index + 1].type === "eol") index++;
      while (++index < tokens.length) {
        if (tokens[index].type === "eol" || tokens[index].type === "preText") {
          values.push(tokens[index].value);
        } else {
          if (tokens[index].type === "preSequence") {
            values.pop();
            if (tokens[index + 1].type === "preAlt") index++;
          }
          break;
        }
      }
      node.value = values.join("");
      exit(tokens[index]);
    } else if (token.type === "quoteSequence") {
      const node = enter({ type: "quote", value: "" }, token);
      if (tokens[index + 1].type === "whitespace") index++;
      if (tokens[index + 1].type === "quoteText") {
        index++;
        node.value = tokens[index].value;
      }
      exit(tokens[index]);
    } else if (token.type === "text") {
      enter({ type: "text", value: token.value }, token);
      exit(token);
    }
  }
  return stack[0];
  function enter(node, token) {
    const parent3 = stack[stack.length - 1];
    parent3.children.push(node);
    stack.push(node);
    node.position = { start: point(token.start), end: point(token.end) };
    return node;
  }
  function exit(token) {
    const node = stack.pop();
    node.position.end = point(token.end);
    return node;
  }
  function point(d) {
    return { line: d.line, column: d.column, offset: d.offset };
  }
}
var convert =
  /**
   * @type {(
   *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {AssertAnything}
   */
  function (test) {
    if (test === void 0 || test === null) {
      return ok;
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  };
function anyFactory(tests) {
  const checks = [];
  let index = -1;
  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index2 = -1;
    while (++index2 < checks.length) {
      if (checks[index2].call(this, ...parameters)) return true;
    }
    return false;
  }
}
function propsFactory(check) {
  return castFactory(all);
  function all(node) {
    let key;
    for (key in check) {
      if (node[key] !== check[key]) return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node) {
    return node && node.type === check;
  }
}
function castFactory(check) {
  return assertion;
  function assertion(node, ...parameters) {
    return Boolean(
      node &&
        typeof node === "object" &&
        "type" in node && // @ts-expect-error: fine.
        Boolean(check.call(this, node, ...parameters))
    );
  }
}
function ok() {
  return true;
}
function color(d) {
  return d;
}
var CONTINUE = true;
var EXIT = false;
var SKIP = "skip";
var visitParents =
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor<Node>} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  function (tree, test, visitor, reverse) {
    if (typeof test === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test;
      test = null;
    }
    const is2 = convert(test);
    const step = reverse ? -1 : 1;
    factory(tree, void 0, [])();
    function factory(node, index, parents) {
      const value = node && typeof node === "object" ? node : {};
      if (typeof value.type === "string") {
        const name =
          // `hast`
          typeof value.tagName === "string"
            ? value.tagName
            : // `xast`
            typeof value.name === "string"
            ? value.name
            : void 0;
        Object.defineProperty(visit2, "name", {
          value:
            "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")",
        });
      }
      return visit2;
      function visit2() {
        let result = [];
        let subresult;
        let offset;
        let grandparents;
        if (!test || is2(node, index, parents[parents.length - 1] || null)) {
          result = toResult(visitor(node, parents));
          if (result[0] === EXIT) {
            return result;
          }
        }
        if (node.children && result[0] !== SKIP) {
          offset = (reverse ? node.children.length : -1) + step;
          grandparents = parents.concat(node);
          while (offset > -1 && offset < node.children.length) {
            subresult = factory(node.children[offset], offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset =
              typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
        return result;
      }
    }
  };
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return [value];
}
var visit =
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  function (tree, test, visitor, reverse) {
    if (typeof test === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test;
      test = null;
    }
    visitParents(tree, test, overload, reverse);
    function overload(node, parents) {
      const parent3 = parents[parents.length - 1];
      return visitor(
        node,
        parent3 ? parent3.children.indexOf(node) : null,
        parent3
      );
    }
  };
var own = {}.hasOwnProperty;
function zwitch(key, options) {
  const settings = options || {};
  function one(value, ...parameters) {
    let fn = one.invalid;
    const handlers = one.handlers;
    if (value && own.call(value, key)) {
      const id = String(value[key]);
      fn = own.call(handlers, id) ? handlers[id] : one.unknown;
    }
    if (fn) {
      return fn.call(this, value, ...parameters);
    }
  }
  one.handlers = settings.handlers || {};
  one.invalid = settings.invalid;
  one.unknown = settings.unknown;
  return one;
}
var own2 = {}.hasOwnProperty;
var transform = zwitch("type", {
  invalid,
  // @ts-expect-error: fine.
  unknown,
  handlers: {
    blockquote,
    break: hardBreak,
    code,
    definition: ignore,
    delete: ignore,
    emphasis: phrasing,
    footnote,
    footnoteDefinition: ignore,
    footnoteReference,
    heading,
    html: ignore,
    image: link,
    imageReference: linkReference,
    inlineCode: literal,
    link,
    linkReference,
    list,
    listItem,
    paragraph,
    root,
    strong: phrasing,
    table,
    tableCell,
    tableRow,
    text: literal,
    toml: ignore,
    thematicBreak: ignore,
    yaml: ignore,
  },
});
function handle(node, context) {
  return transform(node, context);
}
function fromMdast(tree, options) {
  const settings = options || {};
  const context = {
    tight: settings.tight,
    endlinks: settings.endlinks,
    dsvName: "csv",
    dsvDelimiter: ",",
    defined: { definition: {}, footnoteDefinition: {} },
    queues: { link: [], footnote: [] },
    link: 0,
    footnote: 0,
  };
  visit(tree, (node) => {
    if (node.type === "definition" || node.type === "footnoteDefinition") {
      const map = context.defined[node.type];
      const id = (node.identifier || "").toUpperCase();
      if (id && !own2.call(map, id)) {
        map[id] = node;
      }
    }
  });
  return handle(tree, context);
}
function blockquote(node, context) {
  return inherit(node, { type: "quote", value: flow(node, context) });
}
function code(node) {
  let info = node.lang || null;
  if (info && node.meta) info += " " + node.meta;
  return inherit(node, { type: "pre", alt: info, value: node.value || "" });
}
function hardBreak() {
  return " ";
}
function heading(node, context) {
  const rank = Math.max(node.depth || 1, 1);
  const value = phrasing(node, context);
  const result =
    rank === 1 || rank === 2 || rank === 3
      ? inherit(node, { type: "heading", rank, value })
      : value
      ? inherit(node, { type: "text", value })
      : void 0;
  if (result) {
    return [...flush(context), result];
  }
}
function footnote(node, context) {
  const def = {
    type: "footnoteDefinition",
    identifier: "",
    children: [{ type: "paragraph", children: node.children }],
  };
  return "[" + toLetter(call(inherit(node, def), context).no) + "]";
}
function footnoteReference(node, context) {
  const id = (node.identifier || "").toUpperCase();
  const definition =
    id && own2.call(context.defined.footnoteDefinition, id)
      ? context.defined.footnoteDefinition[id]
      : null;
  return definition
    ? "[" + toLetter(call(definition, context).no) + "]"
    : void 0;
}
function link(node, context) {
  return phrasing(node, context) + "[" + resource(node, context).no + "]";
}
function linkReference(node, context) {
  const id = (node.identifier || "").toUpperCase();
  const definition =
    id && own2.call(context.defined.definition, id)
      ? context.defined.definition[id]
      : null;
  return (
    phrasing(node, context) +
    (definition ? "[" + resource(definition, context).no + "]" : "")
  );
}
function list(node, context) {
  return inherit(node, { type: "list", children: parent(node, context) });
}
function listItem(node, context) {
  let value = flow(node, context);
  if (typeof node.checked === "boolean") {
    value = (node.checked ? "\u2713" : "\u2717") + (value ? " " + value : "");
  }
  return inherit(node, { type: "listItem", value });
}
function paragraph(node, context) {
  const value = phrasing(node, context);
  return value ? inherit(node, { type: "text", value }) : void 0;
}
function root(node, context) {
  return inherit(node, {
    type: "root",
    children: wrap(
      context,
      // @ts-expect-error assume valid content.
      [...parent(node, context), ...flush(context, true)]
    ),
  });
}
function table(node, context) {
  return inherit(node, {
    type: "pre",
    alt: context.dsvName,
    value: parent(node, context).join("\n") || "",
  });
}
function tableCell(node, context) {
  const value = phrasing(node, context);
  return new RegExp('[\n\r"' + context.dsvDelimiter + "]").test(value)
    ? '"' + value.replace(/"/g, '""') + '"'
    : value;
}
function tableRow(node, context) {
  return parent(node, context).join(context.dsvDelimiter);
}
function ignore() {}
function literal(node) {
  return node.value || "";
}
function flow(node, context) {
  const nodes = parent(node, context);
  const results = [];
  let index = -1;
  while (++index < nodes.length) {
    results.push(nodes[index].value);
  }
  return results.join("\n").replace(/\r?\n/g, " ");
}
function phrasing(node, context) {
  return parent(node, context).join("").replace(/\r?\n/g, " ");
}
function parent(node, context) {
  const children = node.children || [];
  const results = [];
  let index = -1;
  while (++index < children.length) {
    const child = children[index];
    const value = handle(child, context);
    if (value) {
      if (Array.isArray(value)) {
        results.push(...value);
      } else {
        results.push(value);
      }
    }
  }
  return results;
}
function invalid(value) {
  throw new Error("Cannot handle value `" + value + "`, expected node");
}
function unknown(node) {
  throw new Error("Cannot handle unknown node `" + node.type + "`");
}
function flush(context, atEnd) {
  const links = context.queues.link;
  const footnotes = context.queues.footnote;
  const result = [];
  let index = -1;
  if (!context.endlinks || atEnd) {
    while (++index < links.length) {
      let value = "[" + links[index].no + "]";
      if (links[index].title) {
        value += " " + links[index].title;
      }
      result.push(
        inherit(links[index], { type: "link", url: links[index].url, value })
      );
    }
    links.length = 0;
  }
  if (atEnd) {
    index = -1;
    while (++index < footnotes.length) {
      let value = flow(footnotes[index], context);
      value =
        "[" + toLetter(footnotes[index].no) + "]" + (value ? " " + value : "");
      result.push(inherit(footnotes[index], { type: "text", value }));
    }
  }
  return result;
}
function resource(node, context) {
  const queued = context.queues.link;
  const url = node.url || "#";
  const title = node.title || "";
  let index = -1;
  while (++index < queued.length) {
    if (queued[index].url === url && queued[index].title === title) {
      return queued[index];
    }
  }
  const result = inherit(node, {
    type: "link-like",
    url,
    title,
    no: ++context.link,
  });
  queued.push(result);
  return result;
}
function call(node, context) {
  const queued = context.queues.footnote;
  const identifier = node.identifier || "";
  let index = -1;
  if (identifier) {
    while (++index < queued.length) {
      if (queued[index].identifier === identifier) {
        return queued[index];
      }
    }
  }
  const fnWithNumber = {
    type: "footnoteDefinition",
    identifier: node.identifier || "",
    children: node.children || [],
    no: ++context.footnote,
  };
  const result = inherit(node, fnWithNumber);
  queued.push(result);
  return result;
}
function inherit(left, right) {
  if ("data" in left && left.data) right.data = left.data;
  return position(left, right);
}
function position(left, right) {
  if ("position" in left && left.position) right.position = left.position;
  return right;
}
function toLetter(value) {
  let result = "";
  while (value) {
    const digit = (value - 1) % 26;
    result = String.fromCharCode(97 + digit) + result;
    value = Math.floor((value - digit) / 26);
  }
  return result;
}
function wrap(context, nodes) {
  let index = -1;
  if (context.tight || nodes.length === 0) {
    return nodes;
  }
  const result = [nodes[++index]];
  while (++index < nodes.length) {
    result.push({ type: "break" }, nodes[index]);
  }
  return result;
}
function stream(options) {
  const parse = parser();
  const compile2 = compiler(options);
  let ended;
  const write =
    /**
     * @type {(
     *   ((value?: Value, encoding?: Encoding, callback?: Callback) => boolean) &
     *   ((value: Value, callback?: Callback) => boolean)
     * )}
     */
    /**
     * @param {Value} [chunk]
     * @param {Encoding} [encoding]
     * @param {Callback} [callback]
     */
    function (chunk, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = void 0;
      }
      if (ended) {
        throw new Error("Did not expect `write` after `end`");
      }
      emitter.emit("data", compile2(parse(chunk, encoding)));
      if (callback) {
        callback();
      }
      return true;
    };
  const end =
    /**
     * @type {(
     *   ((value?: Value, encoding?: Encoding, callback?: Callback) => boolean) &
     *   ((value: Value, callback?: Callback) => boolean)
     * )}
     */
    /**
     * @param {Value} [chunk]
     * @param {Encoding} [encoding]
     * @param {Callback} [callback]
     */
    function (chunk, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = void 0;
      }
      if (ended) {
        throw new Error("Did not expect `write` after `end`");
      }
      emitter.emit("data", compile2(parse(chunk, encoding, true)));
      if (callback) {
        callback();
      }
      emitter.emit("end");
      ended = true;
      return true;
    };
  const emitter = Object.assign(new EventEmitter(), {
    writable: true,
    readable: true,
    write,
    end,
    pipe,
  });
  return emitter;
  function pipe(dest, options2) {
    emitter.on("data", ondata);
    emitter.on("error", onerror);
    emitter.on("end", cleanup);
    emitter.on("close", cleanup);
    if (!dest._isStdio && (!options2 || options2.end !== false)) {
      emitter.on("end", onend);
    }
    dest.on("error", onerror);
    dest.on("close", cleanup);
    dest.emit("pipe", emitter);
    return dest;
    function onend() {
      if (dest.end) {
        dest.end();
      }
    }
    function ondata(chunk) {
      if (dest.writable) {
        dest.write(chunk);
      }
    }
    function cleanup() {
      emitter.removeListener("data", ondata);
      emitter.removeListener("end", onend);
      emitter.removeListener("error", onerror);
      emitter.removeListener("end", cleanup);
      emitter.removeListener("close", cleanup);
      dest.removeListener("error", onerror);
      dest.removeListener("close", cleanup);
    }
    function onerror(error) {
      cleanup();
      if (!emitter.listenerCount("error")) {
        throw error;
      }
    }
  }
}
var handle2 = zwitch("type", {
  invalid: invalid2,
  // @ts-expect-error: fine
  unknown: unknown2,
  handlers: {
    break: hardBreak2,
    heading: heading2,
    link: link2,
    list: list2,
    listItem: listItem2,
    pre,
    quote,
    root: root2,
    text: literal2,
  },
});
function toGemtext(tree) {
  return handle2(tree);
}
function invalid2(value) {
  throw new Error("Cannot handle value `" + value + "`, expected node");
}
function unknown2(node) {
  throw new Error("Cannot handle unknown node `" + node.type + "`");
}
function hardBreak2() {
  return "\n";
}
function heading2(node) {
  const sequence = "#".repeat(Math.max(Math.min(3, node.rank || 1), 1));
  const value = literal2(node);
  return sequence + (value ? " " + value : "");
}
function link2(node) {
  const text2 = literal2(node);
  let value = "=>";
  if (node.url) {
    value += " " + node.url;
    if (text2) value += " " + text2;
  }
  return value;
}
function list2(node) {
  return parent2(node) || "*";
}
function listItem2(node) {
  const value = literal2(node);
  return "*" + (value ? " " + value : "");
}
function pre(node) {
  const value = literal2(node);
  return "```" + (node.alt || "") + (value ? "\n" + value : "") + "\n```";
}
function quote(node) {
  const value = literal2(node);
  return ">" + (value ? " " + value : "");
}
function root2(node) {
  let value = parent2(node);
  if (value.length > 0 && value.charCodeAt(value.length - 1) !== 10) {
    value += "\n";
  }
  return value;
}
function parent2(node) {
  const children = node.children || [];
  const results = [];
  let index = -1;
  while (++index < children.length) {
    const value =
      /** @type {string} */
      handle2(children[index]);
    if (value) results.push(value === "\n" ? "" : value);
  }
  return results.join("\n");
}
function literal2(node) {
  return node.value || "";
}
var transform2 = zwitch("type", {
  handlers: {
    break: handleBreak,
    heading: heading3,
    link: link3,
    list: list3,
    listItem: listItem3,
    pre: pre2,
    quote: quote2,
    root: root3,
    text,
  },
  invalid: invalid3,
  // @ts-expect-error: fine.
  unknown: unknown3,
});
function toMdast(node) {
  return transform2(node);
}
function invalid3(value) {
  throw new Error("Cannot handle value `" + value + "`, expected node");
}
function unknown3(node) {
  throw new Error("Cannot handle unknown node `" + node.type + "`");
}
function handleBreak(_) {}
function heading3(node) {
  const depth =
    /** @type {1|2|3} */
    Math.max(Math.min(3, node.rank || 1), 1);
  return inherit2(node, {
    type: "heading",
    depth,
    children: node.value
      ? [position2(node, { type: "text", value: node.value })]
      : [],
  });
}
function link3(node) {
  return position2(node, {
    type: "paragraph",
    children: [
      inherit2(node, {
        type: "link",
        url: node.url || "",
        title: null,
        children: node.value
          ? [position2(node, { type: "text", value: node.value })]
          : [],
      }),
    ],
  });
}
function list3(node) {
  const children = node.children || [];
  const results = [];
  let index = -1;
  while (++index < children.length) {
    results.push(toMdast(children[index]));
  }
  return inherit2(node, {
    type: "list",
    ordered: false,
    spread: false,
    children:
      results.length > 0
        ? results
        : [{ type: "listItem", spread: false, children: [] }],
  });
}
function listItem3(node) {
  return inherit2(node, {
    type: "listItem",
    spread: false,
    children: node.value
      ? [
          position2(node, {
            type: "paragraph",
            children: [position2(node, { type: "text", value: node.value })],
          }),
        ]
      : [],
  });
}
function pre2(node) {
  let lang = null;
  let meta = null;
  if (node.alt) {
    const info = node.alt.replace(/^[ \t]+|[ \t]+$/g, "");
    const match = info.match(/[\t ]+/);
    if (match && match.index !== void 0) {
      lang = info.slice(0, match.index);
      meta = info.slice(match.index + match[0].length);
    } else {
      lang = info;
    }
  }
  return inherit2(node, {
    type: "code",
    lang,
    meta,
    value: node.value || "",
  });
}
function quote2(node) {
  return inherit2(node, {
    type: "blockquote",
    children: node.value
      ? [
          position2(node, {
            type: "paragraph",
            children: [position2(node, { type: "text", value: node.value })],
          }),
        ]
      : [],
  });
}
function root3(node) {
  const children = node.children || [];
  const results = [];
  let index = -1;
  while (++index < children.length) {
    const value = toMdast(children[index]);
    if (value) results.push(value);
  }
  return inherit2(node, { type: "root", children: results });
}
function text(node) {
  return node.value
    ? inherit2(node, {
        type: "paragraph",
        children: [position2(node, { type: "text", value: node.value })],
      })
    : void 0;
}
function inherit2(left, right) {
  if (left.data) right.data = left.data;
  return position2(left, right);
}
function position2(left, right) {
  if (left.position) right.position = left.position;
  return right;
}
export {
  buffer,
  compiler,
  fromGemtext,
  fromMdast,
  parser,
  stream,
  toGemtext,
  toMdast,
};
