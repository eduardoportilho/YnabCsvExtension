var mcp_t;
var mcp_interval;
var mcp_refreshURLs = new Array();
var disableTimeout = "false";
var session_t;

function mcpAddRefreshURL(url) {
  mcp_refreshURLs.push(url);
}
function mcpInitTW(mcp_time) {
  mcpHideTW();
  mcp_interval = mcp_time;
  if (disableTimeout == "false") {
    // if timer is already set, it should be cleared
    if (mcp_t) {
      clearTimeout(mcp_t);
    }
    mcp_t = setTimeout("mcpShowTW()", mcp_time);
  }
}
function mcpShowTW() {
  window.location = '#top';
  mcpSetDisplay('mcp_tw_overlay', 'block');
  mcpSetDisplay('mcp_tw_content', 'block');

  document.getElementById('logged_out_content').className = 'nodisplay';
  document.getElementById("mcp_tw_content").focus();
}
function mcpHideTW() {
  mcpSetDisplay('mcp_tw_overlay', 'none');
  mcpSetDisplayHeight('mcp_tw_overlay');
  mcpSetDisplay('mcp_tw_overlay_white', 'none');
  mcpSetDisplayHeight('mcp_tw_overlay_white');
  mcpSetDisplay('mcp_tw_content', 'none');
  mcpSetTWContentPosition('mcp_tw_content');
}
function mcpHideLayer() {
  clearTimeout(mcp_t);
  clearTimeout(session_t);
  // MCP refesh
  mcpHttpGETRequest(mcp_tw_cmd, mcpUpdateOthers, true);
}

function getFrontPageAjaxAccountBox1() {
  mcpHttpGETRequest(mcp_account_cmd, mcpUpdateFrontPageAccount, true);
}
function mcpUpdateFrontPageAccount1(xmlhttp) {
  if (xmlhttp.readyState == 4) {
    if (xmlhttp.status == 200) {
      var textout = xmlhttp.responseText;
      if (textout.length > 1) {
        document.getElementById(mcp_account_view).innerHTML = textout;
      }
    }
  }
}

function getFrontPageAjaxAttentionBox1() {
  mcpHttpGETRequest(mcp_attention_cmd, mcpUpdateFrontPageAttention, true);
}
function mcpUpdateFrontPageAttention1(xmlhttp) {
  if (xmlhttp.readyState == 4) {
    if (xmlhttp.status == 200) {
      var textout = xmlhttp.responseText;
      if (textout.length > 1) {
        document.getElementById(mcp_attention_view).innerHTML = textout;
      }
    }
  }
}

function getFrontPageAjaxCurrencyBox1() {
  mcpHttpGETRequest(mcp_currency_cmd, mcpUpdateFrontPageCurrency, true);
}
function mcpUpdateFrontPageCurrency1(xmlhttp) {
  if (xmlhttp.readyState == 4) {
    if (xmlhttp.status == 200) {
      var textout = xmlhttp.responseText;
      if (textout.length > 1) {
        document.getElementById(mcp_currency_view).innerHTML = textout;
      }
    }
  }
}

function showLoggedOut() {
  window.location = '#top';

  mcpSetDisplay('mcp_tw_overlay', 'none');
  mcpSetDisplayHeight('mcp_tw_overlay');

  mcpSetDisplay('mcp_tw_overlay_white', 'block');
  mcpSetDisplay('mcp_tw_content', 'block');

  document.getElementById('timeout_content').className = 'nodisplay';
  document.getElementById('logged_out_content').className = '';
  document.getElementById("mcp_tw_content").focus();
}

function mcpUpdateOthers(xmlhttp) {
  if (xmlhttp.responseText.length < 1) {
    mcpHideTW();
  }
  if ('MCP_TW_SUCCESS'.match(xmlhttp.responseText)) {
    mcpInitTW(mcp_interval);
    for ( var i = 0; i < mcp_refreshURLs.length; i++) {
      mcpHttpGETRequest(mcp_refreshURLs[i], mcpTWFinaliser, true);
    }
  }

  else if (xmlhttp.responseText.match('timeout.caption.logged_out')) {
    showLoggedOut();
  } else {
    mcpHideTW();
  }
}

