/*!
 * Aquto Move Rewards v0.1.0 <http://aquto.com>
 */
'use strict';

var jsonp = require('browser-jsonp');

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
          rewardAmountFormatted = response.response.rewardAmountMB + 'MB';
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
      url: 'http://app.kickbit.com/api/campaign/datarewards/eligibility/'+options.campaignId,
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
