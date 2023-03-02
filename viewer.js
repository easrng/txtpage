NProgress.start();
let frame = document.querySelector("iframe");
frame.onload = () => {
  Comlink.expose(
    {
      localStorage,
      getAll() {
        let o = {};
        for (let i = 0; i < localStorage.length; i++)
          o[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
        return o;
      },
    },
    {
      addEventListener: window.addEventListener.bind(window),
      removeEventListener: window.removeEventListener.bind(window),
      postMessage: (m) => frame.contentWindow.postMessage(m, "*"),
    }
  );
  NProgress.done();
};
(async () => {
  let params = new URLSearchParams(location.search.slice(1));
  let mime, str, url;
  try {
    let res = await fetch(params.get("url"));
    mime = res.headers.get("content-type");
    str = await res.text();
    url = params.get("url");
  } catch (e) {
    mime = "text/markdown";
    str = `# Error
There was an error loading this page. Check the console for errors and report them [here](https://github.com/easrng/txtpage/issues).`;
  }
  document.title = url;
  str = await toHTML(
    mime,
    str,
    `<base href="${new Option(url).innerHTML}" target="_top">
<meta http-equiv="Content-Security-Policy" content="default-src * 'self' data: 'unsafe-inline' 'unsafe-hashes' 'unsafe-eval'">`,
    url
  );
  document.title =
    new DOMParser().parseFromString(str, "text/html").title || url;
  frame.src =
    chrome.runtime.getURL("sandbox.html") + "?" + encodeURIComponent(str);
})();
