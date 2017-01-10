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
	    var url = "//app.kickbit.com/api/campaign/datarewards/identifyandcheck/"+options.campaignId+"?apiVersion=v8";
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
	    var url = "//app.kickbit.com/api/campaign/datarewards/eligibility/"+options.campaignId+"?apiVersion=v8";
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
	    var url = "//app.kickbit.com/api/campaign/datarewards/applyreward/"+options.campaignId+"?apiVersion=v8";
	    if(options.userToken) {
	      url = "//app.kickbit.com/api/campaign/datarewards/applyreward/"+options.campaignId+"?apiVersion=v8"+"&userToken="+options.userToken;
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
	 * Format reward amount
	 * Adds MB or GB as broadway-devropriate
	 *
	 * @param {Integer} rewardAmount Reward amount in MB
	 *
	 */
	function formatData(rewardAmount) {
	  var dataNum = rewardAmount;
	  var dataLabel = 'MB';
	  if (dataNum > 9999) {
	    dataNum = Math.floor(dataNum/1024);
	    dataLabel = 'GB';
	  }
	  return dataNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + dataLabel;
	}

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
	      };
	      var operatorName;
	      var operatorCode;

	      if (
	        response.response.operatorCode === 'attmb' ||
	        response.response.operatorCode === 'attsim' ||
	        response.response.operatorCode === 'attrw' 
	      ) {
	        operatorName = "AT&T";
	        operatorCode = 'att';
	      }
	      else if (response.response.operatorCode === 'vzwrw') {
	        operatorName = "Verizon";
	        operatorCode = 'vzw';
	      }
	      else if (response.response.operatorCode === 'vzwrw') {
	        operatorName = "Verizon";
	        operatorCode = 'vzw';
	      }
	      else if (response.response.operatorCode === 'movirw') {
	        operatorName = "Movistar";
	        operatorCode = 'movi';
	      }
	      else if (response.response.operatorCode === 'telcelrw') {
	        operatorName = "Telcel";
	        operatorCode = 'telcel';
	      } else {
	        return;
	      }
	      callbackObject.carrier = operatorCode;
	      callbackObject.carrierName = operatorName;

	      var rewardText;
	      if (response.response.displayText) {
	        var rewardAmountFormatted;
	        if (response.response.rewardAmountMB) {
	          rewardAmountFormatted = response.response.rewardAmountMB + '\xa0MB';
	        }
	        else {
	          return;
	        }
	        rewardText = response.response.displayText;

	        rewardText = rewardText.replace('$$operator$$', operatorName);
	        rewardText = rewardText.replace('$$rewardAmount$$', rewardAmountFormatted);
	      }
	      callbackObject.rewardText = rewardText;

	      if (response.response.offerUrl) {
	        callbackObject.clickUrl = response.response.offerUrl;
	      }

	      callback(callbackObject);
	    }
	    else {
	      callback({
	        eligible: false
	      });
	    }
	  }
	}

	module.exports = sharedCallback;


/***/ }

/******/ });