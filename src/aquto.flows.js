/*!
 * Aquto Move Rewards v0.1.0 <http://aquto.com>
 */
'use strict'

var jsonp = require('browser-jsonp')
var sharedCallback = require('./sharedCallback').sharedCallback
var utils = require('./utils')

/** instantiate moveRewards object */
var moveRewards = {}

const baseUrl = (process.env.NODE_ENV === 'production') ? '//app.aquto.com/' : '//mp-dev.aquto.internal/'
// const baseUrl = '//mp-dev.aquto.internal/' // for testing only

/** Check if Aquto backend hostname has been passed in */
var scriptParams = utils._parseScriptQuery(document.getElementById('aquto-api'));
var be = scriptParams.be || 'app.aquto.com';
var modal;

/**
 * Start DOM Elements for Modal
 */
const loaderElement = '<div class="loader"></div>';
const phoneEntryElement = '<div class="row phoneEntry">\n' +
    '<form>' +
        '<div class="form-group">' +
            '<p>Para participar necesitamos validar tu número de teléfono</p>' +
            '<input type="tel" class="form-control" id="phoneNumber" placeholder="+528909899890">' +
        '</div>' +
    '</form>' +
    '</div>';

const messageElement = '<div class="row messageWrapper">\n' +
    '      <div class="col-sm-6 offset-sm-3 text-center">\n' +
    '          <h2 class="success_title">Tu número participa para <span id="amount_reward"></span></h2>\n' +
    '          <h2 class="error_title">Lo sentimos tu número no participa para ganar megas.</h2>\n' +
    '          <p class="check_icon_holder">\n' +
    '            <i class="fa fa-check-circle fa-4x fa_with_bg" aria-hidden="true"></i>\n' +
    '          </p>\n' +
    '        <p class="warning_icon_holder">\n' +
    '          <i class="fa fa-exclamation-circle fa-4x fa_with_bg" aria-hidden="true"></i>\n' +
    '        </p>\n' +
    '      <div class="redirect_btn_wrapper">\n' +
    '          <p>Redireccion en <span class="countdown" id="5"></span></p>\n' +
    '          <button type="button" class="btn btn-success continueBtn">Continuar</button>\n' +
    '      </div>\n' +
    '      </div>\n' +
    '    </div>';

const contentWrapper = '<div class="container center">' + loaderElement + phoneEntryElement + messageElement + '</div>';

/** End DOM Elements for Modal **/

/** Start DOM Manipulation Functions **/
function showLoader(){
    const loaderEl = $(".loader");
    loaderEl && loaderEl.css('display', 'block');
}

function hideLoader(){
    const loaderEl = $(".loader");
    loaderEl && loaderEl.css('display', 'none');
}

function showPhoneEntryForm(identified, clickUrl, clickId, rewardAmount){
    const phoneEntryEl = $(".phoneEntry");
    const modalContentEl = $(".jBox-content");
    const cancelButton = $('.jBox-Confirm-button-cancel');
    const submitButton = $('.jBox-Confirm-button-submit');
    cancelButton.text('No, Gracias');
    cancelButton.unbind('click');
    submitButton.unbind('click');
    cancelButton.click(function(){
        modal.close();
    });
    if(identified === false){
        submitButton.click(function(){
            hidePhoneEntryForm();
            const formatedRewardAmount = utils.formatData(rewardAmount);
            $('#amount_reward').text(formatedRewardAmount);
            showMessageEl(true);
            $('.jBox-closeButton').css('display', 'none');
            $('.continueBtn').click(function(){
                redirectToTarget(clickUrl, clickId)
            });
            startTimer(5, clickUrl, clickId);
        });
    } else{
        submitButton.click(function(){
            checkAppEligibility({campaignId})
        });
    }

    modalContentEl && phoneEntryEl.css('display', 'block');
}

function hidePhoneEntryForm(){
    const phoneEntryEl = $(".phoneEntry");
    const cancelButton = $('.jBox-Confirm-button-cancel');
    const submitButton = $('.jBox-Confirm-button-submit');
    cancelButton.unbind('click');
    submitButton.unbind('click');
    phoneEntryEl.css('display', 'none');
}

