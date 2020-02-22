let isEligible, dataFromParent, count, iti, deviceDetails, messages, debugEnabled;
let DOMElements = {};
const availableCountries = ['mx'];
const defaultCountries = availableCountries;
const availableLanguages = ['es', 'en', 'pt'];
const defaultLanguages = availableLanguages;
let targetOrigin = '*';
const listDOMElements = [
    'preload',
    'errorWrapper',
    'ineligibleMessage',
    'phoneEntryWrapper',
    'eligibleWrapper',
    'ineligibleWrapper',
    'timer',
    'rewardTextEligible',
    'phoneCheck',
    'phone',
    'peTitle',
    'peSubTitle',
    'peSubmitBtn',
    'redirectBtn',
    'ineligibleTitle',
    'ineligibleSubTitle',
    'continueBtn1',
    'continueBtn2',
    'errorMsg'
];

(function (win, doc) {

    function handleDOM(response, options, status){
        DOMElements = selectDOMElements();
        setTextForElements(DOMElements, options);
        if (status === 'success'){
            initIntlTelInput(DOMElements.phone, options);
            addButtonsEventListeners(DOMElements);
            const phoneNumber = options.phoneNumber;
            if (response.identified) {
                if (response.eligible) {
                    isEligible = true;
                    if(phoneNumber){
                        count = 5;
                        debug('phone entered eligible');
                        hideEl(DOMElements.preload);
                        hideEl(DOMElements.phoneCheck);
                        showEl(DOMElements.phoneEntryWrapper);
                        showEl(DOMElements.eligibleWrapper);
                        DOMElements.rewardTextEligible.innerHTML = response.rewardText;
                    } else{
                        debug('identified & eligible');
                        showEl(DOMElements.preload);
                        triggerOnComplete();
                    }
                } else {
                    isEligible = false;
                    if (phoneNumber) {
                        count = 5;
                        debug('phone entered ineligible');
                        hideEl(DOMElements.preload);
                        hideEl(DOMElements.phoneCheck);
                        showEl(DOMElements.ineligibleWrapper);
                        showEl(DOMElements.phoneEntryWrapper);
                        showEl(DOMElements.timer);
                    } else {
                        debug('identified + ineligible');
                        hideEl(DOMElements.preload);
                        showEl(DOMElements.phoneEntryWrapper);
                        hideEl(DOMElements.phoneCheck);
                        showEl(DOMElements.ineligibleWrapper);
                    }
                }
                if (phoneNumber) {
                    showEl(DOMElements.timer);
                    setTimeout(countDown, 1000, DOMElements.timer);
                }
            } else {
                isEligible = false;
                if (phoneNumber){
                    debug('phone entered unidentified');
                    hideEl(DOMElements.preload);
                    showEl(DOMElements.phoneEntryWrapper);
                    hideEl(DOMElements.phoneCheck);
                    showEl(DOMElements.ineligibleWrapper);
                } else {
                    debug('unidentified');
                    hideEl(DOMElements.preload);
                    showEl(DOMElements.phoneEntryWrapper);
                }
            }
        }

        if (status === 'error'){
            debug('error.checkAppEligibility');
            hideEl(DOMElements.preload);
            showEl(DOMElements.errorWrapper);
        }
    }

    function selectDOMElements(){
        if(isEmpty(DOMElements)){
            for(let i = 0; i < listDOMElements.length; i++){
                DOMElements[listDOMElements[i]] = doc.getElementById(listDOMElements[i]);
            }
            return DOMElements;
        }
        return DOMElements;
    }

    function initIntlTelInput(input, options){

        const userCountries = options.countries;
        const countries = intersect(userCountries, availableCountries) || defaultCountries;
        const country = countries[0];

        const inputTelOptions = {
            allowDropdown: true,
            formatOnDisplay: true,
            initialCountry: country,
            nationalMode: false,
            onlyCountries: countries,
            separateDialCode: true
        };
        iti = input && win.intlTelInput(input, inputTelOptions);
    }

    function showEl(el){
        el.classList.remove('hide');
    }

    function hideEl(el){
        el.classList.add('hide');
    }

    function countDown(timer){
        const loadingTxtOne = messages.loadingTxtOne;
        const loadingTxtTwo = messages.loadingTxtTwo;
        if (count > 0) {
            count--;
            timer.innerHTML = loadingTxtOne + count + loadingTxtTwo;
            setTimeout(countDown, 1000, timer);
        } else {
            triggerOnComplete();
        }
    }

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

        if(isAndroid && dataFromParent.options.targetUrlAndroid){
            return dataFromParent.options.targetUrlAndroid
        }

        if(isIOS && dataFromParent.options.targetUrlIOS){
            return dataFromParent.options.targetUrlIOS
        }

        if(!dataFromParent.options.targetUrl){
            alert('NO Url provided');
            return null;
        }

        return dataFromParent.options.targetUrl;
    }

    function getFinalUrl(){
        const clickId = dataFromParent.response.clickId || null;
        let clickUrl = dataFromParent.response.clickUrl || null;
        // Use passed URL and fallback to URL in query and replace clickId
        if (isEligible){
            const url = clickUrl || getDeviceUrl();
            return url.replace("$$clickId$$", clickId || '');
        } else {
            return getDeviceUrl();
        }
    }

    function getBrowserLang(){
        const navigatorLang = (navigator.languages && navigator.languages.length) ? navigator.languages[0]
            : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
        return navigatorLang.substring(0, 2)
    }

    function filterLanguage(browserLang, allowLang){
        if (browserLang === allowLang){
            return browserLang;
        } else {
            return allowLang;
        }
    }

    function getTranslations(lang, translations){
        messages = translations[lang];
        return translations[lang]
    }

    function updateElementTexts(messages, DOMElements){
        DOMElements.preload.innerHTML = messages.preload;
        DOMElements.peTitle.innerHTML = messages.peTitle;
        DOMElements.peSubTitle.innerHTML = messages.peSubTitle;
        DOMElements.peSubmitBtn.value = messages.peSubmitBtn;
        DOMElements.rewardTextEligible.innerHTML = messages.rewardTextEligible;
        DOMElements.redirectBtn.innerHTML = messages.redirectBtn;
        DOMElements.ineligibleTitle.innerHTML = messages.ineligibleTitle;
        DOMElements.ineligibleSubTitle.innerHTML = messages.ineligibleSubTitle;
        DOMElements.continueBtn1.innerHTML = messages.continueBtn;
        DOMElements.continueBtn2.innerHTML = messages.continueBtn;
        DOMElements.errorMsg.innerHTML = messages.errorMsg;
    }

    function setTextForElements(DOMElements, options){
        const userLanguages = options.languages;
        const languages = intersect(userLanguages, availableLanguages) || defaultLanguages;
        const lang = languages[0];

        updateElementTexts(
            getTranslations(filterLanguage(getBrowserLang(), lang), translations), DOMElements);
    }

    // addEventListener support for IE8
    function bindEvent(element, eventName, eventHandler) {
        if (element.addEventListener){
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    }

    // PostMessage to Parent
    function sendMessage(msg) {
        win.parent.postMessage(msg, targetOrigin);
    }

    function setDebugEnabled(sPageURL){
        debugEnabled = getUrlParameter('d', sPageURL) === '1';
    }

    function handleMessageEvent(e){

        dataFromParent = JSON.parse(e.data);
        const parentSrc = dataFromParent.parentSrc;

        // Validate Parent message is same as origin event
        if(!parentSrc.includes(e.origin)){
            return;
        }

        if(dataFromParent.id === 'aq.handleIframeDOM'){
            targetOrigin = parentSrc; // Updating targetOrigin from '*' to parentSrc
            handleDOM(dataFromParent.response, dataFromParent.options, dataFromParent.status);
            setDebugEnabled(dataFromParent.sPageURL);
        }
    }

    function addIframeEventListener(){
        bindEvent(win, 'message', handleMessageEvent);
    }

    // Once Iframe is loaded addIframe Event Listener to Receive Messages and
    // postMessage to Parent to confirm iFrame is loaded
    function iFrameLoaded(){
        addIframeEventListener();
        const message = { eventName: 'aq.iframeLoaded'};
        sendMessage(message);
    }

    iFrameLoaded();

    function triggerOnComplete(event){
        event && event.preventDefault();
        const finalUrl = getFinalUrl();
        if(finalUrl){
            const message = {
                eventName: 'aq.triggerOnComplete',
                finalUrl
            };
            debug('Redirecting to', finalUrl);
            !debugEnabled && sendMessage(message);
        }
    }

    function submitPhoneEntryForm(event){
        event && event.preventDefault();
        const options = {
            phoneNumber: iti && iti.getNumber().replace('+', '')
        };
        const message = {
            eventName: 'aq.validatePhoneNumber',
            options
        };
        debug('Submitting Phone Entry Form');
        sendMessage(message);
    }

    function addButtonsEventListeners(DOMElements){
        bindEvent(DOMElements.redirectBtn, 'click', triggerOnComplete);
        bindEvent(DOMElements.continueBtn1, 'click', triggerOnComplete);
        bindEvent(DOMElements.continueBtn2, 'click', triggerOnComplete);
        bindEvent(DOMElements.peSubmitBtn, 'click', submitPhoneEntryForm);
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

}(window, document));




