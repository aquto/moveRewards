/**
 * Check eligibility for the current device
 * Campaign id is used to determine configured reward, and operator
 *
 * @param {String} campaignId Aquto campaign id
 * @param {function} callback Callback function on success or error
 * @param {String} [phoneNumber] The phone number of the subscriber
 *
 */

(function(win, doc){
    let moveRewards = {};
    let data = {};
    let targetOrigin;
    let iframeTag;

    function checkAppEligibilityPhoneEntry(options) {
        appendLoadingOverlay(options.targetId);
        const phoneNumber = options.phoneNumber;
        const targetId = typeof options.targetId === 'string' ? options.targetId : options.targetId.id;
        const loadingOverlay = doc.getElementById('overlay_' + targetId);
        loadingOverlay.style.display = 'block';
        aquto.checkAppEligibility({
            campaignId: options.campaignId,
            phoneNumber: phoneNumber,
            channel: options.channel,
            publisherSiteUuid: options.publisherSiteUuid,
            callback: function(response) {
                if (response){
                    createPostMessageData('aq.handleIframeDOM', response, options, targetId);
                    !iframeExists(targetId) && injectIframe(options)
                }
            }
        });
    }

    function injectIframe(options){
        iframeTag = appendIframeToTarget(setIframeSize(createIframeTag(options.targetId), options.targetId));
    }

    // Create PostMessage Object
    function createPostMessageData(id, response, options, iframeRef){
        data.id = id;
        data.response = response;
        data.options = options;
        data.sPageURL = win.location.search.substring(1);
        data.parentSrc = win.location.origin;
        data.iframeRef = iframeRef;
    }

    // Adding PostMessages Event Listener
    bindEvent(win, 'message', function (e) {
        const eventName = e.data.eventName;
        const iframeRef = e.data.iframeRef;
        if (iframeTag){
            const iFrameSrc = iframeTag.src;
            if(iFrameSrc.includes(e.origin)){
                targetOrigin = e.origin;
                // Once iFrame is loaded send data (checkAppEligibility Response and user Options) to iFrame
                if(eventName === 'aq.iframeLoaded'){
                    const loadingOverlay = doc.getElementById('overlay_' + iframeRef);
                    loadingOverlay.style.display = 'none';
                    sendMessageToIframe(JSON.stringify(data), targetOrigin, iframeRef);
                }

                // Call userCallback method when iFrame postMessage "triggerOnComplete"
                if(eventName === 'aq.triggerOnComplete'){
                    const redirectUrl = e.data.finalUrl;
                    iframeTag.parentNode.removeChild(iframeTag)
                    data.options.onComplete({redirectUrl});
                }
            }
        }
    });

    moveRewards.VERSION = '0.1.0';
    moveRewards.checkAppEligibilityPhoneEntry = checkAppEligibilityPhoneEntry;
    module.exports = moveRewards;

})(window, document);

function iframeExists(targetId){
    for(var i=0;i<window.frames.length;i++){
        if (window.frames[i].name === targetId) return true
    }
    return false
}

// Creates and returns iframeTag
function createIframeTag(targetId){
    const iframeEl = document.createElement('iframe');
    iframeEl.minWidth = '250px';
    iframeEl.minHeight = '300px';
    iframeEl.src = 'v1.html'; // '//assets.aquto.com/moveRewards/flows/phone/tag/v1.html'; // 'v1.html' test
    // locally
    iframeEl.name = typeof targetId === 'string' ? targetId : targetId.id;
    iframeEl.style.border = "none";
    iframeEl.style.position = "absolute";
    iframeEl.style.top = 0;
    iframeEl.style.left = 0;
    iframeEl.style.backgroundColor = "#fff";
    return iframeEl
}

// Set iframe width and height, returns Object with iframeEl and targetEl
function setIframeSize(iframeEl, targetId){

    const targetEl = typeof targetId === 'string' ? document.querySelector("#" + targetId) : targetId;

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
    return DOMElements.iframeEl;
}

// Returns loadingOverlay element
function createLoadingOverlay(targetEl){
    // Spinner Image
    let loadingImgElement = document.createElement('img');
    loadingImgElement.src = '../assets/images/loader.gif';
    loadingImgElement.style.position = 'relative';
    loadingImgElement.style.left = '50%';
    loadingImgElement.style.top = '50%';
    loadingImgElement.style.marginLeft = '-16px';
    loadingImgElement.style.marginTop = '-16px';

    let loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'overlay_' + targetEl.id;
    loadingOverlay.style.width = targetEl.scrollWidth + 'px';
    loadingOverlay.style.height = targetEl.scrollHeight + 'px';
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
    const targetEl = typeof targetId === 'string' ? document.querySelector("#" + targetId) : targetId;
    targetEl.appendChild(createLoadingOverlay(targetEl));
}

// PostMessage to Iframe
function sendMessageToIframe(message, targetOrigin, iframeRef){
    window.frames[iframeRef].postMessage(message, targetOrigin);
}

// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener){
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
    }
}

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