function showMessageEl(success, clickUrl, clickId){
    const cancelButton = $('.jBox-Confirm-button-cancel');
    const submitButton = $('.jBox-Confirm-button-submit');
    const modalContentEl = $('.jBox-content');
    const successTitle = $('.success_title');
    const errorTitle = $('.error_title');
    const successIcon = $('.check_icon_holder');
    const errorIcon = $('.warning_icon_holder');
    const redirectButton = $('.redirect_btn_wrapper');
    const messageEl = $(".messageWrapper");

    if (success){
        successTitle.css('display', 'block');
        successIcon.css('display', 'block');
        errorTitle.css('display', 'none');
        errorIcon.css('display', 'none');
        cancelButton.css('display', 'none');
        submitButton.css('display', 'none');
        redirectButton.css('display', 'block');

    } else {
        successTitle.css('display', 'none');
        successIcon.css('display', 'none');
        redirectButton.css('display', 'none');
        errorTitle.css('display', 'block');
        errorIcon.css('display', 'block');
        cancelButton.text('Continuar sin ganar megas');
        cancelButton.click(function(){
            redirectToTarget(clickUrl, clickId);
            modal.close();
        });
        submitButton.text('Validar número');
        submitButton.click(function(){
            clearModalContent();
            showPhoneEntryForm();
        });
    }

    modalContentEl && messageEl.css('display', 'block');
}

function clearModalContent(){
    $('.loader, .phoneEntry, .messageWrapper').css('display', 'none');
    $('#phoneNumber').val('');
}

/** End DOM Manipulation Functions **/

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

function startTimer(duration, clickUrl, clickId){
    var timer = duration, seconds;
    const display = document.querySelector('.countdown');
    var countdown = setInterval(function () {
        seconds = parseInt(timer % 60, 10);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = "00:" + seconds;

        if (--timer < 0) {
            clearInterval(countdown);
            return redirectToTarget(clickUrl, clickId)
        }
    }, 1000);
}

function getFinalUrl(clickUrl, clickId) {
    // Use passed URL and fallback to URL in query and replace clickId
    if (clickUrl){
        return clickUrl.replace("$$clickId$$", clickId || '')
    }
    if(targetUrl){
        return targetUrl.replace("$$clickId$$", clickId || '')
    }

    alert('invalidconfig')
}

function redirectToTarget(clickUrl, clickId) {
    const finalUrl = getFinalUrl(clickUrl, clickId)

    if (debug === '0'){
        window.location.href = finalUrl
    } else {
        console.log('Redirecting to', finalUrl)
    }
}

function testOverride(response, isAutoIdentify){

    if (eligibilityTest === null) {
        return response
    }
    // If comma separated then first is for auto identify and second is for phone entry
    const parts = eligibilityTest.split(',')
    const testValue = (parts.length > 1 && !isAutoIdentify) ? parts[1] : parts[0]

    var overrideResponse = {
        identified: false,
        eligible: false,
        status: '',
        clickId: '',
        clickUrl: '',
        rewardAmount: ''
    }

    switch (testValue) {
        case 'e': // Eligible (with clickId)
        case 'eu': // Eligible (with clickUrl)
        case 'ec': // Eligible (with clickId)
            overrideResponse.identified = true
            overrideResponse.eligible = true
            overrideResponse.status = 'eligible'
            overrideResponse.clickId = (testValue === 'ec') ? 'test-click-123' : null
            overrideResponse.clickUrl = (testValue === 'eu') ? 'http://www.aquto.com/?ri=test-offer-id' : null
            break

        case 'i': // Ineligible
        case 'io': // Ineligible (status ineligibleop)
        case 'iu': // Ineligible (with clickUrl)
            overrideResponse.identified = true
            overrideResponse.eligible = false
            overrideResponse.status = (testValue === 'io') ? 'ineligibleop' : 'campnotavail'
            overrideResponse.clickId = null
            overrideResponse.clickUrl = (testValue === 'iu') ? 'http://www.aquto.com/?ri=test-offer-id' : null
            break

        case 'u': // Unidentified
            overrideResponse.identified = false
            overrideResponse.eligible = false
            overrideResponse.status = 'ineligiblenet'
            overrideResponse.clickId = null
            overrideResponse.clickUrl = null
            overrideResponse.rewardAmount = 20
            break

        default:
            return response
    }

    const updatedResponse = Object.assign(overrideResponse, response)

    return updatedResponse
}


