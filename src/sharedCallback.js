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
  if (callback && typeof callback === 'function') {
    var callbackObject;

    if (response && response.response && response.response.eligible) {
      callbackObject = {
        eligible: true,
        rewardAmount: response.response.rewardAmountMB,
        userToken: response.response.userToken
      }

      var operatorInfo = getOperatorInfo(response.response.operatorCode)
      callbackObject.carrier = operatorInfo.operatorCode
      callbackObject.carrierName = operatorInfo.operatorName

      var rewardText
      if (response.response.displayText) {
        var rewardAmountFormatted = response.response.rewardAmountMB ? response.response.rewardAmountMB + '\xa0MB' : ''
        rewardText = response.response.displayText

        rewardText = rewardText.replace('$$operator$$', operatorInfo.operatorName)
        rewardText = rewardText.replace('$$rewardAmount$$', rewardAmountFormatted)
      }
      callbackObject.rewardText = rewardText

      if (response.response.offerUrl) {
        callbackObject.clickUrl = response.response.offerUrl
      }

    } else {
      callbackObject = {
        eligible: false,
        identified: !!(response.response && response.response.operatorCode !== 'unknown')
      }
    }

    callback(callbackObject)
  }
}

function prepareCompleteCallback(response) {
  var callbackObject;

  if (response && response.response) {
    callbackObject = {
      success: !!response.response.successful,
      status: response.response.status,
      rewardAmount: response.response.rewardAmountMB
    }

    var operatorInfo = getOperatorInfo(response.response.operatorCode)
    callbackObject.carrier = operatorInfo.operatorCode
    callbackObject.carrierName = operatorInfo.operatorName
  } else {
    callbackObject = {
      success: false,
      status: 'generalerror'
    }
  }

  return callbackObject
}

/**
 * Prepares the reward response to be returned and fires callback
 *
 * @param {Object} response JSON response from server
 * @param {Object} callback Optional callback to be fired after response from server
 *
 */
function completeCallback(response, callback) {
  if (callback && typeof callback === 'function') {
    callback(prepareCompleteCallback(response))
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
  if (callback && typeof callback === 'function') {
    var callbackObject = prepareCompleteCallback(response)

    // Group some statuses into ineligible
    switch (response.response.status) {
      case 'unabletoidentify':
      case 'ineligible':
      case 'unabletoconvert':
      case 'generalerror':
        callbackObject.status = 'ineligible'
        break
      // NOTE: default status can be 'voucherinvalid', 'voucherexpired', or 'voucheralreadyredeemed'
    }

    callback(callbackObject)
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
  else if (
    operatorCode === 'movirw' ||
    operatorCode === 'moviperw'
  ) {
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
  }
  else if (operatorCode === 'oibrrw'){
    operatorName = 'Oi'
    operatorCode = 'oibr'
  } else {
    operatorName = 'N/A'
    operatorCode = 'na'
  }

  return {
    operatorCode: operatorCode,
    operatorName: operatorName
  }
}


module.exports = {
  sharedCallback: sharedCallback,
  voucherCallback: voucherCallback,
  completeCallback: completeCallback
}
