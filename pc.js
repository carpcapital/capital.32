function getParams(){
  var parent_params = window.parent.getParams();

  var pageno = parent_params["readProgress"] || 0;

  var actibookone_App_url = "poste://?";
  actibookone_App_url += "readType=" + (parent_params["readType"] || "0");
  actibookone_App_url += "&readFrom=" + (parent_params["readFrom"]);
  actibookone_App_url += "&pageNo=" + (pageno);
  actibookone_App_url += "&contentNum=" + (parent_params["contentNum"]);
  actibookone_App_url += "&contentUrl=" + parent_params["shareBaseUrl"];

  parent_params["callAppUrl"] = actibookone_App_url;

  return parent_params;
}

// 右クリックイベントを無効化
$(document).on("contextmenu",function(){
  return false;
})


// 情報バーの表示・非表示に応じて、異なる補正係数を設定
let _params = getParams();
let contentInfoDispFlg = _params["contentInfoDispFlg"];
let bottomHeight = contentInfoDispFlg == 0 ? 0 : 30; // タブレット下部の余白高さ
let actionHeight = $(".book-detail-block__action").children().length > 0 ? 40 : 0; // タブレット共有バーの高さ
let adjustNum = bottomHeight + actionHeight;




var iframe_zoomType = "";

var viewer_init_height = window.parent.getScreenSize() - adjustNum;
var screenSize_height = window.parent.getScreenSize();

var maxHeight = Math.max(window.parent.getScreenSize(), window.parent.getScreenSize_width());
var minHeight = Math.min(window.parent.getScreenSize(), window.parent.getScreenSize_width());

let macDevice = (navigator.userAgent.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) ? true : false;

try {
  $.ajax({
    type: 'GET',
    url: "jsons/configinfo.json",
    async:false,
    dataType: "json",
    success: function (result) {
      var configInfoJson = result;
      if(configInfoJson.printableFlg === 1) {
        $('.printDisplay').css('display','inline-block');
      } else {
        $('.printDisplay').css('display','none');
      }


      // 背景ウォーターマーク
      if(configInfoJson.freeuseFlg == '1') {
        $('.book-detail-block__action__reacts__branding__entity-pc').css('display','inline-block');
        $('.book-detail-block__action__reacts__branding_box-pad').css('display','flex');


        if (macDevice) {
          // pad
          $('.book-detail-block__action__reacts__branding_box-pad').css("display","flex");

        } else {
          // pc
          $('.book-detail-block__action__reacts__branding_box-pad').css("display","none");
        }
      } else {
        $('.book-detail-block__action__reacts__branding__entity-pc').css("display","none");
        $('.book-detail-block__action__reacts__branding_box-pad').css("display","none");
      }
    },
    error: function (msg) {

    }
  });
}catch(err){

}


