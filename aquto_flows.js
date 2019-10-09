var aquto =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/aquto.flows.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/browser-jsonp/lib/jsonp.js":
/*!*************************************************!*\
  !*** ./node_modules/browser-jsonp/lib/jsonp.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;(function() {\n  var JSONP, computedUrl, createElement, encode, noop, objectToURI, random, randomString;\n\n  createElement = function(tag) {\n    return window.document.createElement(tag);\n  };\n\n  encode = window.encodeURIComponent;\n\n  random = Math.random;\n\n  JSONP = function(options) {\n    var callback, callbackFunc, callbackName, done, head, params, script;\n    if (options == null) {\n      options = {};\n    }\n    params = {\n      data: options.data || {},\n      error: options.error || noop,\n      success: options.success || noop,\n      beforeSend: options.beforeSend || noop,\n      complete: options.complete || noop,\n      url: options.url || ''\n    };\n    params.computedUrl = computedUrl(params);\n    if (params.url.length === 0) {\n      throw new Error('MissingUrl');\n    }\n    done = false;\n    if (params.beforeSend({}, params) !== false) {\n      callbackName = options.callbackName || 'callback';\n      callbackFunc = options.callbackFunc || 'jsonp_' + randomString(15);\n      callback = params.data[callbackName] = callbackFunc;\n      window[callback] = function(data) {\n        window[callback] = null;\n        params.success(data, params);\n        return params.complete(data, params);\n      };\n      script = createElement('script');\n      script.src = computedUrl(params);\n      script.async = true;\n      script.onerror = function(evt) {\n        params.error({\n          url: script.src,\n          event: evt\n        });\n        return params.complete({\n          url: script.src,\n          event: evt\n        }, params);\n      };\n      script.onload = script.onreadystatechange = function() {\n        var ref, ref1;\n        if (done || ((ref = this.readyState) !== 'loaded' && ref !== 'complete')) {\n          return;\n        }\n        done = true;\n        if (script) {\n          script.onload = script.onreadystatechange = null;\n          if ((ref1 = script.parentNode) != null) {\n            ref1.removeChild(script);\n          }\n          return script = null;\n        }\n      };\n      head = window.document.getElementsByTagName('head')[0] || window.document.documentElement;\n      head.insertBefore(script, head.firstChild);\n    }\n    return {\n      abort: function() {\n        window[callback] = function() {\n          return window[callback] = null;\n        };\n        done = true;\n        if (script != null ? script.parentNode : void 0) {\n          script.onload = script.onreadystatechange = null;\n          script.parentNode.removeChild(script);\n          return script = null;\n        }\n      }\n    };\n  };\n\n  noop = function() {\n    return void 0;\n  };\n\n  computedUrl = function(params) {\n    var url;\n    url = params.url;\n    url += params.url.indexOf('?') < 0 ? '?' : '&';\n    url += objectToURI(params.data);\n    return url;\n  };\n\n  randomString = function(length) {\n    var str;\n    str = '';\n    while (str.length < length) {\n      str += random().toString(36).slice(2, 3);\n    }\n    return str;\n  };\n\n  objectToURI = function(obj) {\n    var data, key, value;\n    data = (function() {\n      var results;\n      results = [];\n      for (key in obj) {\n        value = obj[key];\n        results.push(encode(key) + '=' + encode(value));\n      }\n      return results;\n    })();\n    return data.join('&');\n  };\n\n  if ( true && __webpack_require__(/*! !webpack amd define */ \"./node_modules/webpack/buildin/amd-define.js\") !== null ? __webpack_require__(/*! !webpack amd options */ \"./node_modules/webpack/buildin/amd-options.js\") : void 0) {\n    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {\n      return JSONP;\n    }).call(exports, __webpack_require__, exports, module),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n  } else if ( true && module !== null ? module.exports : void 0) {\n    module.exports = JSONP;\n  } else {\n    this.JSONP = JSONP;\n  }\n\n}).call(this);\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack://aquto/./node_modules/browser-jsonp/lib/jsonp.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/amd-define.js":
