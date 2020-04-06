var aqutoFlows =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./flows/phone/src/js/aquto.flows.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./flows/phone/src/js/aquto.flows.js":
/*!*******************************************!*\
  !*** ./flows/phone/src/js/aquto.flows.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Check eligibility for the current device\n * Campaign id is used to determine configured reward, and operator\n *\n * @param {String} campaignId Aquto campaign id\n * @param {function} callback Callback function on success or error\n * @param {String} [phoneNumber] The phone number of the subscriber\n *\n */\n\n(function(win, doc){\n    let moveRewards = {};\n    let data = {};\n    let targetOrigin;\n    let iframeTag;\n\n    function checkAppEligibilityPhoneEntry(options) {\n        appendLoadingOverlay(options.targetId);\n        const phoneNumber = options.phoneNumber;\n        const targetId = typeof options.targetId === 'string' ? options.targetId : options.targetId.id;\n        const loadingOverlay = doc.getElementById('overlay_' + targetId);\n        loadingOverlay.style.display = 'block';\n        aquto.checkAppEligibility({\n            campaignId: options.campaignId,\n            phoneNumber: phoneNumber,\n            channel: options.channel,\n            publisherSiteUuid: options.publisherSiteUuid,\n            callback: function(response) {\n                if (response){\n                    createPostMessageData('aq.handleIframeDOM', response, options, targetId);\n                    !iframeExists(targetId) && injectIframe(options)\n                }\n            }\n        });\n    }\n\n    function injectIframe(options){\n        iframeTag = appendIframeToTarget(setIframeSize(createIframeTag(options.targetId), options.targetId));\n    }\n\n    // Create PostMessage Object\n    function createPostMessageData(id, response, options, iframeRef){\n        data.id = id;\n        data.response = response;\n        data.options = options;\n        data.sPageURL = win.location.search.substring(1);\n        data.parentSrc = win.location.origin;\n        data.iframeRef = iframeRef;\n    }\n\n    // Adding PostMessages Event Listener\n    bindEvent(win, 'message', function (e) {\n        const eventName = e.data.eventName;\n        const iframeRef = e.data.iframeRef;\n        if (iframeTag){\n            const iFrameSrc = iframeTag.src;\n            if(iFrameSrc.includes(e.origin)){\n                targetOrigin = e.origin;\n                // Once iFrame is loaded send data (checkAppEligibility Response and user Options) to iFrame\n                if(eventName === 'aq.iframeLoaded'){\n                    const loadingOverlay = doc.getElementById('overlay_' + iframeRef);\n                    loadingOverlay.style.display = 'none';\n                    sendMessageToIframe(JSON.stringify(data), targetOrigin, iframeRef);\n                }\n\n                // Call userCallback method when iFrame postMessage \"triggerOnComplete\"\n                if(eventName === 'aq.triggerOnComplete'){\n                    const redirectUrl = e.data.finalUrl;\n                    iframeTag.parentNode.removeChild(iframeTag)\n                    data.options.onComplete({redirectUrl});\n                }\n            }\n        }\n    });\n\n    moveRewards.VERSION = '0.1.0';\n    moveRewards.checkAppEligibilityPhoneEntry = checkAppEligibilityPhoneEntry;\n    module.exports = moveRewards;\n\n})(window, document);\n\nfunction iframeExists(targetId){\n    for(var i=0;i<window.frames.length;i++){\n        if (window.frames[i].name === targetId) return true\n    }\n    return false\n}\n\n// Creates and returns iframeTag\nfunction createIframeTag(targetId){\n    const iframeEl = document.createElement('iframe');\n    iframeEl.minWidth = '250px';\n    iframeEl.minHeight = '300px';\n    iframeEl.src = 'v1.html'; // '//assets.aquto.com/moveRewards/flows/phone/tag/v1.html'; // 'v1.html' test\n    // locally\n    iframeEl.name = typeof targetId === 'string' ? targetId : targetId.id;\n    iframeEl.style.border = \"none\";\n    iframeEl.style.position = \"absolute\";\n    iframeEl.style.top = 0;\n    iframeEl.style.left = 0;\n    iframeEl.style.backgroundColor = \"#fff\";\n    return iframeEl\n}\n\n// Set iframe width and height, returns Object with iframeEl and targetEl\nfunction setIframeSize(iframeEl, targetId){\n\n    const targetEl = typeof targetId === 'string' ? document.querySelector(\"#\" + targetId) : targetId;\n\n    // Calculating actual rendered values for Target Tag's Width and Height in case they are NOT set by CSS.\n    // If these values are lower than iframes's minWidth or minHeight, they will be set by default.\n    const iframeWidth = targetEl.scrollWidth < parseInt(iframeEl.minWidth.substring(0,3)) ? parseInt(iframeEl.minWidth.substring(0,3)) : targetEl.scrollWidth;\n    const iframeHeight = targetEl.scrollHeight < parseInt(iframeEl.minHeight.substring(0,3)) ? parseInt(iframeEl.minHeight.substring(0,3)) : targetEl.scrollHeight;\n    iframeEl.style.width = iframeWidth + \"px\";\n    iframeEl.style.height = iframeHeight + \"px\";\n\n    return {targetEl, iframeEl}\n}\n\nfunction appendIframeToTarget(DOMElements){\n    DOMElements.targetEl && DOMElements.targetEl.appendChild(DOMElements.iframeEl);\n    return DOMElements.iframeEl;\n}\n\n// Returns loadingOverlay element\nfunction createLoadingOverlay(targetEl){\n    // Spinner Image\n    let loadingImgElement = document.createElement('img');\n    loadingImgElement.src = '//assets.aquto.com/moveRewards/assets/images/loader.gif';\n    loadingImgElement.style.position = 'relative';\n    loadingImgElement.style.left = '50%';\n    loadingImgElement.style.top = '50%';\n    loadingImgElement.style.marginLeft = '-16px';\n    loadingImgElement.style.marginTop = '-16px';\n\n    let loadingOverlay = document.createElement('div');\n    loadingOverlay.id = 'overlay_' + targetEl.id;\n    loadingOverlay.style.width = targetEl.scrollWidth + 'px';\n    loadingOverlay.style.height = targetEl.scrollHeight + 'px';\n    loadingOverlay.style.minWidth = '250px';\n    loadingOverlay.style.minHeight = '300px';\n    loadingOverlay.style.top = '0';\n    loadingOverlay.style.left = '0';\n    loadingOverlay.style.zIndex = '20';\n    loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';\n    loadingOverlay.style.cursor = 'default';\n    loadingOverlay.style.position = 'absolute';\n    loadingOverlay.style.display = 'none';\n    loadingOverlay.appendChild(loadingImgElement);\n\n    return loadingOverlay;\n\n}\n\nfunction appendLoadingOverlay(targetId){\n    const targetEl = typeof targetId === 'string' ? document.querySelector(\"#\" + targetId) : targetId;\n    targetEl.appendChild(createLoadingOverlay(targetEl));\n}\n\n// PostMessage to Iframe\nfunction sendMessageToIframe(message, targetOrigin, iframeRef){\n    window.frames[iframeRef].postMessage(message, targetOrigin);\n}\n\n// addEventListener support for IE8\nfunction bindEvent(element, eventName, eventHandler) {\n    if (element.addEventListener){\n        element.addEventListener(eventName, eventHandler, false);\n    } else if (element.attachEvent) {\n        element.attachEvent('on' + eventName, eventHandler);\n    }\n}\n\n// String.prototype.polyfill\nif (!String.prototype.includes) {\n    String.prototype.includes = function(search, start) {\n        'use strict';\n\n        if (search instanceof RegExp) {\n            throw TypeError('first argument must not be a RegExp');\n        }\n        if (start === undefined) { start = 0; }\n        return this.indexOf(search, start) !== -1;\n    };\n}\n\n\n\n\n\n\n\n//# sourceURL=webpack://aqutoFlows/./flows/phone/src/js/aquto.flows.js?");

/***/ })

/******/ });