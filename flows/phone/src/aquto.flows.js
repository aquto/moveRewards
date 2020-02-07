/** instantiate moveRewards object */
let moveRewards = {}

function checkAppEligibilityPhoneEntry(options) {
    const phoneNumber = options.phoneNumber
    let iframeEl = injectIframe(options.targetId);
    let iframeElements;
    createCopyOptions(options);
    aquto.checkAppEligibility({
        campaignId: options.campaignId,
        phoneNumber: phoneNumber,
        callback: function(response) {
            if (response){
                if (!response.identified){
                    response.identified = !!(response.eligible && response.operatorCode !== 'unknown');
                }
                iframeElements = getIframeElements(iframeEl);
                createCopyResponse(response);
                if (response.identified) {
                    if (response.eligible) {
                        isEligible = true;
                        if(phoneNumber){
                            debug('phone entered eligible');
                            count = 5;
                            hideElement(iframeElements.loading);
                            hideElement(iframeElements.phoneCheck);
                            showElement(iframeElements.phoneEntry);
                            showElement(iframeElements.eligibleUI);
                            iframeElements.rewardTextEligible.innerHTML = response.rewardText;
                        } else{
                            debug('identified & eligible');
                            showElement(iframeElements.loading);
                            redirectToTarget();
                        }
                    } else {
                        showElement(iframeEl);
                        isEligible = false;
                        if (phoneNumber) {
                            count = 5;
                            debug('phone entered ineligible');
                            hideElement(iframeElements.loading);
                            hideElement(iframeElements.phoneCheck);
                            showElement(iframeElements.ineligibleUI);
                            showElement(iframeElements.phoneEntry);
                            showElement(iframeElements.timer);
                        } else {
                            debug('identified + ineligible');
                            hideElement(iframeElements.loading);
                            showElement(iframeElements.phoneEntry);
                            hideElement(iframeElements.phoneCheck);
                            showElement(iframeElements.ineligibleUI);
                        }
                    }
                    if (phoneNumber) {
                        showElement(iframeElements.timer);
                        setTimeout(countDown, 1000, iframeEl);
                    }
                } else {
                    showElement(iframeEl);
                    isEligible = false;
                    if (phoneNumber){
                        debug('phone entered unidentified');
                        hideElement(iframeElements.loading);
                        showElement(iframeElements.phoneEntry);
                        hideElement(iframeElements.phoneCheck);
                        showElement(iframeElements.ineligibleUI);
                    } else {
                        debug('unidentified');
                        hideElement(iframeElements.loading);
                        showElement(iframeElements.phoneEntry);
                    }
                }
            } else {
                debug('error.checkAppEligibility');
                showElement(iframeEl);
                hideElement(iframeElements.loading);
                showElement(iframeElements.errorElement);
            }
        }
    });
}


function injectIframe(targetId){
    let iframeEl = document.getElementById('iframe-01');
    if (!iframeEl){
        return addIframeListener(appendIframe(setIframeSize(createIframe(), targetId)));
    }else{
        return iframeEl
    }
}

/*--------------------------------------------------------------------------*/

moveRewards.VERSION = '0.1.0';
moveRewards.checkAppEligibilityPhoneEntry = checkAppEligibilityPhoneEntry;
module.exports = moveRewards;

/*------------------------ GLOBAL VARIABLES ------------------------------------*/

let iti,
    copyOptions,
    copyResponse,
    isEligible;

let count = 5;
const debugEnabled = getUrlParameter('d') === '1';
const defaultLanguages = ['es', 'en', 'pt'];
const defaultCountries = ['mx'];

