var aquto =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Aquto Move Rewards v0.1.0 <http://aquto.com>
	 */
	'use strict';

	// var jsonp = require('browser-jsonp');
	var sharedCallback = __webpack_require__(5);

	/** instantiate moveRewards object */
	var moveRewards = {};

	/**
	 * Check eligibility for the current device
	 * Campaign id is used to determine configured reward, and operator
	 *
	 * @param {String} campaignId Aquto campaign id
	 * @param {function} callback Callback function on success or error
	 *
	 */
	function checkEligibility(options) {
	  if (options && options.campaignId) {
	    var url = "//app.aquto.com/api/campaign/datarewards/identifyandcheck/"+options.campaignId+"?apiVersion=v8";
	    loadJSONP(url, {paramName: 'jsonp'}, function(response) {
	      sharedCallback(response, options.callback);
	    });
	  }
	}

	/**
	 * Check eligibility for the current device
	 * Campaign id is used to determine configured reward, and operator
	 *
	 * @param {String} campaignId Aquto campaign id
	 * @param {function} callback Callback function on success or error
	 *
	 */
	function checkAppEligibility(options) {
	  if (options && options.campaignId) {
	    var url = "//app.aquto.com/api/campaign/datarewards/eligibility/"+options.campaignId+"?apiVersion=v8";
	    loadJSONP(url, {paramName: 'jsonp'}, function(response) {
	      sharedCallback(response, options.callback);
	    });
	  }
	}


	/**
	 * Complete the conversion for the last checkEligibility call
	 * Campaign id is used to link with existing checkEligibility calls
	 *
	 * @param {String} campaignId Aquto campaign id
	 * @param {function} callback Callback function on success or error
	 *
	 */
	function complete(options) {
	  if (options && options.campaignId) {
	    var url = "//app.aquto.com/api/campaign/datarewards/applyreward/"+options.campaignId+"?apiVersion=v8";
	    if(options.userToken) {
	      url = "//app.aquto.com/api/campaign/datarewards/applyreward/"+options.campaignId+"?apiVersion=v8"+"&userToken="+options.userToken;
	    }
	    loadJSONP(url, {paramName: 'jsonp'}, function(response) {
	      sharedCallback(response, options.callback);
	    });
	  }
	}

	/*--------------------------------------------------------------------------*/

	/**
	 * The semantic version number.
	 *
	 * @static
	 * @memberOf _
	 * @type String
	 */
	moveRewards.VERSION = '0.1.0';

	// assign static methods
	moveRewards.checkEligibility = checkEligibility;
	moveRewards.checkEligibilitySinglePage = checkAppEligibility;
	moveRewards.checkAppEligibility = checkAppEligibility;
	moveRewards.complete = complete;

	/*--------------------------------------------------------------------------*/

	module.exports = moveRewards;


/***/ },

/***/ 5:
/***/ function(module, exports) {

	/**
	 * Prepare the response to be returned and fires callback
	 * Code shared between checkEligiblity and complete that formats the reward amount,
	 * prepares the returned strings, and fires the callback
	 *
	 * @param {Object} response JSON response from server
	 * @param {Object} callback Optional callback to be fired after response from server
	 *
	 */
	function sharedCallback(response, callback) {
	  if (callback &&  typeof callback === 'function') {
	    if (response && response.response && response.response.eligible) {

	      var callbackObject = {
	        eligible: true,
	        rewardAmount: response.response.rewardAmountMB,
	        userToken: response.response.userToken
	      }

	      var operatorInfo = getOperatorInfo(response.response.operatorCode)
	      if (!operatorInfo) {
	        return
	      }
	      callbackObject.carrier = operatorInfo.operatorCode
	      callbackObject.carrierName = operatorInfo.operatorName

	      var rewardText
	      if (response.response.displayText) {
	        var rewardAmountFormatted
	        if (response.response.rewardAmountMB) {
	          rewardAmountFormatted = response.response.rewardAmountMB + '\xa0MB'
	        }
	        else {
	          return
	        }
	        rewardText = response.response.displayText

	        rewardText = rewardText.replace('$$operator$$', operatorInfo.operatorName)
	        rewardText = rewardText.replace('$$rewardAmount$$', rewardAmountFormatted)
	      }
	      callbackObject.rewardText = rewardText

	      if (response.response.offerUrl) {
	        callbackObject.clickUrl = response.response.offerUrl
	      }

	      callback(callbackObject)
	    }
	    else {
	      callback({
	        eligible: false,
	        identified: !(response.response.operatorCode === 'unknown')
	      })
	    }
	  }
	}

	/**
	 * Prepares the voucher response to be returned and fires callback
	 *
	 * @param {Object} response JSON response from server
	 * @param {Object} callback Optional callback to be fired after response from server
	 *
	 */
	function voucherCallback(response, callback) {
	  if (callback &&  typeof callback === 'function') {
	    if (response && response.response && response.response.status === 'success') {

	      var callbackObject = {
	        success: true,
	        status: 'success',
	        rewardAmount: response.response.rewardAmountMB,
	      }

	      var operatorInfo = getOperatorInfo(response.response.operatorCode)
	      if (!operatorInfo) {
	        return
	      }
	      callbackObject.carrier = operatorInfo.operatorCode
	      callbackObject.carrierName = operatorInfo.operatorName

	      callback(callbackObject)
	    }
	    else if (response && response.response && response.response.status) {
	      var callbackObject = {
	        success: false
	      }

	      if (response.response.status !== 'unabletoidentify') {
	        var operatorInfo = getOperatorInfo(response.response.operatorCode)
	        if (!operatorInfo) {
	          return
	        }
	        callbackObject.carrier = operatorInfo.operatorCode
	        callbackObject.carrierName = operatorInfo.operatorName
	      }

	      var status
	      switch (response.response.status) {
	        case 'unabletoidentify':
	        case 'ineligible':
	        case 'unabletoconvert':
	        case 'generalerror':
	          status = 'ineligible'
	          break
	        // NOTE: default status can be 'voucherinvalid', 'voucherexpired', or 'voucheralreadyredeemed'
	        default:
	          status = response.response.status
	      }

	      callbackObject.status = status
	      callback(callbackObject)
	    }
	  }
	}

	function getOperatorInfo(operatorCode) {
	  var operatorName

	  if (
	    operatorCode === 'attmb' ||
	    operatorCode === 'attsim' ||
	    operatorCode === 'attrw'
	  ) {
	    operatorName = "AT&T"
	    operatorCode = 'att'
	  }
	  else if (operatorCode === 'vzwrw') {
	    operatorName = "Verizon"
	    operatorCode = 'vzw'
	  }
	  else if (operatorCode === 'vzwrw') {
	    operatorName = "Verizon"
	    operatorCode = 'vzw'
	  }
	  else if (
	    operatorCode === 'movirw' ||
	    operatorCode === 'moviperw'
	  ) {
	    operatorName = "Movistar"
	    operatorCode = 'movi'
	  }
	  else if (operatorCode === 'telcelrw') {
	    operatorName = "Telcel"
	    operatorCode = 'telcel'
	  }
	  else if (operatorCode === 'tigogtrw') {
	    operatorName = 'Tigo'
	    operatorCode = 'tigogt'
	  }
	  else if (operatorCode === 'oibrrw'){
	    operatorName = 'Oi'
	    operatorCode = 'oibr'
	  } else {
	    return
	  }

	  return {
	    operatorCode: operatorCode,
	    operatorName: operatorName
	  }
	}




	module.exports = {
	  sharedCallback:sharedCallback,
	  voucherCallback: voucherCallback
	}


/***/ }

/******/ });