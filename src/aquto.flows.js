/** instantiate moveRewards object */
let moveRewards = {}

function checkAppEligibilityPhoneEntry(options) {
    const phone = iti && iti.getNumber().replace('+', '');
    createCopyOptions(options);
    appendIframe(options.targetId);

    aquto.checkAppEligibility({
        campaignId: options.campaignId,
        phoneNumber: phone,
        callback: function(response) {
            if (response){
                createCopyResponse(response);
                if (response.identified) {
                    if (response.eligible) {
                        isEligible = true;
                        if(phone){
                            debug('phone entered eligible');
                            count = 5;
                            hideElem(loading);
                            showElem(phoneEntry);
                            hideElem(phoneCheck);
                            rewardTextEligible.innerHTML = response.rewardText;
                            showElem(eligibleUI);
                        } else{
                            debug('identified & eligible');
                            showElem(loading);
                            redirectToTarget();
                        }
                    } else {
                        showElem(iframe);
                        isEligible = false;
                        if (phone) {
                            debug('phone entered ineligible');
                            // count = 10;
                            // showElem(ineligibleUI);
                            // hideElem(phoneCheck);
                        } else {
                            debug('identified + ineligible');
                            hideElem(loading);
                            showElem(phoneEntry);
                            hideElem(phoneCheck);
                            showElem(ineligibleUI);
                        }
                    }
                    if (phone) {
                        timer.classList.remove('hide');
                        startCountdown();
                    }
                } else {
                    showElem(iframe);
                    isEligible = false;
                    if (phone){
                        debug('phone entered unidentified');
                        hideElem(loading);
                        showElem(phoneEntry);
                        hideElem(phoneCheck);
                        showElem(ineligibleUI);
                    } else {
                        debug('unidentified');
                        hideElem(loading);
                        showElem(phoneEntry);
                    }
                }
            } else {
                debug('error.checkAppEligibility');
                showElem(iframe);
                hideElem(loading);
                showElem(errorElement);
            }
        }
    });
}

/*--------------------------------------------------------------------------*/

moveRewards.VERSION = '0.1.0';
moveRewards.checkAppEligibilityPhoneEntry = checkAppEligibilityPhoneEntry;
module.exports = moveRewards;

/*------------------------ GLOBAL VARIABLES ------------------------------------*/

let loading,
    eligibleElement,
    errorElement,
    ineligibleMsgElement,
    icon,
    text,
    phoneEntry,
    eligibleUI,
    ineligibleUI,
    timer,
    rewardTextEligible,
    phoneCheck,
    input,
    iti,
    copyOptions,
    copyResponse,
    isEligible,
    iframe,
    targetEl,
    iframeTag,
    peTitle,
    peSubTitle,
    peSubmitBtn,
    redirectBtn,
    ineligibleTitle,
    ineligibleSubTitle,
    continueBtn1,
    continueBtn2,
    errorMsg,
    lang;

let count = 5;
let timeoutRef;
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
        redirectBtn: 'Redirect',
        ineligibleTitle: 'Sorry, your phone number is not eligible for data rewards at this time.',
        ineligibleSubTitle: 'Do you want to continue without reward?',
        continueBtn: 'Continue without reward',
        errorMsg: 'Sorry, we were unable to process your request at this time.'
    },
    es: {
        loading: 'Cargando',
        peTitle: 'Participa para ganar Megas',
        peSubTitle: 'Solo confirma tu número de teléfono',
        peSubmitBtn: 'Confirmar ahora',
        rewardTextEligible: 'Tu número participa para ganar megas.',
        redirectBtn: 'Redireccionar ahora',
        ineligibleTitle: 'Lo sentimos, tú número no participa para ganar megas en este momento.',
        ineligibleSubTitle: '¿Deseas continuar sin ganar megas?',
        continueBtn: 'Continuar sin ganar megas',
        errorMsg: 'Lo sentimos. No hemos podido procesar tu solicitud en este momento.'
    },
    pt: {
        loading: 'Carregando',
        peTitle: 'Participe e ganhe Megas',
        peSubTitle: 'Por favor, confirme o número de seu telefone para continuar.',
        peSubmitBtn: 'Confirmar',
        rewardTextEligible: 'Seu número de telefone é elegível a recompensa em pacotes de dados.',
        redirectBtn: 'Redirecionar',
        ineligibleTitle: 'Desculpe, seu número de telefone nao é elegível a recompensa em pacotes de dados desta vez.',
        ineligibleSubTitle: 'Gostaria de continuar sem a recompensa?',
        continueBtn: 'Continuar sem a recompensa',
        errorMsg: 'Desculpe. Não podemos processar sua solicitação neste momento.'
    }
}

