/*!
 * Aquto Move Rewards v0.1.0 <http://aquto.com>
 */
'use strict';

var jsonp = require('browser-jsonp');
var sharedCallback = require('./sharedCallback');

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
    jsonp({
      url: '//app.kickbit.com/api/campaign/datarewards/identifyandcheck/'+options.campaignId,
      callbackName: 'jsonp',
      data: { apiVersion: 'v8' },
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
      url: '//app.kickbit.com/api/campaign/datarewards/eligibility/'+options.campaignId,
      callbackName: 'jsonp',
      data: { apiVersion: 'v8' },
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
    var data = { apiVersion: 'v8' }
    if(options.userToken) {
      data.userToken = options.userToken
    }
    jsonp({
      url: '//app.kickbit.com/api/campaign/datarewards/applyreward/'+options.campaignId,
      callbackName: 'jsonp',
      data: data,
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
moveRewards.checkEligibilitySinglePage = checkAppEligibility;
moveRewards.checkAppEligibility = checkAppEligibility;
moveRewards.complete = complete;

/*--------------------------------------------------------------------------*/

module.exports = moveRewards;
