

var dl_keyword = '';
(function () {
  dl_keyword = html_encode(getQueryString('keyword'))
  let macDevice = (navigator.userAgent.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) ? true : false;
  if (device.mobile()) {
    var viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    document.head.appendChild(viewport);
  } else if (device.tablet() || macDevice) {
    // 端末の向き変更時
    var isTilted = false; // Android の特殊端末対策
    if (navigator.userAgent.indexOf('Android') > 0) {
      var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
      if (orientation.type === "portrait-secondary" || orientation.type === "landscape-primary") {
        isTilted = true;
      }
    }
    var portlaitViewport = function () {
        $('head').append('<meta name="viewport" content="width=768">');
      },
      landscapeViewport = function () {
        $('head').append('<meta name="viewport" content="width=device-width">');
      };
    $(window).on('orientationchange', function () {
      var orientation = window.orientation;
      $('meta[name="viewport"]').remove();
      if (isTilted) {
        if (orientation === 0) {  // 横
          landscapeViewport();
        } else {  // 縦
          portlaitViewport();
        }
      } else {
        if (orientation === 0) {  // 縦
          portlaitViewport();
        } else {  // 横
          landscapeViewport();
        }
      }
    }).trigger('orientationchange');
  } else {
    var viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=1200';
    document.head.appendChild(viewport);
  }

  if (device.desktop() || device.windowsTablet()) {
    $("body, html").css("overflow", "hidden");
  }

})();

function getQueryString(name) {
  var params = new URLSearchParams(window.location.search);
  let keyword = params.get('keyword');
  return keyword || '';
}

function html_encode(str)
{
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&gt;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\'/g, "'");
  s = s.replace(/\"/g, "&quot;");
  s = s.replace(/\n/g, "<br>");
  return s;
}




var configInfoJson = null;
try {
  $.ajax({
    type: 'GET',
    url: "jsons/configinfo.json",
    async: false,
    dataType: "json",
    success: function (result) {
      configInfoJson = result;
      $.title = configInfoJson['contentTitle'];
    },
    error: function (msg) {

    }
  });
} catch (err) {

}

function isBack() {
  if (!document.referrer) {
    return false;
  } else {
    return true;
  }
}

function back() {
  window.history.go(-1);
}

function gotoTop_poste() {
  $('body,html').scrollTop(0);
}

// #1551页面初始化时置顶
function gotoTopByViewer() {
  $('body,html').scrollTop(0);
  if (window.frames['pcFrame']) {
    window.frames['pcFrame'].contentWindow.document.body.scrollTop = 0;
    window.frames['pcFrame'].contentWindow.document.documentElement.scrollTop = 0;
  }
}

function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    params: (function () {
      var ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length, i = 0, s;
      for (; i < len; i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        v = seg[i].indexOf('=') + 1;
        ret[s[0]] = seg[i].substr(v);
      }
      return ret;
    })(),
    baseUrl: decodeURI(url.split("?")[0])
  };
}

var myURL = parseURL(window.location.href);
var embedFlg = myURL["params"]["embedFlg"];

function getParams() {
  var params = {};
  if (myURL["params"] && myURL["params"]["param"]) {

    var urlUnicode = BASE64.decoder(decodeURIComponent(myURL["params"]["param"]));

    var str = "";
    for (var i = 0, len = urlUnicode.length; i < len; ++i) {
      str += String.fromCharCode(urlUnicode[i]);
    }
    urlParams = str.split("_");

    params["readType"] = urlParams[1];
    params["readFrom"] = urlParams[2];
  } else {

  }

  if (myURL["params"]["detailFlg"] == 0) {
    params["contentInfoDispFlg"] = 0;
  } else {
    params["contentInfoDispFlg"] = 1;
  }

  params["readProgress"] = myURL["params"]["pNo"] || 0;

  if (params["readFrom"]) {

  } else {
    if (document.referrer) {
      var hostname = $("<a>").attr("href", document.referrer)[0].hostname.toLowerCase();
      if (hostname && hostname.indexOf("actibookone.com") > -1) {
        params["readFrom"] = "2";
      } else {
        params["readFrom"] = "3";
      }
    } else {
      params["readFrom"] = "1";
    }
  }

  if (!params["contentNum"]) {
    params["contentNum"] = configInfoJson["contentNum"];
  }

  params["appButtonDispFlg"] = configInfoJson["appButtonDispFlg"];
  params["dispLanguage"] = configInfoJson["dispLanguage"];
  params["shareableFlg"] = configInfoJson["shareableFlg"];
  params["pdfOutputFlg"] = configInfoJson["pdfOutputFlg"];
  params["imgType"] = configInfoJson["imgType"] || 'png';

  params["indexUrl"] = window.location.href;

  params["shareBaseUrl"] = myURL["baseUrl"] || "";

  if (myURL["params"]["embedFlg"] && myURL["params"]["embedFlg"] == "1") {
    params["embedFlg"] = myURL["params"]["embedFlg"];
  }

  params['configInfoJson'] = configInfoJson;

  return params;
}

if (embedFlg && embedFlg == 1) {
  $("body").html('<iframe src="embed_index.html" frameborder="0" width="100%" height="100%" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>');
} else if (device.tablet() || device.desktop()) {
  $("body").html('<iframe id="pcFrame" src="pc_index.html" frameborder="0" width="100%" height="100%" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>');
} else {
  $("body").html('<iframe src="sd_index.html" frameborder="0" width="100%" height="100%" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>');
}

function getScreenSize() {
  var screenSize_height = document.body.offsetHeight;
  return screenSize_height;
}

function getScreenSize_width() {
  var screenSize_width = document.body.offsetWidth;
  return screenSize_width;
}

// 根据embedFlg，调整html样式
if (embedFlg && embedFlg == 1) {
  let htmlDom = document.documentElement;
  let bodyDom = document.body;
  htmlDom.className += " hiddenHtml";
  bodyDom.className += " hiddenHtml";
}
