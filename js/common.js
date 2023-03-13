const marked = import("../lib/marked.js").then((e) => e.marked);
const dioscuri = import("../lib/dioscuri/buffer.development.bundle.js").then((e) => e.buffer);
const css = import("./css.js").then((e) => e.default);
const inpage = import("./inpage.js").then((e) => e.default);

const isMozzUs = (url) =>
  url.startsWith("https://portal.mozz.us/gemini/") ||
  url.startsWith("http://portal.mozz.us/gemini/");
function getFormat(mime, url) {
  let md, gmi;
  const isText = mime == "text/plain" || mime.startsWith("text/plain;");
  try {
    if (
      !(
        (md =
          mime === "text/markdown" ||
          mime.startsWith("text/markdown;") ||
          (isText && (url.endsWith(".md") || url.endsWith(".markdown")))) ||
        (gmi =
          mime === "text/gemini" ||
          mime.startsWith("text/gemini;") ||
          (isText && (url.endsWith(".gmi") || isMozzUs(url))))
      )
    )
      return false;
  } catch (e) {
    return false;
  }
  return md ? "md" : gmi ? "gmi" : false;
}

window.toHTML = async function toHTML(mime, str, extraHead, url) {
  let title = "";
  let format = getFormat(mime, url);
  if (format == "md") {
    (await marked).use({
      renderer: {
        heading(e, t, u, n) {
          if (t == 1 && !title) {
            let b = new DOMParser().parseFromString(e, "text/html").body;
            b.innerText = b.innerText.trim();
            title = b.innerText;
          }
          return "<h" + t + ' id="' + n.slug(u) + '">' + e + "</h" + t + ">\n";
        },
      },
    });
    str = (await marked)(str);
  } else if (format == "gmi") {
    str = new DOMParser().parseFromString(
      "<body>" + (await dioscuri)(str) + "</body>",
      "text/html"
    );
    title = str.querySelector("h1") || title;
    if (title) title = title.textContent.trim();
    const baseURL = isMozzUs(url)
      ? "gemini://" +
        decodeURIComponent(new URL(url).pathname.slice("/gemini/".length))
      : url;
    for (const link of str.querySelectorAll("a")) {
      const url = new URL(link.getAttribute("href"), baseURL);
      if (url.protocol === "gemini:") {
        const [host, path] = url.href
          .match(/^gemini:(?:\/\/?)?([^/]+)(?:\/(.*))?$/)
          .slice(1);
        link.href =
          "https://portal.mozz.us/gemini/" +
          host +
          "/" +
          encodeURI(path) +
          "?raw=1";
      } else {
        link.href = url;
      }
    }
    str = str.body.innerHTML;
  } else {
    str =
      '<h1 id="error">Error</h1><p>There was an error loading this page. Please check the console for errors and report them <a href="https://github.com/easrng/txtpage/issues">here</a>.</p>';
    title = "Error";
  }
  return `
<!DOCTYPE html>
<html>
<head>
  <meta content="text/html; charset=UTF-8" http-equiv="content-type" />
  <meta name="viewport" content="width=device-width, user-scalable=0" />
  <style>${await css}</style>
  <title>${new Option(title).innerHTML}</title>
  ${extraHead || ""}
</head>
<body>
  <script>document.body.style.opacity="0"</script>
  <div class="top-anchor"></div>
  <div id="toolbar" class="toolbar-container">
    <div class="toolbar reader-toolbar">
      <div class="reader-controls">
        <ul class="dropdown style-dropdown">
          <li>
            <button class="dropdown-toggle button style-button"></button>
          </li>
          <li class="dropdown-popup">
            <svg class="dropdown-arrow" viewBox="0 0 16 24"><polygon points="16.58 0.01 16.57 0 4.58 12 16.57 24 16.58 23.98"/></svg>

            <div class="font-type-buttons radiorow"></div>
            <div class="font-size-buttons buttonrow">
              <button class="minus-button"></button>
              <span class="font-size-value"></span>
              <button class="plus-button"/>
            </div>
            <div class="content-width-buttons buttonrow">
               <button class="content-width-minus-button"></button>
               <span class="content-width-value"></span>
               <button class="content-width-plus-button"/>
            </div>
            <div class="line-height-buttons buttonrow">
                <button class="line-height-minus-button"></button>
                <span class="line-height-value"></span>
                <button class="line-height-plus-button"/>
            </div>
            <div class="color-scheme-buttons radiorow"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="content">
      <div class="moz-reader-content reader-show-element">${str}</div>
    </div>
    <div aria-owns="toolbar"></div>
  </div>
  <script>${await inpage}</script>
</body>
</html>`;
}