if((device.desktop() || device.windowsTablet()) && !macDevice){
  window["resizeParentSize"] = function(zoomType){
    iframe_zoomType = zoomType;
    if (zoomType == "in") { //拡大
      var bar_height = 43;
      if($(".book-detail-block__action").length == 0){
        bar_height = 0;
      }
      var screenSize_height = window.parent.getScreenSize() - bar_height;
      if(screenSize_height < 683){
        $(".book-viewer-dummy").animate({"height": "683px"}, 500);
      }else{
        $(".book-viewer-dummy").animate({"height": screenSize_height}, 500);
      }
    } else { //通常
      $(".book-viewer-dummy").animate({"height": "683px"}, 500);
    }
    gotoTop_poste();
  }

  $(window).on("resize", function(){
    if(iframe_zoomType == "in"){
      resizeParentSize(iframe_zoomType);
    }

    viewer_init_height = window.parent.getScreenSize() - adjustNum;
    screenSize_height = window.parent.getScreenSize();
  });
}else {
  window["resizeParentSize"] = function(zoomType){
    iframe_zoomType = zoomType;
    if (zoomType == "in") { //拡大
      $(".book-detail-block__viewer-dummy").animate({"height": screenSize_height - actionHeight}, 500);
    } else { //通常
      $(".book-detail-block__viewer-dummy").animate({"height": viewer_init_height}, 500);
    }
    gotoTop_poste();
  }

  // 端末の向き変更時
  var isTilted = false; // Android の特殊端末対策
  if (navigator.userAgent.indexOf('Android') > 0) {
    var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
    if (orientation.type === "portrait-secondary" || orientation.type === "landscape-primary") {
      isTilted = true;
    }
  }

  var window_width = $(window).width();
  var window_height = $(window).height();
  setInterval(function(){
    if(window_width != $(window).width() || window_height != $(window).height()){

      window_width = $(window).width();
      window_height = $(window).height();

      clearTimeout(window["windowResize_page"]);

      window["windowResize_page"] = setTimeout(function(){
        maxHeight = Math.max(window.parent.getScreenSize(), window.parent.getScreenSize_width());
        minHeight = Math.min(window.parent.getScreenSize(), window.parent.getScreenSize_width());

        $(window).trigger( 'orientationchange' );
      }, 100);
    }
  }, 100);

  $(window).on( 'orientationchange', function(e){
    var orientation = window.orientation;
    $('meta[name="viewport"]').remove();
    if(isTilted){
      if (orientation === 0) {  // 横
        screenSize_height = minHeight;
        viewer_init_height = screenSize_height - adjustNum;
      } else {  // 縦
        screenSize_height = maxHeight;
        viewer_init_height = screenSize_height - adjustNum;
      }
    } else {
      if (orientation === 0) {  // 縦
        screenSize_height = maxHeight;
        viewer_init_height = screenSize_height - adjustNum;
      } else {  // 横
        screenSize_height = minHeight;
        viewer_init_height = screenSize_height - adjustNum;
      }
    }

    resizeParentSize(iframe_zoomType);
  });
}

$(document).ready(function(){
  if(device.desktop() || device.windowsTablet()){
    let macDevice = (navigator.userAgent.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) ? true : false;
    if(!macDevice){
      $("body").addClass("book-detail--pc");
      $("body").prepend('<div class="book-viewer">' +
        '<div class="book-viewer-dummy">' +
        '<iframe id="actibookoneFrame" src="pdfViewer/actibook.html" frameborder="0" width="100%" height="100%" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div></div>');
    }else{
      $("body").addClass("book-detail--sd book-detail--tablet");

      $("body").prepend('<div class="book-detail-block">' +
        '<div class="book-detail-block__viewer-dummy book-detail-block__viewer-dummy--tablet">' +
        '<iframe id="actibookoneFrame" src="pdfViewer/actibook.html" frameborder="0" width="100%" height="100%" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div></div>');

      $(".book-detail--sd .book-detail-block__viewer-dummy").height(viewer_init_height);

    }
  }else {
    $("body").addClass("book-detail--sd book-detail--tablet");

    $("body").prepend('<div class="book-detail-block">' +
      '<div class="book-detail-block__viewer-dummy book-detail-block__viewer-dummy--tablet">' +
      '<iframe id="actibookoneFrame" src="pdfViewer/actibook.html" frameborder="0" width="100%" height="100%" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div></div>');

    $(".book-detail--sd .book-detail-block__viewer-dummy").height(viewer_init_height);
  }

  $(".book-detail-block__action__extend__normal, .book-detail-block__action__extend__larger")
    .on("click", function(){

      $(".action__extend_active").removeClass("action__extend_active");
      $(this).addClass("action__extend_active");

      if($(this).hasClass("book-detail-block__action__extend__normal")){
        resizeParentSize("out");
      }else if($(this).hasClass("book-detail-block__action__extend__larger")){
        resizeParentSize("in");
      }
    });

  // イベントリスナーを追加してボタンクリックを処理
  $(document).on('click', 'a[data-action]', function(e) {
    e.preventDefault();
    var action = $(this).data('action');
    
    switch(action) {
      case 'share':
        showShareContent();
        break;
      case 'print':
        showPrintDialogContent();
        break;
      case 'openApp':
        openApp();
        break;
      case 'normal':
        $(".action__extend_active").removeClass("action__extend_active");
        $(this).addClass("action__extend_active");
        resizeParentSize("out");
        break;
      case 'larger':
        $(".action__extend_active").removeClass("action__extend_active");
        $(this).addClass("action__extend_active");
        resizeParentSize("in");
        break;
      case 'fullscreen':
        triggerFullScreenFun();
        break;
    }
  });
});