/*------------------------ CUSTOM METHODS ------------------------------------*/

function appendIframe(targetId){
    targetEl = document.querySelector("#" + targetId);

    // Calculating actual rendered values for Target Tag's Width and Height in case they are NOT set by CSS.
    // If these values are lower than iframes's minWidth or minHeight, they will be set by default.
    const iframeWidth = targetEl.scrollWidth < parseInt(iframeTag.minWidth.substring(0,3)) ? parseInt(iframeTag.minWidth.substring(0,3)) : targetEl.scrollWidth;
    const iframeHeight = targetEl.scrollHeight < parseInt(iframeTag.minHeight.substring(0,3)) ? parseInt(iframeTag.minHeight.substring(0,3)) : targetEl.scrollHeight;

    iframeTag.style.width = iframeWidth + "px";
    iframeTag.style.height = iframeHeight + "px";
    targetEl && targetEl.appendChild(iframeTag);
    document.querySelector('#iframe-01').addEventListener("load", ev => {
        iframe = document.querySelector('#iframe-01');
        initializeElementsVar();
        initializePhoneInput();
        setLangText();
    });
}

function setLangText(){
    const navigatorLang = (navigator.languages && navigator.languages.length) ? navigator.languages[0]
        : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    lang = navigatorLang.substring(0, 2);
    const languages = copyOptions.languages || defaultLanguages;

    if(languages){
        if (languages.find(item => item === lang)){
            setInnerHtml(lang);
        } else {
            setInnerHtml(languages[0]);
            lang = languages[0];
        }
    } else {
        setInnerHtml('es');
        lang = 'es';
    }

}

