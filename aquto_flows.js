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

eval("/** instantiate moveRewards object */\nlet moveRewards = {};\nlet data = {};\nlet targetOrigin;\n/**\n * Check eligibility for the current device\n * Campaign id is used to determine configured reward, and operator\n *\n * @param {String} campaignId Aquto campaign id\n * @param {function} callback Callback function on success or error\n * @param {String} [phoneNumber] The phone number of the subscriber\n *\n */\n\nfunction checkAppEligibilityPhoneEntry(options) {\n    appendLoadingOverlay(options.targetId);\n    const phoneNumber = options.phoneNumber;\n    const iFrames = document.getElementsByTagName('iframe');\n    const loadingOverlay = document.getElementById('loadingOverlay');\n    loadingOverlay.style.display = 'block';\n    aquto.checkAppEligibility({\n        campaignId: options.campaignId,\n        phoneNumber: phoneNumber,\n        channel: options.channel,\n        publisherSiteUuid: options.publisherSiteUuid,\n        callback: function(response) {\n            if (response){\n                createPostMessageData('aq.handleIframeDOM', response, options, 'success');\n                if (iFrames.length === 0) {\n                    injectIframe(options);\n                } else {\n                    sendMessageToIframe(JSON.stringify(data), targetOrigin);\n                }\n            } else {\n                createPostMessageData('aq.handleIframeDOM', response, options, 'error');\n                if (iFrames.length === 0) {\n                    injectIframe(options);\n                } else {\n                    sendMessageToIframe(JSON.stringify(data));\n                }\n            }\n        }\n    });\n}\n\n/*--------------------------------------------------------------------------*/\n\nmoveRewards.VERSION = '0.1.0';\nmoveRewards.checkAppEligibilityPhoneEntry = checkAppEligibilityPhoneEntry;\nmodule.exports = moveRewards;\n\n/*--------------------------- IFRAME CONSTRUCTOR -----------------------------------------------*/\nfunction injectIframe(options){\n    appendIframeToTarget(setIframeSize(createIframeTag(), options.targetId));\n}\n\nfunction createIframeTag(){\n\n    let iframeTag = document.createElement('iframe');\n        iframeTag.minWidth = '250px';\n        iframeTag.minHeight = '300px';\n        iframeTag.src = '//assets.aquto.com/moveRewards/flows/phone/tag/v1.html'; // 'v1.html' test locally\n        iframeTag.name = \"aqutoIframe\";\n        iframeTag.style.border = \"none\";\n        iframeTag.style.position = \"absolute\";\n        iframeTag.style.backgroundColor = \"#fff\";\n    return iframeTag\n}\n\nfunction setIframeSize(iframeEl, targetId){\n\n    const targetElementId = typeof targetId === 'string' ? targetId : targetId.id;\n    const targetEl = document.querySelector(\"#\" + targetElementId);\n    // Inner Div that wraps img element\n    const wrapperEl = targetEl.getElementsByTagName('div')[0];\n\n    // Calculating actual rendered values for Target Tag's Width and Height in case they are NOT set by CSS.\n    // If these values are lower than iframes's minWidth or minHeight, they will be set by default.\n    const iframeWidth = wrapperEl.scrollWidth < parseInt(iframeEl.minWidth.substring(0,3)) ? parseInt(iframeEl.minWidth.substring(0,3)) : wrapperEl.scrollWidth;\n    const iframeHeight = wrapperEl.scrollHeight < parseInt(iframeEl.minHeight.substring(0,3)) ? parseInt(iframeEl.minHeight.substring(0,3)) : wrapperEl.scrollHeight;\n    iframeEl.style.width = iframeWidth + \"px\";\n    iframeEl.style.height = iframeHeight + \"px\";\n\n    return {targetEl, iframeEl}\n}\n\nfunction appendIframeToTarget(DOMElements){\n    DOMElements.targetEl && DOMElements.targetEl.appendChild(DOMElements.iframeEl);\n}\n\n/*--------------------------- END IFRAME CONSTRUCTOR -----------------------------------------------*/\n\n// Returns loadingOverlay element\nfunction createLoadingOverlay(wrapperEl){\n\n    // Spinner Image\n    let loadingImgElement = document.createElement('img');\n    loadingImgElement.src = '../src/assets/images/loader.gif';\n    loadingImgElement.style.float = 'right';\n    loadingImgElement.style.marginRight = '10px';\n    loadingImgElement.style.marginTop = '10px';\n\n    let loadingOverlay = document.createElement('div');\n    loadingOverlay.id = 'loadingOverlay';\n    loadingOverlay.style.width = wrapperEl.scrollWidth + 'px';\n    loadingOverlay.style.height = wrapperEl.scrollHeight + 'px';\n    loadingOverlay.style.minWidth = '250px';\n    loadingOverlay.style.minHeight = '300px';\n    loadingOverlay.style.top = '0';\n    loadingOverlay.style.left = '0';\n    loadingOverlay.style.zIndex = '20';\n    loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';\n    loadingOverlay.style.cursor = 'default';\n    loadingOverlay.style.position = 'absolute';\n    loadingOverlay.style.display = 'none';\n    loadingOverlay.appendChild(loadingImgElement);\n\n    return loadingOverlay;\n\n}\n\nfunction appendLoadingOverlay(targetId){\n    const targetElementId = typeof targetId === 'string' ? targetId : targetId.id;\n    const targetEl = document.querySelector(\"#\" + targetElementId);\n    const wrapperEl = targetEl.getElementsByTagName('div')[0];\n    wrapperEl.appendChild(createLoadingOverlay(wrapperEl));\n}\n\n\n// Create PostMessage Object\nfunction createPostMessageData(id, response, options, status){\n    data.id = id;\n    data.response = response;\n    data.options = options;\n    data.status = status;\n    data.sPageURL = window.location.search.substring(1);\n    data.parentSrc = window.location.origin;\n}\n\n// PostMessage to Iframe\nfunction sendMessageToIframe(message, targetOrigin){\n    window.frames.aqutoIframe.postMessage(message, targetOrigin);\n}\n\n// addEventListener support for IE8\nfunction bindEvent(element, eventName, eventHandler) {\n    if (element.addEventListener){\n        element.addEventListener(eventName, eventHandler, false);\n    } else if (element.attachEvent) {\n        element.attachEvent('on' + eventName, eventHandler);\n    }\n}\n\n// Adding PostMessages Event Listener\nbindEvent(window, 'message', function (e) {\n    const eventName = e.data.eventName;\n    const iFrame = document.getElementsByTagName('iframe')[0];\n    if (iFrame){\n        const iFrameSrc = iFrame.src;\n        if(iFrameSrc.includes(e.origin)){\n            targetOrigin = e.origin;\n            // Once iFrame is loaded send data (checkAppEligibility Response and user Options) to iFrame\n            if(eventName === 'aq.iframeLoaded'){\n                const loadingOverlay = document.getElementById('loadingOverlay');\n                loadingOverlay.style.display = 'none';\n                sendMessageToIframe(JSON.stringify(data), targetOrigin);\n            }\n\n            // Call userCallback method when iFrame postMessage \"triggerOnComplete\"\n            if(eventName === 'aq.triggerOnComplete'){\n                const redirectUrl = e.data.finalUrl;\n                iFrame.parentNode.removeChild(iFrame)\n                data.options.onComplete({redirectUrl});\n            }\n        }\n    }\n});\n\n// String.prototype.polyfill\nif (!String.prototype.includes) {\n    String.prototype.includes = function(search, start) {\n        'use strict';\n\n        if (search instanceof RegExp) {\n            throw TypeError('first argument must not be a RegExp');\n        }\n        if (start === undefined) { start = 0; }\n        return this.indexOf(search, start) !== -1;\n    };\n}\n\n\n\n\n\n\n\n//# sourceURL=webpack://aqutoFlows/./flows/phone/src/js/aquto.flows.js?");

/***/ })

/******/ });