$(document).ready(function(){
  // ヘッダナビゲーションのボタン内のアイコンクリック時
  $('#nav-pc-tags').find('i').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    if($('#category_dropdown').is(':visible')){
      $('#nav-pc-tags').dropdown('close');
    } else {
      $('#nav-pc-tags').dropdown('open');
    }
  });
  // ヘッダナビゲーションのフォーカス時
  $('.item-searchinput').on('focus click', function(e){
    e.stopPropagation();
    $('.item-searchinput__wrap').addClass('focused');
  });
  $(document).on('click',function(e){
    if(!$(this).parents('.item-searchinput__wrap').length && !$('#search-input').val()){
      $('.item-searchinput__wrap').removeClass('focused');
    }
  });

  // 検索のドロップダウン起動
  if($('#item-dropdown').length){
    $('#item-dropdown').dropdown({
      belowOrigin: true
    });
    $('#nav-category-dropdown').find('a').on('click', function(e){
      var _this = $(this);
      $('#item-dropdown').text(_this.text()).dropdown('close');
    });
  }
  // ヘッダナビゲーションの検索アイコンクリック時
  $('#searchicon').on('click', function(e){
    e.stopPropagation();
    if($('#search-input').val() == ''){
      $('#search-input').trigger('focus');
    } else {
      // 検索ボックスが空ではない場合は、検索アイコンクリックで検索実行
    }
  });
  // ヘッダナビゲーションのタグ
  $('#nav-pc-tags').dropdown({belowOrigin: true, alignment: 'right', stopPropagation:true});
  var _getDropDownHeight = function(){
    return $('#tags_dropdown').prop('offsetHeight');
  };
  var _slimScrollInitializeTimer;
  $('#nav-pc-tags').on('open',function(e){
    var _this = $(this),
      _parent = $('#tags_dropdown'),
      _content = _parent.find('.tags_dropdown__content__inner');
    if(_parent.find('.slimScrollDiv').length){
      _content.off('initialized').slimScroll({destroy: true});
      _content.removeAttr('style');
    }
    clearTimeout(_slimScrollInitializeTimer);
    _slimScrollInitializeTimer = setTimeout(function(){
      if(_this.is('.active')){
        _content.on('initialized', function(){
          setTimeout(function(){
            _content.trigger('mouseleave').trigger('mouseenter');
          },100);
        });
        _content.slimScroll({
          axis: 'y',
          railVisible: true,
          height: _getDropDownHeight()
        });
      }
    },410);
  });
  $(window).on('resize', $.debounce(200, function(){
    if($('#nav-pc-tags').is('.active')){
      $('#nav-pc-tags').dropdown('close');
    }
  }));
  // セレクトボックスの起動
  if($('select').length){
    $('select').material_select();
    // セレクトボックス内の caret クリックでセレクトボックスを開く
    // ※なぜかオリジナルではできない。
    $(document).on('click','.select-wrapper .caret',function(e){
      var _this = $(this);
      _this.next('input.select-dropdown').trigger('click');
      _this.closest('.select-wrapper').find('.dropdown-content').find('li').on('click.close',function(){
        var __this = $(this);
        __this.closest('.select-wrapper').find('input.select-dropdown').trigger('close');
        __this.closest('.dropdown-content').find('li').off('click.close');
      });
    });
  }
});


