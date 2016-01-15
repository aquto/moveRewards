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