const translations = {
    en: {
        loading: 'Loading',
        peTitle: 'Participate to win megas',
        peSubTitle: 'Please verify your mobile number to continue.',
        peSubmitBtn: 'Confirm',
        rewardTextEligible: 'Your phone number is eligible for data rewards.',
        redirectBtn: 'Continue',
        ineligibleTitle: 'Sorry, your phone number is not eligible for data rewards at this time.',
        ineligibleSubTitle: 'Do you want to continue without reward?',
        continueBtn: 'Continue without reward',
        errorMsg: 'Sorry, we were unable to process your request at this time.',
        loadingTxtOne: 'Redirecting in ',
        loadingTxtTwo: ' seconds.'
    },
    es: {
        loading: 'Cargando',
        peTitle: 'Participa para ganar Megas',
        peSubTitle: 'Solo confirma tu número de teléfono',
        peSubmitBtn: 'Confirmar ahora',
        rewardTextEligible: 'Tu número participa para ganar megas.',
        redirectBtn: 'Continuar',
        ineligibleTitle: 'Lo sentimos, tú número no participa para ganar megas en este momento.',
        ineligibleSubTitle: '¿Deseas continuar sin ganar megas?',
        continueBtn: 'Continuar sin ganar megas',
        errorMsg: 'Lo sentimos. No hemos podido procesar tu solicitud en este momento.',
        loadingTxtOne: 'Redireccionar en ',
        loadingTxtTwo: ' segundos.'
    },
    pt: {
        loading: 'Carregando',
        peTitle: 'Participe e ganhe Megas',
        peSubTitle: 'Por favor, confirme o número de seu telefone para continuar.',
        peSubmitBtn: 'Confirmar',
        rewardTextEligible: 'Seu número de telefone é elegível a recompensa em pacotes de dados.',
        redirectBtn: 'Continuar',
        ineligibleTitle: 'Desculpe, seu número de telefone nao é elegível a recompensa em pacotes de dados desta vez.',
        ineligibleSubTitle: 'Gostaria de continuar sem a recompensa?',
        continueBtn: 'Continuar sem a recompensa',
        errorMsg: 'Desculpe. Não podemos processar sua solicitação neste momento.',
        loadingTxtOne: 'Redirecionando em ',
        loadingTxtTwo: ' segundos.'
    }
}

/*------------------------ CUSTOM METHODS ------------------------------------*/

function showElement(el){
    el.classList.remove('hide');
}

function hideElement(el){
    el.classList.add('hide');
}

function createIframe(){
    let iframeTag = document.createElement('iframe');
    if (!document.getElementById("iframe-01")){
        iframeTag.minWidth = '250px';
        iframeTag.minHeight = '300px';
        iframeTag.src = "../../iframeContent.html";
        iframeTag.id = "iframe-01";
        iframeTag.style.border = "none";
        iframeTag.style.position = "absolute";
        iframeTag.style.backgroundColor = "#fff";
        iframeTag.classList.add("hide");
    }
    return iframeTag
}

function setIframeSize(iframeEl, targetId){
    let targetElementId;
    if (Object.prototype.toString.call(targetId) === "[object String]"){
        targetElementId = targetId;
    }
    if (Object.prototype.toString.call(targetId) === "[object HTMLDivElement]"){
        targetElementId = targetId.id;
    }

    const targetEl = document.querySelector("#" + targetElementId);
    // Calculating actual rendered values for Target Tag's Width and Height in case they are NOT set by CSS.
    // If these values are lower than iframes's minWidth or minHeight, they will be set by default.
    const iframeWidth = targetEl.scrollWidth < parseInt(iframeEl.minWidth.substring(0,3)) ? parseInt(iframeEl.minWidth.substring(0,3)) : targetEl.scrollWidth;
    const iframeHeight = targetEl.scrollHeight < parseInt(iframeEl.minHeight.substring(0,3)) ? parseInt(iframeEl.minHeight.substring(0,3)) : targetEl.scrollHeight;
    iframeEl.style.width = iframeWidth + "px";
    iframeEl.style.height = iframeHeight + "px";

    return {targetEl, iframeEl}
}

function appendIframe(DOMElements){
    DOMElements.targetEl && DOMElements.targetEl.appendChild(DOMElements.iframeEl);
    return DOMElements.iframeEl
}

function addIframeListener(iframeEl){
    iframeEl.addEventListener("load", ev => {
        initializePhoneInput();
        updateElementTexts(getTranslations(filterLanguage(getBrowserLang(), copyOptions.languages || defaultLanguages), translations), iframeEl);
    });
    return iframeEl;
}

function getBrowserLang(){
    const navigatorLang = (navigator.languages && navigator.languages.length) ? navigator.languages[0]
        : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    return navigatorLang.substring(0, 2)
}

function filterLanguage(browserLang, allowLang){
    return allowLang.find(lang => lang === browserLang) || 'es'
}

function getTranslations(lang, translations){
    return translations[lang]
}