$(document).ready(function(){
  // 固定値
  // コンテンツエリアの幅
  var _contentWidth = 1168;
  // トップに戻るチップの幅
  var _gototopWidth = 54;
  // トップに戻るチップの下端
  var _gototopMarginBottom = 28;
  // コンテンツエリア左端からのチップ位置
  var _gototopLeft = 69;
  // チップ表示位置を考慮した最低ウィンドウサイズ
  var _minWindowWidth = (_gototopWidth + _gototopLeft) * 2 + _contentWidth;
  // SD の場合の右端の位置
  var _gototopSDMarginRight = 14;
  // トップに戻る所要時間
  var _gototopRequiredTime = 700;

  // 表示非表示の切り替えポイント
  var _gototopShowingHeight = window.matchMedia(_sdMedia).matches ?
    $('body').is('.home') ? 170 : 80 :
    $('body').is('.home') ? 300 : 160;

  // 「トップに戻る」の位置調整
  var _adjustBottomPos = function(){
    var _scrollArea = $(_isHtmlScrollable ? 'html' : 'body'),
      _windowHeight = $(window).prop('innerHeight'),
      _scrollHeight = _scrollArea.prop('scrollHeight'),
      _scrollPos = _scrollArea.prop('scrollTop'),
      _footerHeight = $('footer').prop('offsetHeight');
    var _bottomPos = (_scrollPos + _windowHeight <= _scrollHeight - _footerHeight) ? _gototopMarginBottom : _gototopMarginBottom + (_scrollPos + _windowHeight - (_scrollHeight - _footerHeight));
    return _bottomPos;
  };
  var _adjustRightPos = function(){
    if(!window.matchMedia(_sdMedia).matches){
      var _rightPos = ($(window).prop('innerWidth') > _minWindowWidth) ? ($(window).prop('innerWidth') - _contentWidth) / 2 - (_gototopLeft + _gototopWidth) : 10;
      return _rightPos;
    } else {
      return _gototopSDMarginRight;
    }
  };
  var _adjustGoToTopPos = function(){
    $('#gototop').css({'right':_adjustRightPos()+'px'/*,'bottom':_adjustBottomPos()+'px'*/});
  };
  // ウィンドウのリサイズ時に位置調整
  $(window).on('resize', $.debounce(200,function(){
    _adjustGoToTopPos();
  })).trigger('resize');
  // スクロール時の処理
  var _initAdjusted = false;
  $(window).on('scroll', function(){
    var _this = $(this);
    if(!_initAdjusted){
      _initAdjusted = true;
      $('#gototop').css('right',_adjustRightPos()+'px');
    }
    if(_this.scrollTop() > _gototopShowingHeight){
      if(!$('#gototop').is('.fadein')){
        $('#gototop').addClass('fadein');
      }
    } else {
      if($('#gototop').is('.fadein') && !$('#gototop').is('.fadeout')){
        $('#gototop').on('animationend.gototop webkitAnimationEnd.gototop oAnimationEnd.gototop mozAnimationEnd.gototop', function(){
          $('#gototop').off('.gototop').removeClass('fadein').removeClass('fadeout');
        });
        $('#gototop').addClass('fadeout');
      }
    }
  }).trigger('scroll');
  // トップに移動する
  $('#gototop').find('a').on('click', function(e){
    e.preventDefault();
    if($('#gototop').is('.fadein')){
      $('body').velocity('scroll', { duration: _gototopRequiredTime, easing: 'ease' });
    }
  });
});


