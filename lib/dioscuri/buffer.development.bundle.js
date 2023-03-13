// esm-build-23820c9b970303496aa4739a417ff17e0b18ab98-50a63f31/index.js
var unicodePunctuationRegex = /[!-/:-@[-`{-~\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
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
  function check(code) {
    return code !== null && regex.test(String.fromCharCode(code));
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
    slash > -1 && colon > slash || questionMark > -1 && colon > questionMark || numberSign > -1 && colon > numberSign || // It is a protocol, it should be allowed.
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
    const code = value.charCodeAt(index);
    let replace = "";
    if (code === 37 && asciiAlphanumeric(value.charCodeAt(index + 1)) && asciiAlphanumeric(value.charCodeAt(index + 2))) {
      skip = 2;
    } else if (code < 128) {
      if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) {
        replace = String.fromCharCode(code);
      }
    } else if (code > 55295 && code < 57344) {
      const next = value.charCodeAt(index + 1);
      if (code < 56320 && next > 56319 && next < 57344) {
        replace = String.fromCharCode(code, next);
        skip = 1;
      } else {
        replace = "\uFFFD";
      }
    } else {
      replace = String.fromCharCode(code);
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
  return compile;
  function compile(tokens) {
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
      if (inList && (token.type === "eol" && token.hard || token.type !== "eol" && token.type !== "listSequence" && token.type !== "listText" && token.type !== "whitespace")) {
        if (atEol)
          results.push(atEol, defaultLineEnding || "\n");
        results.push("</ul>");
        if (!atEol && defaultLineEnding)
          results.push(defaultLineEnding);
        inList = void 0;
        atEol = void 0;
      }
      if (token.type === "eol") {
        if (atEol)
          results.push(atEol);
        if (token.hard)
          results.push("<br />");
        if (!slurpEol)
          results.push(encode(token.value));
        atEol = void 0;
        slurpEol = void 0;
      } else if (token.type === "eof") {
        if (atEol)
          results.push(atEol);
        if (preformatted === "preAlt")
          results.push("</code>");
        if (preformatted)
          results.push("</pre>");
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
            allowDangerousProtocol ? void 0 : /^(gemini|https?|ircs?|mailto|xmpp)$/i
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
        if (preformatted)
          slurpEol = true;
      } else if (token.type === "preAlt") {
        if (preformatted) {
          results.push('<code class="language-', encode(token.value), '">');
          preformatted = "preAlt";
        }
      } else if (token.type === "headingText" || token.type === "linkText" || token.type === "listText" || token.type === "preText") {
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
    if (buf)
      values.push(buf.slice(start).toString(encoding));
    if (done) {
      parseLine(values.join(""));
      add("eof", "");
    }
    return results;
    function parseLine(value) {
      const code = value.charCodeAt(0);
      if (code === 96 && value.charCodeAt(1) === 96 && value.charCodeAt(2) === 96) {
        add("preSequence", value.slice(0, 3));
        if (value.length !== 3)
          add("preAlt", value.slice(3));
        preformatted = !preformatted;
      } else if (preformatted) {
        if (value)
          add("preText", value);
      } else if (code === 35) {
        let index = 1;
        while (index < 3 && value.charCodeAt(index) === 35)
          index++;
        add("headingSequence", value.slice(0, index));
        const start2 = index;
        while (ws(value.charCodeAt(index)))
          index++;
        if (start2 !== index)
          add("whitespace", value.slice(start2, index));
        if (index !== value.length)
          add("headingText", value.slice(index));
      } else if (code === 42 && (value.length === 1 || ws(value.charCodeAt(1)))) {
        add("listSequence", "*");
        let index = 1;
        while (ws(value.charCodeAt(index)))
          index++;
        if (index > 1)
          add("whitespace", value.slice(1, index));
        if (value.length > index)
          add("listText", value.slice(index));
      } else if (code === 61 && value.charCodeAt(1) === 62) {
        add("linkSequence", value.slice(0, 2));
        let index = 2;
        while (ws(value.charCodeAt(index)))
          index++;
        if (index > 2)
          add("whitespace", value.slice(2, index));
        let start2 = index;
        while (index < value.length && !ws(value.charCodeAt(index)))
          index++;
        if (index > start2)
          add("linkUrl", value.slice(start2, index));
        start2 = index;
        while (ws(value.charCodeAt(index)))
          index++;
        if (index > start2)
          add("whitespace", value.slice(start2, index));
        if (value.length > index)
          add("linkText", value.slice(index));
      } else if (code === 62) {
        add("quoteSequence", value.slice(0, 1));
        let index = 1;
        while (ws(value.charCodeAt(index)))
          index++;
        if (index > 1)
          add("whitespace", value.slice(1, index));
        if (value.length > index)
          add("quoteText", value.slice(index));
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
      if (fields)
        Object.assign(token, fields);
      token.start = start2;
      token.end = now();
      results.push(token);
    }
    function now() {
      return { line, column, offset };
    }
  }
}
function ws(code) {
  return code === 9 || code === 32;
}
function buffer(doc, encoding, options) {
  return compiler(options)(parser()(doc, encoding, true));
}
export {
  buffer
};
//# sourceMappingURL=buffer.development.bundle.js.map