function updateElementTexts(messages, iframeEl){
    const iframeElements = getIframeElements(iframeEl);
    iframeElements.loading.innerHTML = messages.loading;
    iframeElements.peTitle.innerHTML = messages.peTitle;
    iframeElements.peSubTitle.innerHTML = messages.peSubTitle;
    iframeElements.peSubmitBtn.value = messages.peSubmitBtn;
    iframeElements.rewardTextEligible.innerHTML = messages.rewardTextEligible;
    iframeElements.redirectBtn.innerHTML = messages.redirectBtn;
    iframeElements.ineligibleTitle.innerHTML = messages.ineligibleTitle;
    iframeElements.ineligibleSubTitle.innerHTML = messages.ineligibleSubTitle;
    iframeElements.continueBtn1.innerHTML = messages.continueBtn;
    iframeElements.continueBtn2.innerHTML = messages.continueBtn;
    iframeElements.errorMsg.innerHTML = messages.errorMsg;
}

function createScriptTags(){

    const tagAttrs = [
        {
            name: 'link',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css',
            integrity: 'sha256-+N4/V/SbAFiW1MPBCXnfnP9QSN3+Keu+NlB+0ev/YKQ=',
            crossorigin: 'anonymous'
        },
        {
            name: 'link',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.4/css/intlTelInput.css',
            integrity: 'sha256-rTKxJIIHupH7lFo30458ner8uoSSRYciA0gttCkw1JE=',
            crossorigin: 'anonymous'
        },
        {
            name: 'script',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.4/js/intlTelInput-jquery.min.js',
            integrity: 'sha256-s0v2VDVLbAqGy/FEK0588AtGkSz0aOb6ibQCPCkk4Bk=',
            crossorigin: 'anonymous'
        },
        {
            name: 'script',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.4/js/intlTelInput.min.js',
            integrity: 'sha256-Gf8PGNhkyd/4AuPWG7theaqc8hAvHzocloCkDN9pXFw=',
            crossorigin: 'anonymous'

        },
        {
            name: 'script',
            src: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.4/js/utils.js',
            integrity: 'sha256-271j3cFogB3oRK1PLEHwasgC+sTkKr0f1I37LU9Qkyk=',
            crossorigin: 'anonymous'
        }
    ];

    let customTag;

    for (let i = 0; i < tagAttrs.length; i++){
        customTag = document.createElement(tagAttrs[i].name);

        if (tagAttrs[i].integrity){
            customTag.integrity = tagAttrs[i].integrity
        }

        if (tagAttrs[i].crossorigin){
            customTag.setAttribute("crossorigin", tagAttrs[i].crossorigin);
        }

        if (tagAttrs[i].name === 'link'){
            customTag.rel = 'stylesheet';
            customTag.href = tagAttrs[i].href;
            document.head.appendChild(customTag);
        }

        if (tagAttrs[i].name === 'script') {
            customTag.type = 'text/javascript';
            customTag.src = tagAttrs[i].src;
            document.body.appendChild(customTag);
        }
    }
}

function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
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

function debug(message, options){
    if (debugEnabled) {
        if(options){
            console.log(message, options);
        } else {
            console.log(message);
        }
    }
}

function getIframeElements(iframeEl){
    const iframeElements = {
        loading: iframeGetElem('preload', iframeEl),
        eligibleElement: iframeGetElem('eligibleWrapper', iframeEl),
        errorElement: iframeGetElem('errorWrapper', iframeEl),
        ineligibleMsgElement: iframeGetElem('ineligibleMessage', iframeEl),
        icon: iframeGetElem('icon', iframeEl),
        text: iframeGetElem('rewardText', iframeEl),
        phoneEntry: iframeGetElem('phoneEntryWrapper', iframeEl),
        eligibleUI: iframeGetElem('eligible', iframeEl),
        ineligibleUI: iframeGetElem('ineligible', iframeEl),
        timer: iframeGetElem('timer', iframeEl),
        rewardTextEligible: iframeGetElem('rewardTextEligible', iframeEl),
        phoneCheck: iframeGetElem('phoneCheck', iframeEl),
        input: iframeGetElem('phone', iframeEl),
        peTitle: iframeGetElem('peTitle', iframeEl),
        peSubTitle: iframeGetElem('peSubTitle', iframeEl),
        peSubmitBtn: iframeGetElem('peSubmitBtn', iframeEl),
        redirectBtn: iframeGetElem('redirectBtn', iframeEl),
        ineligibleTitle: iframeGetElem('ineligibleTitle', iframeEl),
        ineligibleSubTitle: iframeGetElem('ineligibleSubTitle', iframeEl),
        continueBtn1:iframeGetElem('continueBtn1', iframeEl),
        continueBtn2: iframeGetElem('continueBtn2', iframeEl),
        errorMsg: iframeGetElem('errorMsg', iframeEl)
    }
    return iframeElements
}