$(document).ready(function(){
  // 動作環境の開閉
  $('.environment-block__title').on('click', function(){
    var _this = $(this),
      _arrow = _this.find('.environment-block__openclose'),
      _cond = !_arrow.is('.environment-block__openclose--closed');
    $('#environment_body')[_cond ? 'slideUp' : 'slideDown']();
    _arrow.toggleClass('environment-block__openclose--closed', _cond);
  });
  // Google Maps 対策
  if($('.detail-texts__htmlblock__body').find('iframe').length){
    $(window).on('resize',$.debounce(200, function(){
      var _parent = $('.detail-texts__htmlblock__body'),
        _iframe = _parent.find('iframe'),
        _iframeWidth = (_iframe.attr('width')) ? parseInt(_iframe.attr('width')) : 0,
        _outerwrap = _iframe.closest('div');
      if(_iframeWidth > _parent.prop('offsetWidth')){
        if(!_outerwrap.is('.detail-texts__htmlblock__body__googlemaps')){
          $(_iframe).wrap($('<div class="detail-htmlblock__body__googlemaps"></div>'));
        }
        if(_iframeWidth && _iframe.attr('height')){
          var _ratio = parseInt(_iframe.attr('height')) / _iframeWidth * 100;
          $('style#iframeratio').remove();
          $.additionalStyle.insertRule(['.detail-texts__htmlblock__body__googlemaps:before'],'padding-top:'+_ratio+'% !important;', 'iframeratio');
        }
      } else {
        if(_outerwrap.is('.detail-texts__htmlblock__body__googlemaps')){
          $(_iframe).unwrap();
        }
      }
    })).trigger('resize');
  }
});

$(document).ready(function(){
  $('.lower').each(function(){
    $(this).closest('.material-tooltip').addClass('material-tooltip--lower');
  });
});

$(document).ready(function(){
  $('.fullscreen-loader').on('animationend webkitAnimationEnd oAnimationEnd mozAnimationEnd',function(){
    if($('body').is('.hide-fullscreen-loader')){
      $('body').removeClass('show-fullscreen-loader hide-fullscreen-loader');
    }
  });
});

function gotoTop_poste(){
  if (window.parent.gotoTop_poste) {
    window.parent.gotoTop_poste();
  }

  $('body,html').scrollTop(0);
}

function openApp(){
  var params = getParams();

  var shareBaseUrl = window.location.href.split("?")[0];

  if(shareBaseUrl.indexOf("pdfViewer/actibook.html#/pc") > 0){
    shareBaseUrl = shareBaseUrl.replace("pdfViewer/actibook.html#/pc", "");
  }else if(shareBaseUrl.indexOf("pdfViewer/actibook.html#/sd") > 0){
    shareBaseUrl = shareBaseUrl.replace("pdfViewer/actibook.html#/sd", "");
  }else if(shareBaseUrl.indexOf("pdfViewer/actibook.html") > 0){
    shareBaseUrl = shareBaseUrl.replace("pdfViewer/actibook.html", "");
  }else if(shareBaseUrl.indexOf("pc_index.html") > 0){
    shareBaseUrl = shareBaseUrl.replace("pc_index.html", "");
  }else if(shareBaseUrl.indexOf("sd_index.html") > 0){
    shareBaseUrl = shareBaseUrl.replace("sd_index.html", "");
  }else{

  }
  var openUrl = shareBaseUrl + 'call_app.html?callAppUrl=' + encodeURIComponent(BASE64.encoder(params["callAppUrl"]));
  window.open(openUrl);
}

function showShareContent(){
  var subWindow = $("#actibookoneFrame")[0] && $("#actibookoneFrame")[0].contentWindow;
  if(subWindow && subWindow.showShareContent) {
    subWindow.showShareContent();
  }
}

function showPrintDialogContent(){
  var subWindow = $("#actibookoneFrame")[0] && $("#actibookoneFrame")[0].contentWindow;
  if(subWindow && subWindow.showPrintDialogContent) {
    subWindow.showPrintDialogContent();
  }
}

// PDFダウンロード
(function(){
  let pdfLink = "";
  let totalparams = getParams();
  pdfLink = totalparams['shareBaseUrl'].replace(/index.html$/, "") + "original.pdf";
  const newFileName = (totalparams['configInfoJson']['contentTitle'] || '') + ".pdf"
  $(".book-detail-block__action__reacts__pdf").click(function(){
    const link= document.createElement('a')
    link.href = pdfLink
    link.download = newFileName
    link.id = "pc_download_pdf__button"
    $("body").append(link)
    link.click()
    $("#pc_download_pdf__button").remove();
  });
})()

