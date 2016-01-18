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
 * Check eligibility for the current device
 * Campaign id is used to determine configured reward, and operator
 *
 * @param {String} campaignId Aquto campaign id
 * @param {function} callback Callback function on success or error
 *
 */
function checkEligibility(options) {
  jsonp({
    url: 'http://localhost:3000/move/checkEligibility',
    data: { campaignId: options.campaignId },
    callbackName: 'jsonp',
    success: function(response) {
      if (options.callback &&  typeof options.callback === 'function') {
        var operatorName;
        var operatorCode;
        if (response.operator && response.operator.code === 'attmb') {
          operatorName = "AT&T";
          operatorCode = 'att';
        }
        else if (response.operator && response.operator.code === 'vzwmb') {
          operatorName = "Verizon Wireless";
          operatorCode = 'vzw';
        }
        else {
          return;
        }

        var rewardText;
        if (response.displayText) {
          var rewardAmountFormatted;
          if (response.rewardAmount) {
            rewardAmountFormatted = response.rewardAmount + 'MB';
          }
          else {
            return;
          }
          rewardText = response.displayText;

          rewardText = rewardText.replace('$$operator$$', operatorName);
          rewardText = rewardText.replace('$$rewardAmount$$', rewardAmountFormatted);

        }

        options.callback({
          eligible: response.eligible,
          rewardAmount: response.rewardAmount,
          carrier: operatorCode,
          rewardText: rewardText
        });
      }      
    }
  });
  // setTimeout(function(){
  //   if (options.callback &&  typeof options.callback === 'function') {
  //     options.callback({
  //       eligible: true,
  //       rewardAmount: 1024,
  //       carrier: 'att',
  //       rewardText: 'Purchase any subscription and get 1GB added to your AT&T data plan.'
  //     });
  //   }

  // },1000);
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
  jsonp({
    url: 'http://localhost:3000/move/complete',
    data: { campaignId: options.campaignId },
    callbackName: 'jsonp',
    success: function(response) {
      if (options.callback &&  typeof options.callback === 'function') {
        var operatorName;
        var operatorCode;
        if (response.operator && response.operator.code === 'attmb') {
          operatorName = "AT&T";
          operatorCode = 'att';
        }
        else if (response.operator && response.operator.code === 'vzwmb') {
          operatorName = "Verizon Wireless";
          operatorCode = 'vzw';
        }
        else {
          return;
        }

        var rewardText;
        if (response.displayText) {
          var rewardAmountFormatted;
          if (response.rewardAmount) {
            rewardAmountFormatted = response.rewardAmount + 'MB';
          }
          else {
            return;
          }
          rewardText = response.displayText;

          rewardText = rewardText.replace('$$operator$$', operatorName);
          rewardText = rewardText.replace('$$rewardAmount$$', rewardAmountFormatted);

        }

        options.callback({
          success: response.success,
          rewardAmount: response.rewardAmount,
          carrier: operatorCode,
          rewardText: rewardText
        });
      }      
    }
  });
  // setTimeout(function(){
  //   if (options.callback &&  typeof options.callback === 'function') {
  //     options.callback({
  //       success: true,
  //       rewardAmount: 1024,
  //       carrier: 'att',
  //       rewardText: 'You have received 1GB of mobile data for purchasing a subscription.'
  //     });
  //   }

  // },1000);
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
