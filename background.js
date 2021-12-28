const marked = import("./marked.min.js").then(e=>e.default);
const dioscuri = import("./dioscuri.min.js").then(e=>e.default).then(e=>e.buffer);
const css = import("./css.js").then(e=>e.default)
const inpage = import("./inpage.js").then(e=>e.default)
const requests = {};

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

function onHeadersReceived(details) {
  console.log("onHeadersReceived", details.requestId, "fromCache", details.fromCache, "statusCode", details.statusCode)
  if(!requests[details.requestId] || (!((details.statusCode>=200&&details.statusCode<300)||details.statusCode>=400) && !details.fromCache)) return;
  let filter = requests[details.requestId].filter;
  handler: {
    requests[details.requestId].handled=true;
    let args, encoder, mime, rerequest, md, gmi;
    try {
      let cth = details.responseHeaders.find(e=>e.name.toLowerCase()=="content-type")
      if(!cth) cth = details.responseHeaders.push({name: "Content-Type", value:"application/octet-stream"})
      /*if(details.statusCode==304){ // If cached, we need to use XHR to get a copy
        let request = new XMLHttpRequest();
        request.open('HEAD', details.url, false);
        //for(let {name, value} of requests[details.requestId].requestHeaders) request.setRequestHeader(name, value)
        request.send(null);
        mime=request.getResponseHeader("content-type")
        rerequest=true
      } else */
      if((details.statusCode>=200&&details.statusCode<300)||details.statusCode>=400) {
        mime = cth.value.toLowerCase();
      } else break handler
      if(!((md=mime=="text/markdown"||mime.startsWith("text/markdown;"))||(gmi=mime=="text/gemini"||mime.startsWith("text/gemini;")))) break handler
      encoder = new TextEncoder("utf-8");
      cth.value="text/html; charset=utf-8"
    } catch (e) { break handler }
    let data = [];
    let done = async () => {
      let blob = new Blob(data, {type: mime});
      let str = await blob.text();
      let title;
      if(md){
        (await marked).use({renderer:{heading(e, t, u, n) {
          if(t==1 && !title) {
            let b=new DOMParser().parseFromString(e,"text/html").body;
            b.innerText=b.innerText.trim()
            title=b.innerHTML
          }
          return '<h' + t + ' id="' + n.slug(u) + '">' + e + '</h' + t + '>\n'
        }}})
        str = (await marked)(str);
      }else if(gmi){
        str = (await dioscuri)(str, null, null, t=>{
          if(title) return t;
          let i=t.findIndex(e=>e.type=="headingSequence"&&e.value=="#")
          if(i==-1) return t;
          try{
            title=t.slice(i).find(e=>e.type=="headingText").value;
          }catch(e){}
          return t;
        })
      }
      filter.write(encoder.encode(`
<!DOCTYPE html>
<html>
<head>
  <meta content="text/html; charset=UTF-8" http-equiv="content-type" />
  <meta name="viewport" content="width=device-width; user-scalable=0" />
  <style>${await css}</style>
  <title>${title}</title>
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
            <div class="dropdown-arrow"></div>
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
</html>
      `));
      filter.close();
    }
    /*if(rerequest) {
      let request = new XMLHttpRequest();
      request.open('GET', details.url, false);
      for(let {name, value} of requests[details.requestId].requestHeaders) request.setRequestHeader(name, value)
      request.send(null);
      data.push(request.responseText)
      done()
    } else {*/
    filter.ondata = event => {
      data.push(event.data);
    };
    filter.onstop = done;
    /*}*/
    delete requests[details.requestId];
    console.log(details.responseHeaders)
    return {responseHeaders: details.responseHeaders /*, statusCode: rerequest?200:details.statusCode*/};
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