/*!***************************************!*\
  !*** (webpack)/buildin/amd-define.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function() {\n\tthrow new Error(\"define cannot be used indirect\");\n};\n\n\n//# sourceURL=webpack://aquto/(webpack)/buildin/amd-define.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/amd-options.js":
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */\nmodule.exports = __webpack_amd_options__;\n\n/* WEBPACK VAR INJECTION */}.call(this, {}))\n\n//# sourceURL=webpack://aquto/(webpack)/buildin/amd-options.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(module) {\n\tif (!module.webpackPolyfill) {\n\t\tmodule.deprecate = function() {};\n\t\tmodule.paths = [];\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack://aquto/(webpack)/buildin/module.js?");

/***/ }),

/***/ "./src/aquto.flows.js":
/*!****************************!*\
  !*** ./src/aquto.flows.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*!\n * Aquto Move Rewards v0.1.0 <http://aquto.com>\n */\n\n\nvar jsonp = __webpack_require__(/*! browser-jsonp */ \"./node_modules/browser-jsonp/lib/jsonp.js\")\nvar sharedCallback = __webpack_require__(/*! ./sharedCallback */ \"./src/sharedCallback.js\").sharedCallback\nvar utils = __webpack_require__(/*! ./utils */ \"./src/utils.js\")\n\n/** instantiate moveRewards object */\nvar moveRewards = {}\n\n/** Check if Aquto backend hostname has been passed in */\nvar scriptParams = utils._parseScriptQuery(document.getElementById('aquto-api'))\nvar be = scriptParams.be || 'app.aquto.com'\n// testing - remove when done\nbe = 'mp-dev.aquto.internal'\n// var ow = scriptParams.ow || 'ow.aquto.com'\n\n/**\n * Check eligibility for the current device\n * Campaign id is used to determine configured reward, and operator\n *\n * @param {String} campaignId Aquto campaign id\n * @param {function} callback Callback function on success or error\n * @param {String} [phoneNumber] The phone number of the subscriber\n * @param {String} [publisherSiteUuid] Optional publisherSiteUuid of the inventory (generated by Aquto)\n * @param {String} [channel] Optional channel of the inventory\n *\n */\nfunction checkEligibility(options) {\n    if (options && options.campaignId) {\n        var data = { apiVersion: 'v8' }\n        if(options.phoneNumber) {\n            data.phoneNumber = options.phoneNumber\n        }\n        if(options.publisherSiteUuid) {\n            data.publisherSiteUuid = options.publisherSiteUuid\n        }\n        if(options.channel) {\n            data.channel = options.channel\n        }\n        jsonp({\n            url: '//' + be + '/api/campaign/datarewards/identifyandcheck/'+options.campaignId,\n            callbackName: 'jsonp',\n            data: data,\n            success: function(response) {\n                sharedCallback(response, options.callback)\n            },\n            error: function(response) {\n                sharedCallback(response, options.callback)\n            }\n        })\n    }\n}\n\n/**\n * Check eligibility for the current device\n * Campaign id is used to determine configured reward, and operator\n *\n * @param {String} campaignId Aquto campaign id\n * @param {function} callback Callback function on success or error\n * @param {String} [phoneNumber] The phone number of the subscriber\n * @param {String} [publisherSiteUuid] Optional publisherSiteUuid of the inventory (generated by Aquto)\n * @param {String} [channel] Optional channel of the inventory\n *\n */\n\nfunction checkAppEligibility(options) {\n    if (options && options.campaignId) {\n        var data = { apiVersion: 'v8' }\n        if(options.phoneNumber) {\n            data.phoneNumber = options.phoneNumber\n        }\n        if(options.publisherSiteUuid) {\n            data.publisherSiteUuid = options.publisherSiteUuid\n        }\n        if(options.channel) {\n            data.channel = options.channel\n        }\n\n        jsonp({\n            url: '//' + be + '/api/campaign/datarewards/eligibility/' + options.campaignId,\n            callbackName: 'jsonp',\n            data: data,\n            success: function(response) {\n                sharedCallback(response, options.callback)\n            },\n            error: function(response) {\n                sharedCallback(response, options.callback)\n            }\n        })\n    }\n}\n/*--------------------------------------------------------------------------*/\n\n/*--------------------------------------------------------------------------*/\n\n/**\n * The semantic version number.\n *\n * @static\n * @memberOf _\n * @type String\n */\nmoveRewards.VERSION = '0.1.0'\n\n// assign eligibility static methods\nmoveRewards.checkEligibility = checkEligibility\nmoveRewards.checkAppEligibilityPhoneEntry = checkAppEligibility\n\n// helper functions\nmoveRewards.utils = utils\n\n/*--------------------------------------------------------------------------*/\n\nmodule.exports = moveRewards\n\n\n//# sourceURL=webpack://aquto/./src/aquto.flows.js?");