function initializePhoneInput(){
    const iframeEl = document.getElementById('iframe-01');
    const inputEl = getIframeElements(iframeEl).input;
    const inputTelOptions = {
        allowDropdown: true,
        formatOnDisplay: true,
        initialCountry: "mx",
        nationalMode: false,
        onlyCountries: copyOptions.countries || defaultCountries,
        separateDialCode: true
    };
    iti = inputEl && window.intlTelInput(inputEl, inputTelOptions);
}

function createCopyOptions(options){
    copyOptions = Object.assign({}, options);
}

function createCopyResponse(response){
    copyResponse = Object.assign({}, response);
}

function iframeGetElem(id, iframeEl) {
    const iframeWindow = iframeEl.contentWindow || iframeEl.contentDocument;
    return iframeWindow.document.querySelector("#" + id);
}

const validatePhoneNumber = function(){
    copyOptions.phoneNumber = iti.getNumber().replace('+', '');
    checkAppEligibilityPhoneEntry(copyOptions);
}

function countDown(iframeEl){
    let timer = iframeGetElem("timer", iframeEl);
    const messages = getTranslations(filterLanguage(getBrowserLang(), copyOptions.languages || defaultLanguages), translations)
    const loadingTxtOne = messages.loadingTxtOne;
    const loadingTxtTwo = messages.loadingTxtTwo;
    if (count > 0) {
        count--;
        timer.innerHTML = loadingTxtOne + count + loadingTxtTwo;
        setTimeout(countDown, 1000, iframeEl);
    } else {
        redirectToTarget();
    }
}

let deviceDetails;

// Note: Both navigator.userAgent and navigator.platform can be faked by the user or a browser extension.
// The following function confirms if is iOS
function iOS() {
    let iOsDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ]

    if (navigator.platform) {
        while (iOsDevices.length) {
            if (navigator.platform === iOsDevices.pop()) { return true }
        }
    }
    return false
}

function getDeviceDetails() {
    // Avoid re-calculating multiple times
    if (deviceDetails) return deviceDetails;

    const navU = navigator.userAgent;
    const isAndroidMobile = navU.indexOf('Android') > -1 && navU.indexOf('Mozilla/5.0') > -1 && navU.indexOf('AppleWebKit') > -1;

    deviceDetails = {
        isAndroid: isAndroidMobile,
        isIOS: iOS()
    }

    return deviceDetails
}

function getDeviceUrl(){

    const deviceDetails = getDeviceDetails();
    const isAndroid = deviceDetails.isAndroid;
    const isIOS = deviceDetails.isIOS;

    if(isAndroid && copyOptions.targetUrlAndroid){
        return copyOptions.targetUrlAndroid
    }

    if(isIOS && copyOptions.targetUrlIOS){
        return copyOptions.targetUrlIOS
    }

    if(!copyOptions.targetUrl){
       alert('NO Url provided');
       return null;
    }

    return copyOptions.targetUrl;
}

function getFinalUrl(){
    const clickId = copyResponse.clickId || null;
    let clickUrl = copyResponse.clickUrl || null;

    // Use passed URL and fallback to URL in query and replace clickId
    if (isEligible){
        const url = clickUrl || getDeviceUrl();
        return url.replace("$$clickId$$", clickId || '');
    } else {
        return getDeviceUrl();
    }
}

function redirectToTarget(){
    const finalUrl = getFinalUrl();
    debug('Redirecting to', finalUrl);
    copyResponse.redirectUrl = finalUrl;
    !debugEnabled && copyOptions.onComplete(copyResponse);
}

(function () {
    if (typeof jQuery === 'undefined') {
        let jqTag = document.createElement('script');
        jqTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js';
        jqTag.integrity = 'sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=';
        jqTag.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(jqTag);
    }
    createScriptTags();

    // Listen to message from iframe
    bindEvent(window, 'message', function (e) {
        const eventName = e.data;
        if(eventName === 'submitPhoneEntry'){
            validatePhoneNumber();
        }
        if(eventName === 'redirectUrl'){
            redirectToTarget();
        }
    });
}());


