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
