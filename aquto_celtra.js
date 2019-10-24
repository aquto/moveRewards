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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/aquto.celtra.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/aquto.celtra.js":
/*!*****************************!*\
  !*** ./src/aquto.celtra.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*!\n * Aquto Move Rewards v0.1.0 <http://aquto.com>\n */\n\n\n// var jsonp = require('browser-jsonp');\nvar sharedCallback = __webpack_require__(/*! ./sharedCallback */ \"./src/sharedCallback.js\");\n\n/** instantiate moveRewards object */\nvar moveRewards = {};\n\n/**\n * Check eligibility for the current device\n * Campaign id is used to determine configured reward, and operator\n *\n * @param {String} campaignId Aquto campaign id\n * @param {function} callback Callback function on success or error\n *\n */\nfunction checkEligibility(options) {\n  console.log('checkEligibility from aquto.celtra.js ...')\n  if (options && options.campaignId) {\n    var url = \"//app.aquto.com/api/campaign/datarewards/identifyandcheck/\"+options.campaignId+\"?apiVersion=v8\";\n    loadJSONP(url, {paramName: 'jsonp'}, function(response) {\n      sharedCallback(response, options.callback);\n    });\n  }\n}\n\n/**\n * Check eligibility for the current device\n * Campaign id is used to determine configured reward, and operator\n *\n * @param {String} campaignId Aquto campaign id\n * @param {function} callback Callback function on success or error\n *\n */\nfunction checkAppEligibility(options) {\n  if (options && options.campaignId) {\n    var url = \"//app.aquto.com/api/campaign/datarewards/eligibility/\"+options.campaignId+\"?apiVersion=v8\";\n    loadJSONP(url, {paramName: 'jsonp'}, function(response) {\n      sharedCallback(response, options.callback);\n    });\n  }\n}\n\n\n/**\n * Complete the conversion for the last checkEligibility call\n * Campaign id is used to link with existing checkEligibility calls\n *\n * @param {String} campaignId Aquto campaign id\n * @param {function} callback Callback function on success or error\n *\n */\nfunction complete(options) {\n  if (options && options.campaignId) {\n    var url = \"//app.aquto.com/api/campaign/datarewards/applyreward/\"+options.campaignId+\"?apiVersion=v8\";\n    if(options.userToken) {\n      url = \"//app.aquto.com/api/campaign/datarewards/applyreward/\"+options.campaignId+\"?apiVersion=v8\"+\"&userToken=\"+options.userToken;\n    }\n    loadJSONP(url, {paramName: 'jsonp'}, function(response) {\n      sharedCallback(response, options.callback);\n    });\n  }\n}\n\n/*--------------------------------------------------------------------------*/\n\n/**\n * The semantic version number.\n *\n * @static\n * @memberOf _\n * @type String\n */\nmoveRewards.VERSION = '0.1.0';\n\n// assign static methods\nmoveRewards.checkEligibility = checkEligibility;\nmoveRewards.checkEligibilitySinglePage = checkAppEligibility;\nmoveRewards.checkAppEligibility = checkAppEligibility;\nmoveRewards.complete = complete;\n\n/*--------------------------------------------------------------------------*/\n\nmodule.exports = moveRewards;\n\n\n//# sourceURL=webpack://aquto/./src/aquto.celtra.js?");

/***/ }),

