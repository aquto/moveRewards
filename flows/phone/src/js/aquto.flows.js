/** instantiate moveRewards object */
let moveRewards = {};
let data = {};
let targetOrigin;
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
    appendLoadingOverlay(options.targetId);
    const phoneNumber = options.phoneNumber;
    const iFrames = document.getElementsByTagName('iframe');
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'block';
    aquto.checkAppEligibility({
        campaignId: options.campaignId,
        phoneNumber: phoneNumber,
        channel: options.channel,
        publisherSiteUuid: options.publisherSiteUuid,
        callback: function(response) {
            if (response){
                createPostMessageData('aq.handleIframeDOM', response, options, 'success');
                if (iFrames.length === 0) {
                    injectIframe(options);
                } else {
                    sendMessageToIframe(JSON.stringify(data), targetOrigin);
                }
            } else {
                createPostMessageData('aq.handleIframeDOM', response, options, 'error');
                if (iFrames.length === 0) {
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
        iframeTag.src = '//assets.aquto.com/moveRewards/flows/phone/tag/v1.html'; // 'v1.html' test locally
        iframeTag.name = "aqutoIframe";
        iframeTag.style.border = "none";
        iframeTag.style.position = "absolute";
        iframeTag.style.backgroundColor = "#fff";
    return iframeTag
}

function setIframeSize(iframeEl, targetId){

    const targetElementId = typeof targetId === 'string' ? targetId : targetId.id;
    const targetEl = document.querySelector("#" + targetElementId);
    // Inner Div that wraps img element
    const wrapperEl = targetEl.getElementsByTagName('div')[0];

    // Calculating actual rendered values for Target Tag's Width and Height in case they are NOT set by CSS.
    // If these values are lower than iframes's minWidth or minHeight, they will be set by default.
    const iframeWidth = wrapperEl.scrollWidth < parseInt(iframeEl.minWidth.substring(0,3)) ? parseInt(iframeEl.minWidth.substring(0,3)) : wrapperEl.scrollWidth;
    const iframeHeight = wrapperEl.scrollHeight < parseInt(iframeEl.minHeight.substring(0,3)) ? parseInt(iframeEl.minHeight.substring(0,3)) : wrapperEl.scrollHeight;
    iframeEl.style.width = iframeWidth + "px";
    iframeEl.style.height = iframeHeight + "px";

    return {targetEl, iframeEl}
}

function appendIframeToTarget(DOMElements){
    DOMElements.targetEl && DOMElements.targetEl.appendChild(DOMElements.iframeEl);
}

/*--------------------------- END IFRAME CONSTRUCTOR -----------------------------------------------*/

// Returns loadingOverlay element
function createLoadingOverlay(wrapperEl){

    // Spinner Image
    let loadingImgElement = document.createElement('img');
    loadingImgElement.src = '../src/assets/images/loader.gif';
    loadingImgElement.style.float = 'right';
    loadingImgElement.style.marginRight = '10px';
    loadingImgElement.style.marginTop = '10px';

    let loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.width = wrapperEl.scrollWidth + 'px';
    loadingOverlay.style.height = wrapperEl.scrollHeight + 'px';
    loadingOverlay.style.minWidth = '250px';
    loadingOverlay.style.minHeight = '300px';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.zIndex = '20';
    loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    loadingOverlay.style.cursor = 'default';
    loadingOverlay.style.position = 'absolute';
    loadingOverlay.style.display = 'none';
    loadingOverlay.appendChild(loadingImgElement);

    return loadingOverlay;

}

function appendLoadingOverlay(targetId){
    const targetElementId = typeof targetId === 'string' ? targetId : targetId.id;
    const targetEl = document.querySelector("#" + targetElementId);
    const wrapperEl = targetEl.getElementsByTagName('div')[0];
    wrapperEl.appendChild(createLoadingOverlay(wrapperEl));
}


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
    const iFrame = document.getElementsByTagName('iframe')[0];
    if (iFrame){
        const iFrameSrc = iFrame.src;
        if(iFrameSrc.includes(e.origin)){
            targetOrigin = e.origin;
            // Once iFrame is loaded send data (checkAppEligibility Response and user Options) to iFrame
            if(eventName === 'aq.iframeLoaded'){
                const loadingOverlay = document.getElementById('loadingOverlay');
                loadingOverlay.style.display = 'none';
                sendMessageToIframe(JSON.stringify(data), targetOrigin);
            }

            // Call userCallback method when iFrame postMessage "triggerOnComplete"
            if(eventName === 'aq.triggerOnComplete'){
                const redirectUrl = e.data.finalUrl;
                iFrame.parentNode.removeChild(iFrame)
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