/***/ }),

/***/ "./src/sharedCallback.js":
/*!*******************************!*\
  !*** ./src/sharedCallback.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Prepare the response to be returned and fires callback\n * Code shared between checkEligiblity and complete that formats the reward amount,\n * prepares the returned strings, and fires the callback\n *\n * @param {Object} response JSON response from server\n * @param {Object} callback Optional callback to be fired after response from server\n *\n */\nfunction sharedCallback(response, callback) {\n  if (callback && typeof callback === 'function') {\n    var callbackObject;\n\n    if (response && response.response && response.response.eligible) {\n      callbackObject = {\n        eligible: true,\n        rewardAmount: response.response.rewardAmountMB,\n        userToken: response.response.userToken\n      }\n\n      var operatorInfo = getOperatorInfo(response.response.operatorCode)\n      callbackObject.carrier = operatorInfo.operatorCode\n      callbackObject.carrierName = operatorInfo.operatorName\n\n      var rewardText\n      if (response.response.displayText) {\n        var rewardAmountFormatted = response.response.rewardAmountMB ? response.response.rewardAmountMB + '\\xa0MB' : ''\n        rewardText = response.response.displayText\n\n        rewardText = rewardText.replace('$$operator$$', operatorInfo.operatorName)\n        rewardText = rewardText.replace('$$rewardAmount$$', rewardAmountFormatted)\n      }\n      callbackObject.rewardText = rewardText\n\n      if (response.response.offerUrl) {\n        callbackObject.clickUrl = response.response.offerUrl\n      }\n\n    } else {\n      callbackObject = {\n        eligible: false,\n        identified: !!(response.response && response.response.operatorCode !== 'unknown')\n      }\n    }\n\n    callback(callbackObject)\n  }\n}\n\nfunction prepareCompleteCallback(response) {\n  var callbackObject;\n\n  if (response && response.response) {\n    callbackObject = {\n      success: !!response.response.successful,\n      status: response.response.status,\n      rewardAmount: response.response.rewardAmountMB\n    }\n\n    var operatorInfo = getOperatorInfo(response.response.operatorCode)\n    callbackObject.carrier = operatorInfo.operatorCode\n    callbackObject.carrierName = operatorInfo.operatorName\n  } else {\n    callbackObject = {\n      success: false,\n      status: 'generalerror'\n    }\n  }\n\n  return callbackObject\n}\n\n/**\n * Prepares the reward response to be returned and fires callback\n *\n * @param {Object} response JSON response from server\n * @param {Object} callback Optional callback to be fired after response from server\n *\n */\nfunction completeCallback(response, callback) {\n  if (callback && typeof callback === 'function') {\n    callback(prepareCompleteCallback(response))\n  }\n}\n\n/**\n * Prepares the voucher response to be returned and fires callback\n *\n * @param {Object} response JSON response from server\n * @param {Object} callback Optional callback to be fired after response from server\n *\n */\nfunction voucherCallback(response, callback) {\n  if (callback && typeof callback === 'function') {\n    var callbackObject = prepareCompleteCallback(response)\n\n    // Group some statuses into ineligible\n    switch (response.response.status) {\n      case 'unabletoidentify':\n      case 'ineligible':\n      case 'unabletoconvert':\n      case 'generalerror':\n        callbackObject.status = 'ineligible'\n        break\n      // NOTE: default status can be 'voucherinvalid', 'voucherexpired', or 'voucheralreadyredeemed'\n    }\n\n    callback(callbackObject)\n  }\n}\n\nfunction getOperatorInfo(operatorCode) {\n  var operatorName\n\n  if (\n    operatorCode === 'attmb' ||\n    operatorCode === 'attsim' ||\n    operatorCode === 'attrw'\n  ) {\n    operatorName = \"AT&T\"\n    operatorCode = 'att'\n  }\n  else if (operatorCode === 'vzwrw') {\n    operatorName = \"Verizon\"\n    operatorCode = 'vzw'\n  }\n  else if (operatorCode === 'vzwrw') {\n    operatorName = \"Verizon\"\n    operatorCode = 'vzw'\n  }\n  else if (\n    operatorCode === 'movirw' ||\n    operatorCode === 'moviperw'\n  ) {\n    operatorName = \"Movistar\"\n    operatorCode = 'movi'\n  }\n  else if (operatorCode === 'telcelrw') {\n    operatorName = \"Telcel\"\n    operatorCode = 'telcel'\n  }\n  else if (operatorCode === 'tigogtrw') {\n    operatorName = 'Tigo'\n    operatorCode = 'tigogt'\n  }\n  else if (operatorCode === 'oibrrw'){\n    operatorName = 'Oi'\n    operatorCode = 'oibr'\n  } else {\n    operatorName = 'N/A'\n    operatorCode = 'na'\n  }\n\n  return {\n    operatorCode: operatorCode,\n    operatorName: operatorName\n  }\n}\n\n\nmodule.exports = {\n  sharedCallback: sharedCallback,\n  voucherCallback: voucherCallback,\n  completeCallback: completeCallback\n}\n\n\n//# sourceURL=webpack://aquto/./src/sharedCallback.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Creates and loads an image element in order to determine of a user is online or offline\n * @param  {Function} callback - returns a boolean to determine if the user is online or offline\n */\nfunction isOnline(callback) {\n  var url = '//d1y0qivfpuylge.cloudfront.net/images/pixel.gif'\n  var img = new Image()\n  img.onload = function() { callback(true) }\n  img.onerror = function() { callback(false) }\n  img.src = url + '?rcb=' + Math.floor((1 + Math.random()) * 0x10000).toString(16)\n}\n\n/**\n * Format reward amount\n * Adds MB or GB as broadway-devropriate\n *\n * @param {Integer} rewardAmount Reward amount in MB\n *\n */\nfunction formatData(rewardAmount) {\n  var dataNum = rewardAmount\n  var dataLabel = 'MB'\n  if (dataNum > 9999) {\n    dataNum = Math.floor(dataNum/1024)\n    dataLabel = 'GB'\n  }\n  return dataNum.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, \",\") + dataLabel\n}\n\n/**\n *\n *\n */\nfunction parseScriptQuery(scriptTag) {\n  var args = {}\n  if (scriptTag) {\n    var query = scriptTag.src.replace(/^[^\\?]+\\??/,'')\n\n    var vars = query.split(\"&\")\n    for (var i=0; i<vars.length; i++) {\n      var pair = vars[i].split(\"=\")\n      // decodeURI doesn't expand \"+\" to a space.\n      args[pair[0]] = decodeURI(pair[1]).replace(/\\+/g, ' ')\n    }\n  }\n  return args\n}\n\nmodule.exports = {\n  isOnline: isOnline,\n  formatData: formatData,\n  _parseScriptQuery: parseScriptQuery\n}\n\n\n//# sourceURL=webpack://aquto/./src/utils.js?");

/***/ })

/******/ });