/***/ "./src/sharedCallback.js":
/*!*******************************!*\
  !*** ./src/sharedCallback.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Prepare the response to be returned and fires callback\n * Code shared between checkEligiblity and complete that formats the reward amount,\n * prepares the returned strings, and fires the callback\n *\n * @param {Object} response JSON response from server\n * @param {Object} callback Optional callback to be fired after response from server\n *\n */\nfunction sharedCallback(response, callback) {\n  if (callback && typeof callback === 'function') {\n    var callbackObject;\n\n    if (response && response.response && response.response.eligible) {\n      callbackObject = {\n        eligible: true,\n        identified: true,\n        status: response.response.status,\n        rewardAmount: response.response.rewardAmountMB,\n        userToken: response.response.userToken\n      }\n\n      var operatorInfo = getOperatorInfo(response.response.operatorCode)\n      callbackObject.carrier = operatorInfo.operatorCode\n      callbackObject.carrierName = operatorInfo.operatorName\n\n      var rewardText\n      if (response.response.displayText) {\n        var rewardAmountFormatted = response.response.rewardAmountMB ? response.response.rewardAmountMB + '\\xa0MB' : ''\n        rewardText = response.response.displayText\n\n        rewardText = rewardText.replace('$$operator$$', operatorInfo.operatorName)\n        rewardText = rewardText.replace('$$rewardAmount$$', rewardAmountFormatted)\n      }\n      callbackObject.rewardText = rewardText\n\n      if (response.response.offerUrl) {\n        callbackObject.clickUrl = response.response.offerUrl\n      }\n\n    } else {\n      callbackObject = {\n        eligible: false,\n        identified: !!(response && response.response && response.response.operatorCode !== 'unknown'),\n        status: response && response.response ? response.response.status : 'generalerror'\n      }\n    }\n\n    callback(callbackObject)\n  }\n}\n\nfunction prepareCompleteCallback(response) {\n  var callbackObject;\n\n  if (response && response.response) {\n    callbackObject = {\n      success: !!response.response.successful,\n      status: response.response.status,\n      rewardAmount: response.response.rewardAmountMB\n    }\n\n    var operatorInfo = getOperatorInfo(response.response.operatorCode)\n    callbackObject.carrier = operatorInfo.operatorCode\n    callbackObject.carrierName = operatorInfo.operatorName\n  } else {\n    callbackObject = {\n      success: false,\n      status: 'generalerror'\n    }\n  }\n\n  return callbackObject\n}\n\n/**\n * Prepares the reward response to be returned and fires callback\n *\n * @param {Object} response JSON response from server\n * @param {Object} callback Optional callback to be fired after response from server\n *\n */\nfunction completeCallback(response, callback) {\n  if (callback && typeof callback === 'function') {\n    callback(prepareCompleteCallback(response))\n  }\n}\n\n/**\n * Prepares the voucher response to be returned and fires callback\n *\n * @param {Object} response JSON response from server\n * @param {Object} callback Optional callback to be fired after response from server\n *\n */\nfunction voucherCallback(response, callback) {\n  if (callback && typeof callback === 'function') {\n    var callbackObject = prepareCompleteCallback(response)\n\n    // Group some statuses into ineligible\n    switch (response.response.status) {\n      case 'unabletoidentify':\n      case 'ineligible':\n      case 'unabletoconvert':\n      case 'generalerror':\n        callbackObject.status = 'ineligible'\n        break\n      // NOTE: default status can be 'voucherinvalid', 'voucherexpired', or 'voucheralreadyredeemed'\n    }\n\n    callback(callbackObject)\n  }\n}\n\nfunction getOperatorInfo(operatorCode) {\n  var operatorName\n\n  if (\n    operatorCode === 'attmb' ||\n    operatorCode === 'attsim' ||\n    operatorCode === 'attrw'\n  ) {\n    operatorName = \"AT&T\"\n    operatorCode = 'att'\n  }\n  else if (operatorCode === 'vzwrw') {\n    operatorName = \"Verizon\"\n    operatorCode = 'vzw'\n  }\n  else if (operatorCode === 'vzwrw') {\n    operatorName = \"Verizon\"\n    operatorCode = 'vzw'\n  }\n  else if (\n    operatorCode === 'movirw' ||\n    operatorCode === 'moviperw'\n  ) {\n    operatorName = \"Movistar\"\n    operatorCode = 'movi'\n  }\n  else if (operatorCode === 'telcelrw') {\n    operatorName = \"Telcel\"\n    operatorCode = 'telcel'\n  }\n  else if (operatorCode === 'tigogtrw') {\n    operatorName = 'Tigo'\n    operatorCode = 'tigogt'\n  }\n  else if (operatorCode === 'oibrrw'){\n    operatorName = 'Oi'\n    operatorCode = 'oibr'\n  } else {\n    operatorName = 'N/A'\n    operatorCode = 'na'\n  }\n\n  return {\n    operatorCode: operatorCode,\n    operatorName: operatorName\n  }\n}\n\n\nmodule.exports = {\n  sharedCallback: sharedCallback,\n  voucherCallback: voucherCallback,\n  completeCallback: completeCallback\n}\n\n\n//# sourceURL=webpack://aquto/./src/sharedCallback.js?");

/***/ })

/******/ });