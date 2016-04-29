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
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Aquto Move Rewards v0.1.0 <http://aquto.com>
	 */
	'use strict';

	var jsonp = __webpack_require__(1);

	/** instantiate moveRewards object */
	var moveRewards = {};


	/** Timer shortcuts */
	var clearTimeout = window.clearTimeout,
	    setTimeout = window.setTimeout;

	/**
	 * Format reward amount
	 * Adds MB or GB as appropriate
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
	        rewardAmount: response.response.rewardAmountMB
	      };
	      var operatorName;
	      var operatorCode;
	      
	      if (response.response.operatorCode === 'attmb' || response.response.operatorCode === 'attsim') {
	        operatorName = "AT&T";
	        operatorCode = 'att';
	      }
	      else if (response.response.operatorCode === 'vzwrw') {
	        operatorName = "Verizon";
	        operatorCode = 'vzw';
	      }
	      else {
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
	    jsonp({
	      url: 'http://app.kickbit.com/api/campaign/datarewards/identifyandcheck/'+options.campaignId,
	      callbackName: 'jsonp',
	      success: function(response) {
	        sharedCallback(response, options.callback);
	      }
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
	    jsonp({
	      url: 'http://app.kickbit.com/api/campaign/datarewards/identifyandcheck/'+options.campaignId,
	      callbackName: 'jsonp',
	      success: function(response) {
	        sharedCallback(response, options.callback);
	      }
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
	    jsonp({
	      url: 'https://app.kickbit.com/api/campaign/datarewards/applyreward/'+options.campaignId,
	      callbackName: 'jsonp',
	      success: function(response) {
	        sharedCallback(response, options.callback);
	      }
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
	moveRewards.checkAppEligibility = checkAppEligibility;
	moveRewards.complete = complete;

	/*--------------------------------------------------------------------------*/

	module.exports = moveRewards;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {(function() {
	  var JSONP, computedUrl, createElement, encode, noop, objectToURI, random, randomString;

	  createElement = function(tag) {
	    return window.document.createElement(tag);
	  };

	  encode = window.encodeURIComponent;

	  random = Math.random;

	  JSONP = function(options) {
	    var callback, callbackFunc, callbackName, done, head, params, script;
	    options = options ? options : {};
	    params = {
	      data: options.data || {},
	      error: options.error || noop,
	      success: options.success || noop,
	      beforeSend: options.beforeSend || noop,
	      complete: options.complete || noop,
	      url: options.url || ''
	    };
	    params.computedUrl = computedUrl(params);
	    if (params.url.length === 0) {
	      throw new Error('MissingUrl');
	    }
	    done = false;
	    if (params.beforeSend({}, params) !== false) {
	      callbackName = options.callbackName || 'callback';
	      callbackFunc = options.callbackFunc || 'jsonp_' + randomString(15);
	      callback = params.data[callbackName] = callbackFunc;
	      window[callback] = function(data) {
	        window[callback] = null;
	        params.success(data, params);
	        return params.complete(data, params);
	      };
	      script = createElement('script');
	      script.src = computedUrl(params);
	      script.async = true;
	      script.onerror = function(evt) {
	        params.error({
	          url: script.src,
	          event: evt
	        });
	        return params.complete({
	          url: script.src,
	          event: evt
	        }, params);
	      };
	      script.onload = script.onreadystatechange = function() {
	        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
	          done = true;
	          script.onload = script.onreadystatechange = null;
	          if (script && script.parentNode) {
	            script.parentNode.removeChild(script);
	          }
	          return script = null;
	        }
	      };
	      head = head || window.document.getElementsByTagName('head')[0] || window.document.documentElement;
	      head.insertBefore(script, head.firstChild);
	    }
	    return {
	      abort: function() {
	        window[callback] = function() {
	          return window[callback] = null;
	        };
	        done = true;
	        if (script && script.parentNode) {
	          script.onload = script.onreadystatechange = null;
	          if (script && script.parentNode) {
	            script.parentNode.removeChild(script);
	          }
	          return script = null;
	        }
	      }
	    };
	  };

	  noop = function() {
	    return void 0;
	  };

	  computedUrl = function(params) {
	    var url;
	    url = params.url;
	    url += params.url.indexOf('?') < 0 ? '?' : '&';
	    url += objectToURI(params.data);
	    return url;
	  };

	  randomString = function(length) {
	    var str;
	    str = '';
	    while (str.length < length) {
	      str += random().toString(36)[2];
	    }
	    return str;
	  };

	  objectToURI = function(obj) {
	    var data, key, value;
	    data = [];
	    for (key in obj) {
	      value = obj[key];
	      data.push(encode(key) + '=' + encode(value));
	    }
	    return data.join('&');
	  };

	  if (("function" !== "undefined" && __webpack_require__(3) !== null) && __webpack_require__(4)) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return JSONP;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if ((typeof module !== "undefined" && module !== null) && module.exports) {
	    module.exports = JSONP;
	  } else {
	    this.JSONP = JSONP;
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }
/******/ ]);