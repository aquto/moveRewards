/*!
 * Aquto Move Rewards v0.1.0 <http://aquto.com>
 */
'use strict'

var jsonp = require('browser-jsonp')
var sharedCallback = require('./sharedCallback').sharedCallback
var voucherCallback = require('./sharedCallback').voucherCallback
var utils = require('./utils')

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
