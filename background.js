const requests = {};

if(typeof browser.webRequest.filterResponseData == "function") {
  function onBeforeRequest(details) {
    console.log("onBeforeRequest", details.requestId)
    if(requests[details.requestId]) return;
    let filter = browser.webRequest.filterResponseData(details.requestId);
    filter.onerror=console.error
    requests[details.requestId]={filter}
    return {};
  }
  
  browser.webRequest.onBeforeRequest.addListener(
    onBeforeRequest,
    {urls: ["*://*/*"], types: ["main_frame"]},
    ["blocking"]
  );
}

function onHeadersReceived(details) {
  console.log("onHeadersReceived", details.requestId, "fromCache", details.fromCache, "statusCode", details.statusCode)
  if((typeof browser.webRequest.filterResponseData == "function" && !requests[details.requestId]) || (!((details.statusCode>=200&&details.statusCode<300)||details.statusCode>=400) && !details.fromCache)) return;
  let mime, format;
  let cth = details.responseHeaders.find(e=>e.name.toLowerCase()=="content-type")
  if(!cth) cth = details.responseHeaders.push({name: "Content-Type", value:"application/octet-stream"})
  mime = cth.value.toLowerCase();
  format = validMime(mime)
  if(typeof browser.webRequest.filterResponseData != "function"){
    if(format) return {redirectUrl: browser.runtime.getURL("viewer.html")+"?url="+encodeURIComponent(details.url)}
    return
  }
  let filter = requests[details.requestId].filter;
  handler: {
    if(!format) break handler;
    requests[details.requestId].handled=true;
    let args, encoder, rerequest;
    let data = [];
    encoder = new TextEncoder("utf-8");
    let done = async () => {
      let blob = new Blob(data, {type: mime});
      let str = await blob.text();
      filter.write(encoder.encode(await toHTML(mime, str)));
      filter.close();
    }
    filter.ondata = event => {
      data.push(event.data);
    };
    filter.onstop = done;
    delete requests[details.requestId];
    cth.value="text/html; charset=utf-8"
    return {responseHeaders: details.responseHeaders};
  }
  filter.ondata = event => {
    filter.write(event.data);
  };
  filter.onstop = async event => {
    filter.close();
  };
  delete requests[details.requestId];
}

browser.webRequest.onHeadersReceived.addListener(
  onHeadersReceived,
  {urls: ["*://*/*"], types: ["main_frame"]},
  ["blocking", "responseHeaders"]
);
