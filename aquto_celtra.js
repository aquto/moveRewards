var aquto=function(e){var r={};function a(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=r,a.d=function(e,r,o){a.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:o})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,r){if(1&r&&(e=a(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)a.d(o,n,function(r){return e[r]}.bind(null,n));return o},a.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(r,"a",r),r},a.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},a.p="",a(a.s=7)}({0:function(e,r){function a(e){var r;if(e&&e.response){r={success:!!e.response.successful,status:e.response.status,rewardAmount:e.response.rewardAmountMB};var a=o(e.response.operatorCode);r.carrier=a.operatorCode,r.carrierName=a.operatorName}else r={success:!1,status:"generalerror"};return r}function o(e){var r;return"attmb"===e||"attsim"===e||"attrw"===e?(r="AT&T",e="att"):"vzwrw"===e?(r="Verizon",e="vzw"):"vzwrw"===e?(r="Verizon",e="vzw"):"movirw"===e||"moviperw"===e?(r="Movistar",e="movi"):"telcelrw"===e?(r="Telcel",e="telcel"):"tigogtrw"===e?(r="Tigo",e="tigogt"):"oibrrw"===e?(r="Oi",e="oibr"):(r="N/A",e="na"),{operatorCode:e,operatorName:r}}e.exports={sharedCallback:function(e,r){if(r&&"function"==typeof r){var a;if(e&&e.response&&e.response.eligible){a={eligible:!0,identified:!0,rewardAmount:e.response.rewardAmountMB,userToken:e.response.userToken};var n,t=o(e.response.operatorCode);if(a.carrier=t.operatorCode,a.carrierName=t.operatorName,e.response.displayText){var i=e.response.rewardAmountMB?e.response.rewardAmountMB+" MB":"";n=(n=(n=e.response.displayText).replace("$$operator$$",t.operatorName)).replace("$$rewardAmount$$",i)}a.rewardText=n,e.response.offerUrl&&(a.clickUrl=e.response.offerUrl)}else a={eligible:!1,identified:!(!e.response||"unknown"===e.response.operatorCode)};r(a)}},voucherCallback:function(e,r){if(r&&"function"==typeof r){var o=a(e);switch(e.response.status){case"unabletoidentify":case"ineligible":case"unabletoconvert":case"generalerror":o.status="ineligible"}r(o)}},completeCallback:function(e,r){r&&"function"==typeof r&&r(a(e))}}},7:function(e,r,a){"use strict";
/*!
 * Aquto Move Rewards v0.1.0 <http://aquto.com>
 */var o=a(0),n={};function t(e){if(e&&e.campaignId){var r="//app.aquto.com/api/campaign/datarewards/eligibility/"+e.campaignId+"?apiVersion=v8";loadJSONP(r,{paramName:"jsonp"},(function(r){o(r,e.callback)}))}}n.VERSION="0.1.0",n.checkEligibility=function(e){if(e&&e.campaignId){var r="//app.aquto.com/api/campaign/datarewards/identifyandcheck/"+e.campaignId+"?apiVersion=v8";loadJSONP(r,{paramName:"jsonp"},(function(r){o(r,e.callback)}))}},n.checkEligibilitySinglePage=t,n.checkAppEligibility=t,n.complete=function(e){if(e&&e.campaignId){var r="//app.aquto.com/api/campaign/datarewards/applyreward/"+e.campaignId+"?apiVersion=v8";e.userToken&&(r="//app.aquto.com/api/campaign/datarewards/applyreward/"+e.campaignId+"?apiVersion=v8&userToken="+e.userToken),loadJSONP(r,{paramName:"jsonp"},(function(r){o(r,e.callback)}))}},e.exports=n}});