// 1.resizeイベントをバインド
var window_width = $(window).width();
var window_height = $(window).height();
setInterval(function(){
  if(window_width != $(window).width() || window_height != $(window).height()){

    window_width = $(window).width();
    window_height = $(window).height();

    clearTimeout(window["windowResize_page"]);

    window["windowResize_page"] = setTimeout(function(){

      // 1.2.フルスクリーンかどうかを判定
      var isFullscreen = isFullscreenForNoScroll();

      if(isFullscreen){
        $("body").addClass("fullScreen_extend");
        fullscreen_type = "out";
      }else{
        $("body").removeClass("fullScreen_extend");
        fullscreen_type = "in";
      }

    }, 100);
  }
}, 100);

var isFullscreenForNoScroll = function(){
  var explorer = window.navigator.userAgent.toLowerCase();
  if(explorer.indexOf('chrome')>0 || explorer.indexOf('applewebkit')>0){//webkit
    if ($(".nav-afterlogin .book-viewer").height() === window.screen.height
      && $(".nav-afterlogin .book-viewer").width() === window.screen.width) {
      return true;
    } else {
      return false;
    }
  }else{//IE 9+  fireFox
    if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
      return true;
    } else {
      return false;
    }
  }
}

var isFirefox = function(){
  var explorer = window.navigator.userAgent.toLowerCase();
  if(explorer.indexOf('firefox') > 0){
    return true;
  }else{
    return false;
  }
};

var fullscreen_type = "in";
function triggerFullScreenFun(){

  if(fullscreen_type == "in"){
    var subWindow = $("#actibookoneFrame")[0] && $("#actibookoneFrame")[0].contentWindow;
    if(subWindow && subWindow.triggerFullScreenFun) {
      subWindow.triggerFullScreenFun(fullscreen_type);
    }
  }

  if(isFirefox()){
    if(fullscreen_type == "in"){
      fullscreen_type = "out";

      $("body").addClass("fullScreen_extend");

      var docElm = document.documentElement;
      //W3C
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
      //ChromeµÈ
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }else{

      }

    }else{

      fullscreen_type = "in";

      $("body").removeClass("fullScreen_extend");

      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }else{

      }

    }
  }else {
    if(fullscreen_type == "in"){
      fullscreen_type = "out";
    }else {
      fullscreen_type = "in";
    }
  }

}

$(function(){
  var _params = getParams();

  if(_params["shareBaseUrl"].indexOf("://127.0.0.1") > -1 ||
    _params["shareBaseUrl"].indexOf("://localhost") > -1){

    $(".book-detail-block__action__reacts__share").remove();
  }else if(_params["shareableFlg"] == 0){
    $(".book-detail-block__action__reacts__share").remove();
  }else {

  }

  if(_params["appButtonDispFlg"] == 0){
    $(".book-detail-block__action__app-button").remove();
  }else {

  }

  let macDevice = (navigator.userAgent.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) ? true : false;
  if((device.tablet() || macDevice) && $(".book-detail-block__action__app-button").length == 0
    && $(".book-detail-block__action__reacts__share").length == 0){
    $(".book-detail-block__action").remove();
  }

  if(_params["contentInfoDispFlg"] == 0){
    $("main").remove();
    $("html, body, .book-viewer-dummy, .book-detail-block > div").css("height", "100%");
    let bottomBar = (device.tablet() || macDevice) ? "40" : "43";
    if($(".book-detail-block__action").length > 0){
      let bookHeight = 'calc(100% - ' + bottomBar + 'px)';
      $(".book-viewer").css({
        "height": bookHeight
      })
      $(".book-detail-block").css({
        "height": bookHeight
      })
    }else {
      $(".book-viewer").css("height", "100%");
      $(".book-detail-block").css("height", "100%");
    }

    $(window).off( 'orientationchange');

    $(".book-detail-block__action__extend__larger, .book-detail-block__action__extend__normal").remove();
  }

  if(_params["pdfOutputFlg"] == 0){
    $(".book-detail-block__action__reacts__pdf").remove();
  }

});
