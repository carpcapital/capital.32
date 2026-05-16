try {
  // スクリプト追加
  function appendCcfpScript() {
    var url = ""; // https://dev-ccfp.cloudcircus.ai/ccfp.js
    if ((window.parent && window.parent.initViewer) || (window.initViewer)) {
      var contentInfo = window.parent.initViewer() || window.initViewer();
      url = contentInfo.ccfp_URL || "";
    }

    const script = document.createElement("script");
    script.src = url;  // 環境により変更
    document.body.appendChild(script);
  }

  appendCcfpScript();

} catch (error) { } // エラーは処理しない

try {
  if (window.$actibook_device) {
    reSetIframeSize();
  } else {
    loadDeviceJs();
  }
} catch (error) {
  loadDeviceJs();
}

function reSetIframeSize() {
  var actibookone_iframe = document.getElementById("actibookone_iframe");
  var actibookone_iframe_byName = document.getElementsByName("actibookone_iframe_name");
  if (actibookone_iframe_byName && actibookone_iframe_byName.length > 0) {
    for (var i = 0; i < actibookone_iframe_byName.length; i++) {
      if (window.$actibook_device.mobile()) {
        actibookone_iframe_byName[i].style["min-width"] = "320px";
        actibookone_iframe_byName[i].style["min-height"] = "210px";
      } else {
        actibookone_iframe_byName[i].style["min-width"] = "557px";
        actibookone_iframe_byName[i].style["min-height"] = "270px";
      }
    }
  } else if (actibookone_iframe) {
    if (window.$actibook_device.mobile()) {
      actibookone_iframe.style["min-width"] = "320px";
      actibookone_iframe.style["min-height"] = "210px";
    } else {
      actibookone_iframe.style["min-width"] = "557px";
      actibookone_iframe.style["min-height"] = "270px";
    }
  }

}

function loadDeviceJs() {
  var actibookone_script = document.getElementById("actibookone_script");

  if (!actibookone_script) {
    var actibookone_iframe = document.getElementById("actibookone_iframe");
    var actibookone_iframe_byName = document.getElementsByName("actibookone_iframe_name");

    if (actibookone_iframe_byName && actibookone_iframe_byName.length > 0) {

      actibookone_script = actibookone_iframe_byName[0].nextSibling;

    } else if (actibookone_iframe) {

      actibookone_script = actibookone_iframe.nextSibling;

    }

  }

  if (!actibookone_script || !actibookone_script.src) {
    return false;
  }

  var path = actibookone_script.src.replace("embedded_iframe_script.js", "");

  var _device_ts = document.createElement('script');
  _device_ts.src = path + 'device.js';
  _device_ts.charset = 'utf-8';
  document.getElementsByTagName('head')[0].appendChild(_device_ts);

  _device_ts.onload = function () {
    reSetIframeSize();
  }

  _device_ts.onerror = function () {

  }
}
