
function getParams(){
  var parent_params = window.parent.getParams();

  var pageno = parent_params["readProgress"] || 0;

  var actibookone_App_url = "poste:///";
  actibookone_App_url += "readType=" + (parent_params["readType"] || "0");
  actibookone_App_url += "&readFrom=" + (parent_params["readFrom"]);
  actibookone_App_url += "&pageNo=" + (pageno);
  actibookone_App_url += "&contentNum=" + (parent_params["contentNum"]);
  actibookone_App_url += "&contentUrl=" + parent_params["shareBaseUrl"];

  parent_params["callAppUrl"] = actibookone_App_url;
  return parent_params;
}

$(document).ready(function(){

  try {
    $.ajax({
      type: 'GET',
      url: "jsons/configinfo.json",
      async:false,
      dataType: "json",
      success: function (result) {
        configInfoJson = result;
        /*if(configInfoJson.printableFlg === 1) {
          $('.printDisplay').css('display','inline-block');
        } else {
           $('.printDisplay').css('display','none');
        }*/

        // 背景ウォーターマーク
        if(configInfoJson.freeuseFlg == '1') {
          $('.book-detail-block__action__reacts__branding_box').css('display','flex');
        } else {
          $('.book-detail-block__action__reacts__branding_box').css("display","none");
        }
      },
      error: function (msg) {

      }
    });
  }catch(err){

  }
});


// アドレスバーの長さと情報バーの表示・非表示に応じて、異なる縦横画面補正係数を設定
let _params = getParams();
let contentInfoDispFlg = _params["contentInfoDispFlg"];
let bottomHeight = contentInfoDispFlg == 0 ? 0 : 30; // 下部の余白高さ
let actionHeight = $(".book-detail-block__action").children().length > 0 ? 40 : 0; // 共有バーの高さ
let adjustNum = bottomHeight + actionHeight;

