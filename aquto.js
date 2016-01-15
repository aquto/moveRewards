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
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/*!
	 * Aquto Move Rewards v0.1.0 <http://aquto.com>
	 */
	'use strict';

	/** instantiate moveRewards object */
	var moveRewards = {};


	/** Timer shortcuts */
	var clearTimeout = window.clearTimeout,
	    setTimeout = window.setTimeout;

	/**
	 * Check eligibility for the current device
	 * Campaign id is used to determine configured reward, and operator
	 *
	 * @param {String} campaignId Aquto campaign id
	 * @param {function} callback Callback function on success or error
	 *
	 */
	function checkEligibility(options) {
	  setTimeout(function(){
	    if (options.callback &&  typeof options.callback === 'function') {
	      options.callback({
	        eligible: true,
	        rewardAmount: 1024,
	        carrier: 'att',
	        rewardText: 'Purchase any subscription and get 1GB added to your AT&T data plan.'
	      });
	    }

	  },1000);
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
	  setTimeout(function(){
	    if (options.callback &&  typeof options.callback === 'function') {
	      options.callback({
	        success: true,
	        rewardAmount: 1024,
	        carrier: 'att',
	        rewardText: 'You have received 1GB of mobile data for purchasing a subscription.'
	      });
	    }

	  },1000);
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
	moveRewards.complete = complete;

	/*--------------------------------------------------------------------------*/

	module.exports = moveRewards;


/***/ }
/******/ ]);