// Get URL parameters
/*
psid - publisherSiteUuid
ch - channel
sid - advertiserId
idfa - IDFA
aid - Android ID
pid - publisherId
tid - publisherClickId
r - Redirect URL
etest - Eligibility test (ec: El
debug - Debug flag
ai - Auto identify (1=yes, 0=no)
cd - Country IP lookup (1=yes, 0=no)
t - theme selection (l = light, d = dark)
 */

const campaignIdStr =  getUrlParameter('campaignId') || ''
const publisherSiteUuid = getUrlParameter('psid')
const channel = getUrlParameter('ch')
const advertiserId = getUrlParameter('sid')
const idfa = getUrlParameter('idfa')
const aid = getUrlParameter('aid')
const publisherId = getUrlParameter('pid')
const publisherClickId = getUrlParameter('tid')
const targetUrl = getUrlParameter('r')
const eligibilityTest = getUrlParameter('etest') || null
const debug = getUrlParameter('debug')

const isAutoIdentify = true
var campaignId = ''



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
        var data = { apiVersion: 'v8' }
        if(options.phoneNumber) {
            data.phoneNumber = options.phoneNumber
        }
        if(options.channel) {
            data.channel = options.channel
        }
        if(options.publisherSiteUuid) {
            data.publisherSiteUuid = options.publisherSiteUuid
        }
        jsonp({
            url: baseUrl + 'api/campaign/datarewards/identifyandcheck/' + options.campaignId,
            callbackName: 'jsonp',
            data: data,
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
    campaignId = options.campaignId;
    showLoader();
    if (options && options.campaignId) {
        var data = { apiVersion: 'v8' }
        var error = options.error ? options.error : function() {}

        if(options.phoneNumber) {
            data.phoneNumber = options.phoneNumber
        }
        if(options.advertiserId) {
            data.advertiserId = options.advertiserId
        }
        if(options.userIdentifier) {
            data.userIdentifier = options.userIdentifier
        }
        if(options.publisherId) {
            data.publisherId = options.publisherId
        }
        if(options.publisherClickId) {
            data.publisherClickId = options.publisherClickId
        }
        if(options.ios_idfa) {
            data.ios_idfa = options.ios_idfa
        }
        if(options.android_aid){
            data.android_aid = options.android_aid
        }
        if(options.channel){
            data.channel = options.channel
        }
        if(options.publisherSiteUuid){
            data.publisherSiteUuid = options.publisherSiteUuid
        }
        jsonp({
            url: baseUrl + 'api/campaign/datarewards/eligibility/' + options.campaignId,
            callbackName: 'jsonp',
            data: data,
            success: function(resp) {
                const response = testOverride(resp, isAutoIdentify)
                // Eligible
                if (response.eligible) {
                    redirectToTarget(response.clickUrl, response.clickId)
                // Ineligible
                } else if (response.identified) {
                    modal.open();
                    hideLoader();
                    hidePhoneEntryForm(response.identified); // validate if exists
                    showMessageEl(false, response.clickUrl, response.clickId);
                    // If ineligible by operator, use that otherwise use 'ineligible' error message
                    // const status = ['ineligibleop'].includes(response.status) ? response.status : 'ineligible'
                // Unidentified (SHOW PHONE ENTRY)
                } else {
                    modal.open();
                    hideLoader();
                    showPhoneEntryForm(response.identified, response.clickUrl, response.clickId, response.rewardAmount);
                }

                // sharedCallback(response, handleResponse(response));
                sharedCallback(response, options.callback);
            },
            error: error
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

moveRewards.VERSION = '0.1.0'

// assign eligibility static methods
moveRewards.checkEligibility = checkEligibility
moveRewards.checkAppEligibilityPhoneEntry = checkAppEligibility

// helper functions
moveRewards.utils = utils

/*--------------------------------------------------------------------------*/

module.exports = moveRewards

// Modal Element definition
$( document ).ready(function() {
    modal = new jBox('Confirm', {
        width: 450,
        height: 250,
        closeButton: 'title',
        animation: false,
        title: 'Verificando Numero',
        content: contentWrapper,
        cancelButton: 'No, Gracias',
        confirmButton: 'Validar número',
        onOpen: function(){},
        onClose: function(){ clearModalContent()},
        confirm: function(){},
        closeOnConfirm: false,
    });
});

