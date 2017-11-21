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
	'use strict'

	var jsonp = __webpack_require__(1)
	var sharedCallback = __webpack_require__(5).sharedCallback
	var voucherCallback = __webpack_require__(5).voucherCallback
	var utils = __webpack_require__(6)

	/** instantiate moveRewards object */
	var moveRewards = {}

	/** Check if Aquto backend hostname has been passed in */
	var scriptParams = utils._parseScriptQuery(document.getElementById('aquto-api'))
	var be = scriptParams.be || 'app.aquto.com'
	var ow = scriptParams.ow || 'ow.aquto.com'


	/**
	 * Check eligibility for the current device
	 * Campaign id is used to determine configured reward, and operator
	 *
	 * @param {String} campaignId Aquto campaign id
	 * @param {function} callback Callback function on success or error
	 * @param {String} [phoneNumber] The phone number of the subscriber
	 * @param {String} [channel] Optional channel of the inventory
	 *
	 */
	function checkEligibility(options) {
	  if (options && options.campaignId) {
	    var data = { apiVersion: 'v8' }
	    if(options.phoneNumber) {
	      data.phoneNumber = options.phoneNumber
	    }
	    if(options.channel) {
	      data.channel = options.channel
	    }
	    jsonp({
	      url: '//' + be + '/api/campaign/datarewards/identifyandcheck/'+options.campaignId,
	      callbackName: 'jsonp',
	      data: data,
	      success: function(response) {
	        sharedCallback(response, options.callback)
	      }
	    })
	  }
	}

	/**
	 * Check eligibility for the current device
	 * Doesn't require a campaignId
	 *
	 * @param {function} callback Callback function on success or error
	 * @param {String} [phoneNumber] The phone number of the subscriber
	 *
	 */
	function genericCheckEligibility(options) {
	  var data = { apiVersion: 'v8' }
	  if(options.phoneNumber) {
	    data.phoneNumber = options.phoneNumber
	  }
	  jsonp({
	    url: '//' + be + '/api/datarewards/eligibility',
	    callbackName: 'jsonp',
	    data: data,
	    success: function(response) {
	      if (options.callback &&  typeof options.callback === 'function') {
	        options.callback(response.response)
	      }
	    }
	  })
	}

	/**
	 * Check if user is eligible for the Aquto Offer Wall
	 *
	 * @param {function} callback Callback function on success or error
	 * @param {String} [carrier] The phone number of the subscriber
	 *
	 */
	function checkOfferWallEligibility(options) {
	  var data = { apiVersion: 'v8' }
	  if(options.carrier) {
	    data.operatorCode = options.carrier
	  }
	  if(options.phoneNumber) {
	    data.phoneNumber = options.phoneNumber
	  }
	  if(options.countryCode) {
	    data.countryCode = options.countryCode
	  }
	  jsonp({
	    url: '//' + be + '/api/datarewards/offerwall/eligibility',
	    callbackName: 'jsonp',
	    data: data,
	    success: function(response) {
	      if (options.callback &&  typeof options.callback === 'function') {
	        if (response.response.eligible) {
	          var offerWallHref = '//' + ow + '/#/' + response.response.opCode + '/offers'
	          if(options.phoneNumber) {
	            offerWallHref = offerWallHref + '?pn=' + options.phoneNumber
	          }
	          options.callback({
	            eligible: true,
	            offerWallHref: offerWallHref,
	            numberOfOffers: response.response.offerCount
	          })
	        } else {
	          options.callback({
	            eligible: false,
	            identified: !(response.response.opCode === 'unknown'),
	            numberOfOffers: 0
	          })
	        }
	      }
	    }
	  })
	}

	/**
	 * Check eligibility for the current device
	 * Campaign id is used to determine configured reward, and operator
	 *
	 * @param {String} campaignId Aquto campaign id
	 * @param {function} callback Callback function on success or error
	 * @param {String} [phoneNumber] The phone number of the subscriber
	 * @param {String} [channel] Optional channel of the inventory
	 *
	 */
	function checkAppEligibility(options) {
	  if (options && options.campaignId) {
	    var data = { apiVersion: 'v8' }
	    if(options.phoneNumber) {
	      data.phoneNumber = options.phoneNumber
	    }
	    if(options.channel) {
	      data.channel = options.channel
	    }
	    jsonp({
	      url: '//' + be + '/api/campaign/datarewards/eligibility/' + options.campaignId,
	      callbackName: 'jsonp',
	      data: data,
	      success: function(response) {
	        sharedCallback(response, options.callback)
	      }
	    })
	  }
	}

	/**
	 * Check eligibility for the current device
	 * Campaign id is used to determine configured reward, and operator
	 *
	 * @param {String} campaignId Aquto campaign id
	 * @param {function} callback Callback function on success or error
	 * @param {String} phoneNumber The phone number of the subscriber
	 *
	 */
	function checkVoucherEligibility(options) {
	  if (options && options.campaignId) {
	    var data = { apiVersion: 'v8', campaignId: options.campaignId }
	    if(options.phoneNumber) {
	      data.phoneNumber = options.phoneNumber
	    }
	    jsonp({
	      url: '//' + be + '/api/datarewards/voucher/eligibility',
	      callbackName: 'jsonp',
	      data: data,
	      success: function(response) {
	        sharedCallback(response, options.callback)
	      }
	    })
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
	    var data = { apiVersion: 'v8' }
	    if(options.userToken) {
	      data.userToken = options.userToken
	    }
	    jsonp({
	      url: '//' + be + '/api/campaign/datarewards/applyreward/'+options.campaignId,
	      callbackName: 'jsonp',
	      data: data,
	      success: function(response) {
	        sharedCallback(response, options.callback)
	      }
	    })
	  }
	}

	/**
	 * Redeem a voucher for an eligible user
	 * Campaign id is used to link with existing checkVoucherEligibility
	 *
	 * @param {String} callback Callback function on success or error
	 * @param {String} code Voucher code
	 * @param {String} [userToken] User identifier received from eligibility request can be used instead of a phone number
	 * @param {String} [phoneNumber] The phone number of the subscriber.
	 *
	 */
	function redeemVoucher(options) {
	  if (options && options.code) {
	    var data = { apiVersion: 'v8', code: options.code }
	    if(options.userToken) {
	      data.userToken = options.userToken
	    }
	    if(options.phoneNumber) {
	      data.phoneNumber = options.phoneNumber
	    }
	    jsonp({
	      url: '//' + be + '/api/datarewards/voucher/reward',
	      callbackName: 'jsonp',
	      data: data,
	      success: function(response) {
	        voucherCallback(response, options.callback)
	      }
	    })
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
	moveRewards.VERSION = '0.1.0'

	// assign eligibility static methods
	moveRewards.genericCheckEligibility = genericCheckEligibility
	moveRewards.checkEligibility = checkEligibility
	moveRewards.checkEligibilitySinglePage = checkAppEligibility
	moveRewards.checkAppEligibility = checkAppEligibility
	moveRewards.checkVoucherEligibility = checkVoucherEligibility
	moveRewards.checkOfferWallEligibility = checkOfferWallEligibility

	// assign redemption static methods
	moveRewards.complete = complete
	moveRewards.redeemVoucher = redeemVoucher

	// helper functions
	moveRewards.utils = utils

	/*--------------------------------------------------------------------------*/

	module.exports = moveRewards


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
	    if (options == null) {
	      options = {};
	    }
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
	        var ref, ref1;
	        if (done || ((ref = this.readyState) !== 'loaded' && ref !== 'complete')) {
	          return;
	        }
	        done = true;
	        if (script) {
	          script.onload = script.onreadystatechange = null;
	          if ((ref1 = script.parentNode) != null) {
	            ref1.removeChild(script);
	          }
	          return script = null;
	        }
	      };
	      head = window.document.getElementsByTagName('head')[0] || window.document.documentElement;
	      head.insertBefore(script, head.firstChild);
	    }
	    return {
	      abort: function() {
	        window[callback] = function() {
	          return window[callback] = null;
	        };
	        done = true;
	        if (script != null ? script.parentNode : void 0) {
	          script.onload = script.onreadystatechange = null;
	          script.parentNode.removeChild(script);
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
	      str += random().toString(36).slice(2, 3);
	    }
	    return str;
	  };

	  objectToURI = function(obj) {
	    var data, key, value;
	    data = (function() {
	      var results;
	      results = [];
	      for (key in obj) {
	        value = obj[key];
	        results.push(encode(key) + '=' + encode(value));
	      }
	      return results;
	    })();
	    return data.join('&');
	  };

	  if ("function" !== "undefined" && __webpack_require__(3) !== null ? __webpack_require__(4) : void 0) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return JSONP;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
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

/***/ },
/* 5 */
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
	  else if (operatorCode === 'movirw') {
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


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Creates and loads an image element in order to determine of a user is online or offline
	 * @param  {Function} callback - returns a boolean to determine if the user is online or offline
	 */
	function isOnline(callback) {
	  var url = '//d1y0qivfpuylge.cloudfront.net/images/pixel.gif'
	  var img = new Image()
	  img.onload = function() { callback(true) }
	  img.onerror = function() { callback(false) }
	  img.src = url + '?rcb=' + Math.floor((1 + Math.random()) * 0x10000).toString(16)
	}

	/**
	 * Format reward amount
	 * Adds MB or GB as broadway-devropriate
	 *
	 * @param {Integer} rewardAmount Reward amount in MB
	 *
	 */
	function formatData(rewardAmount) {
	  var dataNum = rewardAmount
	  var dataLabel = 'MB'
	  if (dataNum > 9999) {
	    dataNum = Math.floor(dataNum/1024)
	    dataLabel = 'GB'
	  }
	  return dataNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + dataLabel
	}

	/**
	 *
	 *
	 */
	function parseScriptQuery(scriptTag) {
	  var args = {}
	  if (scriptTag) {
	    var query = scriptTag.src.replace(/^[^\?]+\??/,'')

	    var vars = query.split("&")
	    for (var i=0; i<vars.length; i++) {
	      var pair = vars[i].split("=")
	      // decodeURI doesn't expand "+" to a space.
	      args[pair[0]] = decodeURI(pair[1]).replace(/\+/g, ' ')
	    }
	  }
	  return args
	}

	module.exports = {
	  isOnline: isOnline,
	  formatData: formatData,
	  _parseScriptQuery: parseScriptQuery
	}


/***/ }
/******/ ]);