// 右クリックイベントを無効化
$(document).on("contextmenu",function(){
  return false;
})


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
  $(window).on('resize', function(){
    var _angle = (screen && screen.orientation && screen.orientation.angle) || window.orientation || 0,
      _cond = (
        (_angle % 180 == 0 && ($('input:focus, textarea:focus').length
          || $("#actibookoneFrame").contents().find('input:focus, textarea:focus').length))

        || $('body').is('.sd-norotateerror')
        || (window.parent.innerHeight > window.parent.innerWidth));
    // $('body').toggleClass('showing-rotate_alert', !_cond);
    $('#rotate_alert').velocity('stop').velocity(_cond ? 'fadeOut' : 'fadeIn', { duration: _cond ? 1000 : 0,
      complete: function(elements){
        // $('#rotate_alert').css('display', _cond ? 'none' : 'block');
      }});
    if(!_cond){
      $('#rotate_alert').css({
        width: window.parent.getScreenSize_width(),
        height: window.parent.getScreenSize()
      });
      gotoTop_poste();
    }
  });
  $(window).on('load', function(){
    // $('body').toggleClass('showing-rotate_alert',!$('body').is('.sd-norotateerror'));
    $(window).trigger('resize');
  });
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
  // SD のホーム用ビジュアルのサイズ調整（ロード時のみ）
  if($('.header-homevisual--sd').length){
    var bis = $('.header-homevisual--sd');
    var attrs = ['cropwidth','cropheight','cropleft','croptop','imgwidth','imgheight'],
      attrsPassed = true;
    attrs.some(function(val){
      if(parseInt(bis.attr('data-'+val)) === NaN){
        attrsPassed = false;
        return true;
      }
    });
    if(attrsPassed){
      var crop = {
          width: parseInt(bis.attr('data-cropwidth')),
          height: parseInt(bis.attr('data-cropheight')),
          left: parseInt(bis.attr('data-cropleft')),
          top: parseInt(bis.attr('data-croptop'))
        },
        img = {
          width: parseInt(bis.attr('data-imgwidth')),
          height: parseInt(bis.attr('data-imgheight'))
        };
      var processCrop = function(){
        var bgWidth = $(window).prop('innerWidth');
        if(img.width !== crop.width){
          var cropRatio = bgWidth / crop.width;
          var result = {'background-size':''+Math.round(Math.multiply(cropRatio,img.width))+'px '+Math.round(Math.multiply(cropRatio,img.height))+'px','background-position':'-'+Math.round(Math.multiply(cropRatio,crop.left))+'px -'+Math.round(Math.multiply(cropRatio,crop.top))+'px'};
          bis.css(result);
        }
        bis.addClass('processed');
      };
      // 画面リサイズ時の処理
      $(window).on('resize.bgCrop', $.debounce(200,function(){
        bis.removeClass('processed');
        processCrop();
      })).trigger('resize.bgCrop');
    }
  }
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
  if($('.book-detail-htmlblock__content').find('iframe').length){
    var screenSize_width = window.parent.getScreenSize_width() - 30;
    $(window).on('resize',$.debounce(200, function(){
      var _parent = $('.book-detail-htmlblock__content'),
        _iframe = _parent.find('iframe'),
        _iframeWidth = (_iframe.attr('width')) ? parseInt(_iframe.attr('width')) : 0,
        _outerwrap = _iframe.closest('div');
      if(_iframeWidth > screenSize_width){
        if(!_outerwrap.is('.book-detail-htmlblock__content__googlemaps')){
          $(_iframe).wrap($('<div class="book-detail-htmlblock__content__googlemaps"></div>'));
        }
        if(_iframeWidth && _iframe.attr('height')){
          var _ratio = parseInt(_iframe.attr('height')) / _iframeWidth * 100;
          $('style#iframeratio').remove();
          $.additionalStyle.insertRule(['.book-detail-htmlblock__content__googlemaps:before'],'padding-top:'+_ratio+'% !important;', 'iframeratio');
        }
      } else {
        if(_outerwrap.is('.book-detail-htmlblock__content__googlemaps')){
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

var viewer_init_height = 0;
var screenSize_height = window.parent.getScreenSize();

$(".book-detail-block__viewer-dummy").animate({"height": screenSize_height - adjustNum}, 0);

function resizeParentSize(zoomType){

  if(!viewer_init_height){
    viewer_init_height = $(".book-detail-block__viewer-dummy").height();
  }
  if (zoomType == "in") { //拡大
    $(".book-detail-block__viewer-dummy").animate({"height": screenSize_height}, 500);
  } else { //通常
    $(".book-detail-block__viewer-dummy").animate({"height": viewer_init_height}, 500);
  }
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

function gotoTop_poste(){
  if (window.parent.gotoTop_poste) {
    window.parent.gotoTop_poste();
  }

  $('body,html').animate({ scrollTop: 0 }, 1000);
}

function showShareContent(){
  var subWindow = $("#actibookoneFrame")[0] && $("#actibookoneFrame")[0].contentWindow;
  if(subWindow && subWindow.showShareContent) {
    subWindow.showShareContent();
  }
}

$(function(){
  var _params = getParams();
  if(_params["contentInfoDispFlg"] == 0){
    $(".book-detail-block__texts").remove();
    $(".environment-block").remove();
    $(".book-detail-block__viewer-dummy").css("height", screenSize_height - actionHeight + "px");
  }

  var parent_width = Math.min(window.parent.getScreenSize_width(), window.parent.getScreenSize());

  $(".book-detail-block__texts__book-title").width(parent_width - 35);

  if(_params["shareableFlg"] == 0){

    $(".book-detail-block__action__reacts__share").remove();
  }

  if(_params["appButtonDispFlg"] == 0){
    $(".book-detail-block__action__app-button").remove();
    $(".rotate_alert__message__right").remove();
  }

  if($(".book-detail-block__action__app-button").length == 0
    && $(".book-detail-block__action__reacts__share").length == 0){
    $(".book-detail-block__action").remove();
  }

});


var iframe_zoomType = "";
var viewer_init_height = window.parent.getScreenSize() - adjustNum;
var screenSize_height = window.parent.getScreenSize();
var maxHeight = Math.max(window.parent.getScreenSize(), window.parent.getScreenSize_width());
var minHeight = Math.min(window.parent.getScreenSize(), window.parent.getScreenSize_width());
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


// イベントリスナーを追加してボタンクリックを処理
$(document).on('click', 'a[data-action]', function(e) {
  e.preventDefault();
  var action = $(this).data('action');
  
  switch(action) {
    case 'share':
      showShareContent();
      break;
    case 'openApp':
      openApp();
      break;
  }
});