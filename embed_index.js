function getParams() {
  var parent_params = window.parent.getParams();

  var pageno = parent_params["readProgress"] || 0;

  var actibookone_App_url = "poste://?";
  actibookone_App_url += "readType=" + (parent_params["readType"] || "0");
  actibookone_App_url += "&readFrom=" + (parent_params["readFrom"]);
  actibookone_App_url += "&pageNo=" + (pageno);
  actibookone_App_url += "&contentNum=" + (parent_params["contentNum"]);
  actibookone_App_url += "&contentUrl=" + parent_params["shareBaseUrl"];

  parent_params["callAppUrl"] = actibookone_App_url;

  var configJson = parent_params['configInfoJson']["configJson"];
  if (typeof configJson === "string") {
    parent_params['configJson'] = JSON.parse(configJson);
  } else {
    parent_params['configJson'] = configJson;
  }

  return parent_params;
}

var parent_params = getParams();

var infoStr =
  {
    cover: parent_params["configJson"]['cover'],
    direction: parent_params["configJson"]['direction'],
    speadMode: parent_params["configJson"]['spead_mode'],
    linkColor: parent_params["configJson"]['link_color'],
    link_alpha: parent_params["configJson"]['link_alpha'],
    linkTwinkle: parent_params["configJson"]['link_twinkle'],
    baseUrl: parent_params['shareBaseUrl'],
    urlSignature: "",
    readProgress: parent_params['readProgress'],
    contentTitle: parent_params["configInfoJson"]['contentTitle'],
    readType: "2",
    readFrom: "0",
    contentDetailUrl: parent_params['shareBaseUrl'],
    customizeDate: "",
    totalPageTime: parent_params["configInfoJson"]['totalPageTime'],
    contentNum: parent_params['contentNum'],
    callAppUrl: parent_params['callAppUrl'],
    embedFlg: parent_params['embedFlg'],
    imgType: parent_params['imgType'] || 'png',
    userNum: "0",
    keyword: "",
    shareBaseUrl: parent_params['shareBaseUrl'],
    printableFlg: parent_params["configInfoJson"]['printableFlg'],
    apiUrl: parent_params["configInfoJson"]['apiUrl'],
    shareableFlg: parent_params['shareableFlg'],
    contentInfoDispFlg: parent_params['contentInfoDispFlg'],
    appButtonDispFlg: parent_params['appButtonDispFlg'],
    dispLanguage: parent_params['dispLanguage'],
    envType: parent_params["configInfoJson"]['envType'],
    clientNum: parent_params["configInfoJson"]['clientNum'],
    compatibleFlg: parent_params["configInfoJson"]['compatibleFlg'],
  };

//1. viewer初始化时，返回content的基本信息
function initViewer() {
  //将包含content基本信息的json返回给viewer
  return infoStr;
}

function openApp() {
  var params = getParams();

  var shareBaseUrl = window.location.href.split("?")[0];

  if (shareBaseUrl.indexOf("pdfViewer/#/pc") > 0) {
    shareBaseUrl = shareBaseUrl.replace("pdfViewer/#/pc", "");
  } else if (shareBaseUrl.indexOf("pdfViewer/#/sd") > 0) {
    shareBaseUrl = shareBaseUrl.replace("pdfViewer/#/sd", "");
  } else if (shareBaseUrl.indexOf("pdfViewer/") > 0) {
    shareBaseUrl = shareBaseUrl.replace("pdfViewer/", "");
  } else if (shareBaseUrl.indexOf("pc_index.html") > 0) {
    shareBaseUrl = shareBaseUrl.replace("pc_index.html", "");
  } else if (shareBaseUrl.indexOf("sd_index.html") > 0) {
    shareBaseUrl = shareBaseUrl.replace("sd_index.html", "");
  } else if (shareBaseUrl.indexOf("embed_index.html") > 0) {
    shareBaseUrl = shareBaseUrl.replace("embed_index.html", "");
  } else {

  }
  var openUrl = shareBaseUrl + 'call_app.html?callAppUrl=' + encodeURIComponent(BASE64.encoder(params["callAppUrl"]));
  window.open(openUrl);
}