function mcpTWFinaliser(xmlhttp) {
  return;
}
function mcpSetDisplay(element, value) {
  if (document.getElementById(element) != null) {
    document.getElementById(element).style.display = value;
  }
}
function mcpSetDisplayHeight(element) {
  if (document.getElementById(element) != null) {
    var arrayPageSize = getPageSize();
    document.getElementById(element).style.height = (arrayPageSize[1] + 'px');
    document.getElementById(element).style.width = '100%';
  }
}
function mcpSetTWContentPosition(element) {
  if (document.getElementById(element) != null) {
    var arrayPageSize = getPageSize();
    document.getElementById(element).style.left = (((arrayPageSize[0] / 2) - 270) + 'px');
  }
}
function getPageSize() {
  var xScroll, yScroll;
  if (window.innerHeight && window.scrollMaxY) {
    xScroll = document.body.scrollWidth;
    yScroll = window.innerHeight + window.scrollMaxY;
  } else if (document.body.scrollHeight > document.body.offsetHeight) { // all
    // but
    // Explorer
    // Mac
    xScroll = document.body.scrollWidth;
    yScroll = document.body.scrollHeight;
  } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla
    // and Safari
    xScroll = document.body.offsetWidth;
    yScroll = document.body.offsetHeight;
  }
  var windowWidth, windowHeight;
  if (self.innerHeight) { // all except Explorer
    windowWidth = self.innerWidth;
    windowHeight = self.innerHeight;
  } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer
    // 6
    // Strict
    // Mode
    windowWidth = document.documentElement.clientWidth;
    windowHeight = document.documentElement.clientHeight;
  } else if (document.body) { // other Explorers
    windowWidth = document.body.clientWidth;
    windowHeight = document.body.clientHeight;
  }
  // for small pages with total height less then height of the viewport
  if (yScroll < windowHeight) {
    pageHeight = windowHeight;
  } else {
    pageHeight = yScroll;
  }
  // for small pages with total width less then width of the viewport
  if (xScroll < windowWidth) {
    pageWidth = windowWidth;
  } else {
    pageWidth = xScroll;
  }
  arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight)
  return arrayPageSize;
}
function mcpGetST(cn) {
  var name = cn + "=";
  var ca = document.cookie.split(';');
  for ( var i = 0; i < ca.length; i++) {
    var c = ca[i];
    if (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
function mcpGetXmlHttpObjects() {
  return [ function() {
    return new XMLHttpRequest()
  }, function() {
    return new ActiveXObject("Msxml2.XMLHTTP")
  }, function() {
    return new ActiveXObject("Msxml3.XMLHTTP")
  }, function() {
    return new ActiveXObject("Microsoft.XMLHTTP")
  } ];
}
function mcpCreateXmlHttp() {
  var xmlhttp = false;
  var xmlHttpObjects = mcpGetXmlHttpObjects();
  for ( var i = 0; i < xmlHttpObjects.length; i++) {
    try {
      xmlhttp = xmlHttpObjects[i]();
    } catch (e) {
      continue;
    }
    break;
  }
  return xmlhttp;
}
function mcpHttpGETRequest(rqst, setFunction, async) {
  var xmlhttp = mcpCreateXmlHttp();
  xmlhttp.open("GET", rqst, async);

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      setFunction(xmlhttp);
    }
  }
  xmlhttp.send("");
}
function initTimeOut(sessionTimeout) {
  if (disableTimeout == "false") {
    if (session_t) {
      clearTimeout(session_t);
    }
    session_t = setTimeout("document.getElementById('timeoutWarningForm').submit();", sessionTimeout);
  }
}