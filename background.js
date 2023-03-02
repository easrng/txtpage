const requests = {};
function filterToStream(filter) {
  let events = [];
  let pending = null;
  function pushOrPending(obj) {
    console.log(pending, obj, [...events, obj]);
    if (pending) {
      pending(obj);
    } else {
      events.push(obj);
    }
  }
  filter.onerror = (error) => pushOrPending({ error });
  filter.ondata = (data) => pushOrPending({ data });
  filter.onstop = (stop) => pushOrPending({ stop });
  filter.onstart = (start) => pushOrPending({ start });
  return (async function* () {
    while (true) {
      let e;
      if (events.length > 0) {
        e = events.shift();
      } else {
        e = await new Promise((cb) => {
          pending = (obj) => {
            cb(obj);
            pending = null;
          };
        });
      }
      console.log(e);
      if (e.data) yield e.data.data;
      if (e.error) throw e.error;
      if (e.stop) return;
    }
  })();
}

if (typeof browser.webRequest.filterResponseData == "function") {
  function onBeforeRequest(details) {
    console.log("onBeforeRequest", details.requestId);
    if (requests[details.requestId]) return;
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const stream = filterToStream(filter);
    requests[details.requestId] = { filter, stream };
    return {};
  }
  browser.webRequest.onBeforeRequest.addListener(
    onBeforeRequest,
    { urls: ["*://" + "*/" + "*"], types: ["main_frame"] },
    ["blocking"]
  );
}
async function returnAsIs(filter, stream, requests, details) {
  if (!filter || !stream) return;
  for await (const i of stream) filter.write(i);
  console.log("stream done");
  filter.close();
  delete requests[details.requestId];
}
function onHeadersReceived(details) {
  console.log(
    "onHeadersReceived",
    details.requestId,
    "fromCache",
    details.fromCache,
    "statusCode",
    details.statusCode
  );
  let filter =
    requests[details.requestId] && requests[details.requestId].filter;
  let stream =
    requests[details.requestId] && requests[details.requestId].stream;
  if (
    (typeof browser.webRequest.filterResponseData == "function" &&
      !requests[details.requestId]) ||
    (!(
      (details.statusCode >= 200 && details.statusCode < 300) ||
      details.statusCode >= 400
    ) &&
      !details.fromCache)
  )
    return returnAsIs(filter, stream, requests, details);
  let mime, format;
  let cth = details.responseHeaders.find(
    (e) => e.name.toLowerCase() == "content-type"
  );
  if (!cth)
    cth = details.responseHeaders.push({
      name: "Content-Type",
      value: "application/octet-stream",
    });
  mime = cth.value.toLowerCase();
  format = getFormat(mime, details.url);
  if (typeof browser.webRequest.filterResponseData != "function") {
    if (format)
      return {
        redirectUrl:
          browser.runtime.getURL("viewer.html") +
          "?url=" +
          encodeURIComponent(details.url),
      };
    return;
  }
  handler: {
    if (!format) break handler;
    requests[details.requestId].handled = true;
    const encoder = new TextEncoder("utf-8");
    (async () => {
      const data = [];
      for await (const i of stream) data.push(i);
      console.log("stream done");
      let blob = new Blob(data, { type: mime });
      let str = await blob.text();
      filter.write(encoder.encode(await toHTML(mime, str, "", details.url)));
      filter.close();
    })();
    delete requests[details.requestId];
    cth.value = "text/html; charset=utf-8";
    return { responseHeaders: details.responseHeaders };
  }
  returnAsIs(filter, stream, requests, details);
}

browser.webRequest.onHeadersReceived.addListener(
  onHeadersReceived,
  { urls: ["*://*/*"], types: ["main_frame"] },
  ["blocking", "responseHeaders"]
);
