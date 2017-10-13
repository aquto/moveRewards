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

      var operatorInfo = getOperatorInfo(response.response.operatorCode)
      if (!operatorInfo) {
        return;
      }
      callbackObject.carrier = operatorInfo.operatorCode;
      callbackObject.carrierName = operatorInfo.operatorName;

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

        rewardText = rewardText.replace('$$operator$$', operatorInfo.operatorName);
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
        eligible: false,
        identified: !(response.response.operatorCode === 'unknown')
      });
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
      };

      var operatorInfo = getOperatorInfo(response.response.operatorCode)
      if (!operatorInfo) {
        return;
      }
      callbackObject.carrier = operatorInfo.operatorCode;
      callbackObject.carrierName = operatorInfo.operatorName;

      callback(callbackObject);
    }
    else if (response && response.response && response.response.status) {
      var callbackObject = {
        success: false
      };

      if (response.response.status !== 'unabletoidentify') {
        var operatorInfo = getOperatorInfo(response.response.operatorCode)
        if (!operatorInfo) {
          return;
        }
        callbackObject.carrier = operatorInfo.operatorCode;
        callbackObject.carrierName = operatorInfo.operatorName;
      }

      var status;
      switch (response.response.status) {
        case 'unabletoidentify':
        case 'ineligible':
        case 'unabletoconvert':
        case 'generalerror':
          status = 'ineligible'
          break;
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
  var operatorName;

  if (
    operatorCode === 'attmb' ||
    operatorCode === 'attsim' ||
    operatorCode === 'attrw'
  ) {
    operatorName = "AT&T";
    operatorCode = 'att';
  }
  else if (operatorCode === 'vzwrw') {
    operatorName = "Verizon";
    operatorCode = 'vzw';
  }
  else if (operatorCode === 'vzwrw') {
    operatorName = "Verizon";
    operatorCode = 'vzw';
  }
  else if (operatorCode === 'movirw') {
    operatorName = "Movistar";
    operatorCode = 'movi';
  }
  else if (operatorCode === 'telcelrw') {
    operatorName = "Telcel";
    operatorCode = 'telcel';
  }
  else if (operatorCode === 'tigogtrw') {
    operatorName = 'Tigo';
    operatorCode = 'tigogt';
  } else {
    return;
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
