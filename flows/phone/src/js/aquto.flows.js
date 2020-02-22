/** instantiate moveRewards object */
let moveRewards = {};
let data = {};
let targetOrigin;
const iframeId = 'iframe-01';

/**
 * Check eligibility for the current device
 * Campaign id is used to determine configured reward, and operator
 *
 * @param {String} campaignId Aquto campaign id
 * @param {function} callback Callback function on success or error
 * @param {String} [phoneNumber] The phone number of the subscriber
 *
 */

function checkAppEligibilityPhoneEntry(options) {
    const phoneNumber = options.phoneNumber;
    aquto.checkAppEligibility({
        campaignId: options.campaignId,
        phoneNumber: phoneNumber,
        callback: function(response) {
            if (response){
                if (!response.identified){
                    response.identified = !!(response.eligible && response.operatorCode !== 'unknown');
                }
                // Create Message Content containing Response and Options Objects, and the response status.
                createPostMessageData('aq.handleIframeDOM', response, options, 'success');
                if (!document.getElementById(iframeId)) {
                    injectIframe(options);
                } else {
                    sendMessageToIframe(JSON.stringify(data), targetOrigin);
                }
            } else {
                createPostMessageData('aq.handleIframeDOM', response, options, 'error');
                if (!document.getElementById(iframeId)) {
                    injectIframe(options);
                } else {
                    sendMessageToIframe(JSON.stringify(data));
                }
            }
        }
    });
}

/*--------------------------------------------------------------------------*/

moveRewards.VERSION = '0.1.0';
moveRewards.checkAppEligibilityPhoneEntry = checkAppEligibilityPhoneEntry;
module.exports = moveRewards;

/*--------------------------- IFRAME CONSTRUCTOR -----------------------------------------------*/
function injectIframe(options){
    appendIframeToTarget(setIframeSize(createIframeTag(), options.targetId));
}

function createIframeTag(){

    let iframeTag = document.createElement('iframe');
        iframeTag.minWidth = '250px';
        iframeTag.minHeight = '300px';
        iframeTag.src = "../../iframeContent.html";
        iframeTag.id = "iframe-01";
        iframeTag.name = "aqutoIframe";
        iframeTag.style.border = "none";
        iframeTag.style.position = "absolute";
        iframeTag.style.backgroundColor = "#fff";
    return iframeTag
}

function setIframeSize(iframeEl, targetId){

    const targetElementId = typeof targetId === 'string' ? targetId : targetId.id;
    const targetEl = document.querySelector("#" + targetElementId);

    // Calculating actual rendered values for Target Tag's Width and Height in case they are NOT set by CSS.
    // If these values are lower than iframes's minWidth or minHeight, they will be set by default.
    const iframeWidth = targetEl.scrollWidth < parseInt(iframeEl.minWidth.substring(0,3)) ? parseInt(iframeEl.minWidth.substring(0,3)) : targetEl.scrollWidth;
    const iframeHeight = targetEl.scrollHeight < parseInt(iframeEl.minHeight.substring(0,3)) ? parseInt(iframeEl.minHeight.substring(0,3)) : targetEl.scrollHeight;
    iframeEl.style.width = iframeWidth + "px";
    iframeEl.style.height = iframeHeight + "px";

    return {targetEl, iframeEl}
}

function appendIframeToTarget(DOMElements){
    DOMElements.targetEl && DOMElements.targetEl.appendChild(DOMElements.iframeEl);
}

/*--------------------------- END IFRAME CONSTRUCTOR -----------------------------------------------*/


// Create PostMessage Object
function createPostMessageData(id, response, options, status){
    data.id = id;
    data.response = response;
    data.options = options;
    data.status = status;
    data.sPageURL = window.location.search.substring(1);
    data.parentSrc = window.location.origin;
}

// PostMessage to Iframe
function sendMessageToIframe(message, targetOrigin){
    window.frames.aqutoIframe.postMessage(message, targetOrigin);
}

// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener){
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
    }
}

// Adding PostMessages Event Listener
bindEvent(window, 'message', function (e) {
    const eventName = e.data.eventName;

    if (document.getElementById(iframeId)){
        const iFrameSrc = document.getElementById(iframeId).src;
        if(iFrameSrc.includes(e.origin)){
            targetOrigin = e.origin;
            // Once iFrame is loaded send data (checkAppEligibility Response and user Options) to iFrame
            if(eventName === 'aq.iframeLoaded'){
                sendMessageToIframe(JSON.stringify(data), targetOrigin);
            }

            // Call checkAppEligibilityPhoneEntry method when iFrame postMessage "submitPhoneEntryForm"
            if(eventName === 'aq.validatePhoneNumber'){
                const prevOptions = data.options;
                const options = Object.assign(e.data.options, prevOptions);
                checkAppEligibilityPhoneEntry(options);
            }

            // Call userCallback method when iFrame postMessage "triggerOnComplete"
            if(eventName === 'aq.triggerOnComplete'){
                const redirectUrl = e.data.finalUrl;
                data.options.onComplete({redirectUrl});
            }
        }
    }
});

// String.prototype.polyfill
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';

        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
    };
}







