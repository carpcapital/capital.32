function parseURL(url) {
   var a =  document.createElement('a');
   a.href = url;
   return {
       params: (function(){
           var ret = {},
               seg = a.search.replace(/^\?/,'').split('&'),
               len = seg.length, i = 0, s;
           for (;i<len;i++) {
               if (!seg[i]) { continue; }
               s = seg[i].split('=');
               v = seg[i].indexOf('=') + 1;
               ret[s[0]] = seg[i].substr(v);
           }
           return ret;
       })(),
       baseUrl: url.split("?")[0]
   };
}

var IOS_STORE_URL = 'https://itunes.apple.com/jp/app/poste/id1340030905?mt=8';
var ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.startialab.poste';
var IOS_TIMEOUT = 500;
var ANDROID_TIMEOUT = 1000;
var isiOS = navigator.userAgent.match('iPad') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || navigator.userAgent.match('Macintosh') || navigator.userAgent.match('Mac OS') || navigator.userAgent.match('iPhone') || navigator.userAgent.match('iPod'),
    isAndroid = navigator.userAgent.match('Android');
var param = parseURL(window.location.href)["params"]["callAppUrl"];
var param_url_decode = decodeURIComponent(param);
var urlUnicode = BASE64.decoder(param_url_decode);

var callAppUrl = "";
for(var i = 0, len = urlUnicode.length; i < len; ++i){
  callAppUrl += String.fromCharCode(urlUnicode[i]);
}

var timeLoad;
if (isiOS) {
    timeLoad = window.setTimeout(function () {
        window.location = IOS_STORE_URL;
    }, IOS_TIMEOUT);
} else {
    timeLoad = window.setTimeout(function () {
        window.location = ANDROID_STORE_URL;
    }, ANDROID_TIMEOUT);
}

function startsWithIgnoreCase(str, prefix) {
  return str.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase()
}

if(startsWithIgnoreCase(callAppUrl, 'https://') || startsWithIgnoreCase(callAppUrl, 'http://') || startsWithIgnoreCase(callAppUrl, 'poste:///')){
  window.location = callAppUrl;
}
//window.focus();
// window.location = callAppUrl;
//window.onblur = function () {
    //window.clearTimeout(timeLoad);
//}