function setInnerHtml(lang){
    loading.innerHTML = translations[lang].loading;
    peTitle.innerHTML = translations[lang].peTitle;
    peSubTitle.innerHTML = translations[lang].peSubTitle;
    peSubmitBtn.value = translations[lang].peSubmitBtn;
    rewardTextEligible.innerHTML = translations[lang].rewardTextEligible;
    redirectBtn.innerHTML = translations[lang].redirectBtn;
    ineligibleTitle.innerHTML = translations[lang].ineligibleTitle;
    ineligibleSubTitle.innerHTML = translations[lang].ineligibleSubTitle;
    continueBtn1.innerHTML = translations[lang].continueBtn;
    continueBtn2.innerHTML = translations[lang].continueBtn;
    errorMsg.innerHTML = translations[lang].errorMsg;
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
            name: 'link',
            href: 'styles/main.css'
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

function createIframe(){
    iframeTag = document.createElement('iframe');
    if (!document.getElementById("iframe-01")){
        iframeTag.minWidth = '250px';
        iframeTag.minHeight = '300px';
        iframeTag.src = "iframeContent.html";
        iframeTag.id = "iframe-01";
        iframeTag.style.border = "none";
        iframeTag.style.position = "absolute";
        iframeTag.style.backgroundColor = "#fff";
        hideElem(iframeTag);
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

function initializeElementsVar(){
    loading = iframeGetElem('preload');
    eligibleElement = iframeGetElem('eligibleWrapper');
    errorElement = iframeGetElem('errorWrapper');
    ineligibleMsgElement = iframeGetElem('ineligibleMessage');
    icon = iframeGetElem('icon');
    text = iframeGetElem('rewardText');
    phoneEntry = iframeGetElem('phoneEntryWrapper');
    eligibleUI = iframeGetElem('eligible');
    ineligibleUI = iframeGetElem('ineligible');
    timer = iframeGetElem('timer');
    rewardTextEligible = iframeGetElem('rewardTextEligible');
    phoneCheck = iframeGetElem('phoneCheck');
    input = iframeGetElem('phone');
    peTitle = iframeGetElem('peTitle');
    peSubTitle = iframeGetElem('peSubTitle');
    peSubmitBtn = iframeGetElem('peSubmitBtn');
    redirectBtn = iframeGetElem('redirectBtn');
    ineligibleTitle = iframeGetElem('ineligibleTitle');
    ineligibleSubTitle = iframeGetElem('ineligibleSubTitle');
    continueBtn1 = iframeGetElem('continueBtn1');
    continueBtn2 = iframeGetElem('continueBtn2');
    errorMsg = iframeGetElem('errorMsg');
}

function initializePhoneInput(){

    const inputTelOptions = {
        allowDropdown: true,
        formatOnDisplay: true,
        initialCountry: "mx",
        nationalMode: false,
        onlyCountries: copyOptions.countries || defaultCountries,
        separateDialCode: true
    };
    iti = input && window.intlTelInput(input, inputTelOptions);
}

function createCopyOptions(options){
    copyOptions = Object.assign({}, options);
}

function createCopyResponse(response){
    copyResponse = Object.assign({}, response);
}

function iframeGetElem(id) {
    const iframeWindow = iframe.contentWindow || iframe.contentDocument;
    return iframeWindow.document.querySelector("#" + id);
}

function validatePhoneNumber(){
    copyOptions.phoneNumber = iti.getNumber().replace('+', '');
    checkAppEligibilityPhoneEntry(copyOptions);
}

function countDown() {
    let timer = iframeGetElem("timer");
    let loadingTxtOne, loadingTxtTwo;
    if (lang === 'en'){
        loadingTxtOne = "Redirecting in ";
        loadingTxtTwo = " seconds."
    }
    if (lang === 'es'){
        loadingTxtOne = "Redireccionar en ";
        loadingTxtTwo = " segundos."
    }
    if (lang === 'pt'){
        loadingTxtOne = "Redirecionando em ";
        loadingTxtTwo = " segundos."
    }
    if (count > 0) {
        count--;
        timer.innerHTML = loadingTxtOne + count + loadingTxtTwo;
        startCountdown();
    } else {
        redirectToTarget();
    }
}

// Start countdown timer
function startCountdown() {
    timeoutRef = setTimeout(countDown, 1000);
}

// Cancel timer if set
function stopCountdown() {
    if (timeoutRef) {
        clearTimeout(timeoutRef);
        timeoutRef = null;
        debug('countdown stopped');
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
    timeoutRef && stopCountdown();
    debug('Redirecting to', finalUrl);
    copyResponse.redirectUrl = finalUrl;
    !debugEnabled && copyOptions.onComplete(copyResponse);
}

function showElem(elem){
    elem && elem.classList.remove('hide');
}

function hideElem(elem){
    elem && elem.classList.add('hide');
}
window.onload = function(){

    if (typeof jQuery === 'undefined'){
        let jqTag = document.createElement('script');
        jqTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js';
        jqTag.integrity = 'sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=';
        jqTag.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(jqTag);
    }

    createScriptTags();
    createIframe();

    // addEventListener support for IE8
    function bindEvent(element, eventName, eventHandler) {
        if (element.addEventListener){
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    }

    // Adding Message event to Iframe
    bindEvent(window, 'message', function (e) {
        const eventName = e.data;

        if(eventName === 'submitPhoneEntry'){
            validatePhoneNumber();
        }

        if(eventName === 'redirectUrl'){
            redirectToTarget();
        }
    });

}





