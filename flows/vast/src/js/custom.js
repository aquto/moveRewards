(function(win, doc) {
    // DOM Elements to use
    var DOMelements = {
        loading: getDOMElement('preload'),
        video: getDOMElement('video'),
        eligibleElement: getDOMElement('eligibleWrapper'),
        errorElement: getDOMElement('errorWrapper'),
        ineligibleMsgElement: getDOMElement('ineligibleMessage'),
        body: doc.body,
        icon: getDOMElement('icon'),
        text: getDOMElement('rewardText'),
        phoneEntry: getDOMElement('phoneEntryWrapper'),
        eligibleUI: getDOMElement('eligible'),
        ineligibleUI: getDOMElement('ineligible'),
        timer: getDOMElement('timer'),
        rewardTextEligible: getDOMElement('rewardTextEligible'),
        phoneCheck: getDOMElement('phoneCheck'),
        input: doc.querySelector("#phone"),
        videoTimer: getDOMElement('videoTimer'),
        currentTimeTxt: getDOMElement('currentTime'),
        durationTxt: getDOMElement('duration')
    };

    let videoOverlay = getDOMElement('videoOverlay');
    let loadingOverlay = getDOMElement('loadingOverlay');

    const campaignId = getUrlParameter('cid');
    const vastTagUrl = getUrlParameter('vu');
    const debugEnabled = getUrlParameter('d') === '1';
    const bannerUrl = getUrlParameter('b');
    const disableControls = getUrlParameter('dc') === '1';

    const percentageThresholds = [0, 25, 50, 75, 95];

    /** Check if Aquto backend hostname has been passed in */
    const scriptParams = parseScriptQuery(document.getElementById('aquto-api'));
    const be = scriptParams.be || 'app.aquto.com';
    const ow = scriptParams.ow || 'ow.aquto.com';

    const phoneNumberValidation = {
        mx: {
            minLen: 12,
            maxLen: 12,
            countryCode: '52'
        },
        cl: {
            minLen: 11,
            maxLen: 11,
            countryCode: '56'
        },
        ar: {
            minLen: 10,
            maxLen: 14,
            countryCode: '549'
        },
        co: {
            minLen: 12,
            maxLen: 12,
            countryCode: '57'
        },
        pe: {
            minLen: 11,
            maxLen: 11,
            countryCode: '51'
        },
        br: {
            minLen: 13,
            maxLen: 13,
            countryCode: '55'
        }
    };

    const countryDialingCodes = {
        // Mexico
        '52': 'mx',
        // Chile
        '56': 'cl',
        // Argentina
        '549': 'ar',
        // Colombia
        '57': 'co',
        // Peru
        '51': 'pe',
        // Brazil
        '55': 'br'
    };

    const defaultCountries = ['mx', 'cl', 'ar', 'co', 'pe', 'br'];
    const defaultLanguages = ['es', 'pt'];
    const countries = (getUrlParameter('co') && getUrlParameter('co').split(',')) || defaultCountries;
    const languages = (getUrlParameter('l') && getUrlParameter('l').split(',')) || defaultLanguages;

    const hasDefaultCountry = countries.indexOf('mx') >= 0;
    const hasValidCountry = countries.some(function(c){return !!phoneNumberValidation[c]});
    const defaultCountry = defaultCountries.filter(function(cc){ return cc === 'mx'});

    let timeoutRef;
    let videoError = false;
    let isEligible = false;
    let vastVideoComplete = false;
    let responseCopy;
    let language;

    // Eligible Player Options
    const playerOptions = {
        controls: !disableControls,
        autoplay: false,
        preload: true,
        nativeControlsForTouch: false,
        inactivityTimeout: 0,
        disableVideoPlayPauseClick: true,
        poster: bannerUrl || '../assets/images/watch-this-eligible.png',
        sources: [{
            type: 'video/mp4',
            src: '../assets/videos/placeholder.mp4'
        }],
        plugins: {
            vastClient: {
                adTagUrl: vastTagUrl,
                preferredTech: 'html5',
                adsEnabled: true
            }
        }
    };

    // Eligible Player Initialization
    const player = videojs('player', playerOptions);

    // Player Events
    player.on('play', function () {
        debug('play');
        videoError && hideElem(DOMelements.video);
        if(!vastVideoComplete && disableControls) {
            DOMelements.currentTimeTxt.innerHTML = timerFormatter(Math.floor(this.currentTime()));
        }
    });

    function setTimerLabels(currentTime, duration){
        if (disableControls) {
            DOMelements.currentTimeTxt.innerHTML = timerFormatter(Math.floor(currentTime));
            DOMelements.durationTxt.innerHTML = timerFormatter(Math.floor(duration));
        }
    }

    player.on('timeupdate', function (e) {
        if (!videoError) {
            const percentage = Math.floor(this.currentTime() / this.duration() * 100);
            debug('update', percentage);
            setTimerLabels(this.currentTime(), this.duration());
            if (responseCopy.clickId) {
                const pctThresholds = percentageThresholds;
                let nextPct = null;
                do {
                    nextPct = pctThresholds.length > 0 ? pctThresholds[0] : 101;
                    if (percentage >= nextPct) {
                        // Remove threshold and trigger
                        pctThresholds.shift();
                        trackVideoView(responseCopy.clickId, nextPct);
                    }
                } while (percentage >= nextPct);
            }
        }
    });

    if (debugEnabled) {
        // player.on('ready', function() {
        // })
        player.on("click", function (event) {
            debug("click", event);
        });

        player.on("vast.adClick", function (event) {
            debug("vast.adClick", event);
        });
   }

    player.on("vast.adError", function(event) {
        hideElem(DOMelements.ineligibleMsgElement);
        debug("vast.adError", event.error);
        hideElem(DOMelements.eligibleElement);
        hideElem(DOMelements.video);
        showElem(DOMelements.errorElement);
        videoError = true;
    });

    player.on("vast.contentEnd", function() {
        debug("vast.contentEnd");
        hideElem(DOMelements.video);
        if (!videoError && isEligible){ // If vast.adError Event then stop the process.
            showElem(DOMelements.eligibleElement);
            completeReward();
        }
        if(!isEligible && !videoError){
            debug('not eligible');
            hideElem(DOMelements.video);
            showElem(DOMelements.ineligibleMsgElement);
        }
    });

    const inputTelOptions = {
        allowDropdown: true,
        formatOnDisplay: true,
        initialCountry: "mx",
        nationalMode: false,
        onlyCountries: ['mx', 'pe'],
        separateDialCode: true
    };
    const iti = win.intlTelInput(DOMelements.input, inputTelOptions);
    let count = 5;

    const numberIsValid = function(){
        const phoneNumber = iti.getNumber().replace('+', '');
        const countryCode = findCountry();
        const isValid = countryCode && phoneNumber.length >= phoneNumberValidation[countryCode].minLen && phoneNumber.length <= phoneNumberValidation[countryCode].maxLen
        phoneEntrySubmitBtn.disabled = !isValid
    };

   function findCountry(){
       const phoneNumber = iti.getNumber().replace('+', '');
       const entries = Object.entries(countryDialingCodes);

       for (let i = 0; i < entries.length; i++){
           if (phoneNumber.substring(0, entries[i][0].length) === entries[i][0]) {
               return entries[i][1];
           }
       }
   }

    // Aquto checkAppEligibility method call
    const checkPhoneNumber = function(){
        event && event.preventDefault();
        const phone = iti.getNumber().replace('+', '');
        addLoadingOverlay();
        aquto.checkAppEligibility({
            campaignId: campaignId,
            phoneNumber: phone,
            callback: function(response) {
                debug('checkAppEligibility');
                hideElem(loadingOverlay);
                if (response) {
                    hideElem(videoOverlay);
                    if (disableControls) showElem(DOMelements.videoTimer)
                    responseCopy = Object.assign({}, response);
                    if (response.identified) {
                        if (response.eligible) {
                            isEligible = true;
                            if(phone){
                                debug('phone entered eligible');
                                count = 5;
                                showElem(DOMelements.eligibleUI);
                                hideElem(DOMelements.phoneCheck);
                                DOMelements.rewardTextEligible.innerHTML = response.rewardText;
                            } else{
                                debug('identified & eligible');
                                hideElem(DOMelements.loading);
                                showElem(DOMelements.video);
                                player.play();
                            }
                        } else {
                            isEligible = false;
                            if (phone) {
                                debug('phone entered ineligible');
                                count = 5;
                                showElem(DOMelements.ineligibleUI);
                                hideElem(DOMelements.phoneCheck);
                            } else {
                                debug('identified + ineligible')
                                count = 10;
                                hideElem(DOMelements.loading);
                                hideElem(DOMelements.video);
                                showElem(DOMelements.phoneEntry);
                                hideElem(DOMelements.phoneCheck);
                                showElem(DOMelements.ineligibleUI);
                                showElem(DOMelements.timer);
                                startCountdown();
                            }
                        }
                        if (phone) {
                            DOMelements.timer.classList.remove('hide');
                            startCountdown();
                        }
                    } else {
                        if (phone){
                            debug('phone entered unidentified');
                            count = 10;
                            isEligible = false;
                            showElem(DOMelements.ineligibleUI);
                            hideElem(DOMelements.phoneCheck);
                            showElem(DOMelements.timer);
                            startCountdown();
                        } else {
                            debug('unidentified');
                            isEligible = false;
                            hideElem(DOMelements.loading);
                            hideElem(DOMelements.video);
                            showElem(DOMelements.phoneEntry);
                        }
                    }
                } else {
                    debug('error.checkAppEligibility');
                    hideElem(DOMelements.loading);
                    hideElem(DOMelements.video);
                    showElem(DOMelements.errorElement);
                }
            }
        });
    }

    function addEventOverlay(){
        videoOverlay.addEventListener('click', function(event) {
            if(event.stopPropagation){
                event.stopPropagation();
            }
            if(event.cancelBubble !== null) {
                event.cancelBubble = true;
            }
            hideElem(video);
            checkPhoneNumber();
        });
    }

    function addLoadingOverlay(){
        showElem(loadingOverlay);
        loadingOverlay.addEventListener('click', function(event) {
            if(event.stopPropagation){
                event.stopPropagation();
            }
            if(event.cancelBubble !== null) {
                event.cancelBubble = true;
            }
        });
    }

    // Aquto complete method call
    function completeReward(){
        aquto.complete({
            campaignId: campaignId,
            callback: function(response) {
                debug('complete');
                if (response) {
                    hideElem(DOMelements.loading);
                    showElem(DOMelements.eligibleElement);
                    DOMelements.icon.classList.remove("fa-check-circle", "fa-times-circle");

                    if (response.eligible) {
                        debug('complete success');
                        DOMelements.icon.classList.add('fa-check-circle');
                        toggleBodyBgColor('success');
                        DOMelements.text.innerHTML = response.rewardText;
                    } else {
                        debug('complete failure');
                        DOMelements.icon.classList.toggle('fa-times-circle');
                        toggleBodyBgColor('fail');
                        DOMelements.text.innerHTML = 'Lo sentimos, tu número no aplica para ganar megas en' +
                            ' éste momento';
                    }
                } else {
                    debug('complete invalid response');
                    DOMelements.icon.classList.toggle('fa-times-circle');
                    toggleBodyBgColor('fail');
                    DOMelements.text.innerHTML = 'Lo sentimos, hubo un problema para activar los megas.';
                }
            }
        });
    }

    const showPlayer = function(ap){
        event && event.preventDefault();
        stopCountdown(); // Cancel timer if set
        hideElem(DOMelements.phoneEntry);
        hideElem(DOMelements.eligibleElement);
        showElem(DOMelements.video);
        ap !== 0 && autoPlay();
    }

    function autoPlay(){
        player.play();
    }

    const countDown = function() {
        const timer = getElem("timer");
        const timerTextOne = getText('timerTxt1');
        const timerTextTwo = getText('timerTxt2');
        if (count > 0) {
            count--;
            DOMelements.timer.innerHTML = "Ver el video en " + count + " segundos.";
            timer.innerHTML = timerTextOne + count + timerTextTwo;
            startCountdown();
        } else {
            showPlayer(true);
        }
    }

    function getUrlParameter(sParam) {
        let sPageURL = win.location.search.substring(1),
            sURLVariables = sPageURL.split('&') ,
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
            console.log(message, options);
        }
    }

    function getElem(id) {
        return doc.getElementById(id);
    }

    function showElem(elem){
        elem && elem.classList.remove('hide');
    }

    function hideElem(elem){
        elem && elem.classList.add('hide');
    }

    // Start countdown timer
    function startCountdown() {
        timeoutRef = setTimeout("countDown()", 1000);
    }

    // Cancel timer if set
    function stopCountdown() {
        if (timeoutRef) {
            clearTimeout(timeoutRef);
            timeoutRef = null;
            debug('countdown stopped');
        }
    }

    function toggleBodyBgColor(className){
        if(className === 'success'){
            body.classList.remove('fail');
            body.classList.add(className);
        }
        if(className === 'fail'){
            body.classList.remove('success');
            body.classList.add(className);
        }
    }

    function timerFormatter(data){
        return Math.floor(data / 60).toString().padStart(2, '0') + ':' + (data % 60).toString().padStart(2, '0')
    }

    function trackVideoView(clickId, percentageViewed){
        const params = '?clickId=' + clickId + '&percentageViewed=' + percentageViewed;
        const url='//' + be + '/api/campaign/event/videoview' + params;
        debug('tracking', url);
        new Image().src = url;
    }

    window.onload = function(){
        hideElem(DOMelements.loading);
    function setLanguage(){
        const navigatorLang = (navigator.languages && navigator.languages.length) ? navigator.languages[0]
            : navigator.userLanguage || navigator.language || navigator.browserLanguage || defaultLanguages[0];
        const lang = navigatorLang.substring(0,2);

        if (languages.find(function(item){return item === lang})){
            language = lang;
        } else {
            language = languages[0];
        }
    }

    function setLanguageStrings(){
        loading.innerHTML = getText('loading');
        phoneEntryTitle.innerHTML = getText('phoneEntryTitle');
        thanksMsg.innerHTML = getText('thanksMsg');
        text.innerHTML = getText('processingTxt');
        phoneEntrySubTitle.innerHTML = getText('phoneEntrySubTitle');
        phoneEntrySubmitBtn.innerHTML = getText('phoneEntrySubmitBtn');
        phoneEntrySubmitBtn.value = getText('phoneEntrySubmitBtn');
        rewardTextEligible.innerHTML = getText('rewardTextEligible');
        continueBtn.innerHTML = getText('continueBtn');
        eligibleBtn.innerHTML = getText('eligibleBtn');
        ineligibleTitle.innerHTML = getText('ineligibleTitle');
        ineligibleSubTitle.innerHTML = getText('ineligibleSubTitle');
        ineligibleBtn.innerHTML = getText('continueBtn');
        errorMsg.innerHTML = getText('errorMsg');
    }

    function getText(text){
        let strings;
        if(translations[language]){
            strings = translations[language];
        } else {
            strings = translations[defaultLanguages[0]];
        }
        return strings[text]
    }

    function addPhoneInputEventListener(){
       input.maxLength = 18;
       input.onkeydown = function(){
           numberIsValid();
       };
       input.onkeyup = function(){
           numberIsValid();
       };
       input.addEventListener("countrychange", function() {
           numberIsValid();
           input.value = '';
       });
       input.onkeypress = function(e){
           let ASCIICode = (e.which) ? e.which : e.keyCode
           if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
               return false;
           return true;
       };
    }

    function addObjectEntries(){
        if (!Object.entries) {
            Object.entries = function( obj ){
                var ownProps = Object.keys( obj ),
                    i = ownProps.length,
                    resArray = new Array(i); // preallocate the Array
                while (i--)
                    resArray[i] = [ownProps[i], obj[ownProps[i]]];

                return resArray;
            };
        }
    }

    function addArraySome(){
        if (!Array.prototype.some) {
            Array.prototype.some = function(fun, thisArg) {
                'use strict';

                if (this == null) {
                    throw new TypeError('Array.prototype.some called on null or undefined');
                }

                if (typeof fun !== 'function') {
                    throw new TypeError();
                }

                var t = Object(this);
                var len = t.length >>> 0;

                for (var i = 0; i < len; i++) {
                    if (i in t && fun.call(thisArg, t[i], i, t)) {
                        return true;
                    }
                }

                return false;
            };
        }
    }

    function addArrayFilter(){
        if (!Array.prototype.filter){
            Array.prototype.filter = function(func, thisArg) {
                'use strict';
                if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
                    throw new TypeError();

                var len = this.length >>> 0,
                    res = new Array(len), // preallocate array
                    t = this, c = 0, i = -1;

                var kValue;
                if (thisArg === undefined){
                    while (++i !== len){
                        // checks to see if the key was set
                        if (i in this){
                            kValue = t[i]; // in case t is changed in callback
                            if (func(t[i], i, t)){
                                res[c++] = kValue;
                            }
                        }
                    }
                }
                else{
                    while (++i !== len){
                        // checks to see if the key was set
                        if (i in this){
                            kValue = t[i];
                            if (func.call(thisArg, t[i], i, t)){
                                res[c++] = kValue;
                            }
                        }
                    }
                }

                res.length = c; // shrink down array to proper size
                return res;
            };
        }
    }

    function addArrayFind(){
        // https://tc39.github.io/ecma262/#sec-array.prototype.find
        if (!Array.prototype.find) {
            Object.defineProperty(Array.prototype, 'find', {
                value: function(predicate) {
                    // 1. Let O be ? ToObject(this value).
                    if (this == null) {
                        throw TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);

                    // 2. Let len be ? ToLength(? Get(O, "length")).
                    var len = o.length >>> 0;

                    // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                    if (typeof predicate !== 'function') {
                        throw TypeError('predicate must be a function');
                    }

                    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    var thisArg = arguments[1];

                    // 5. Let k be 0.
                    var k = 0;

                    // 6. Repeat, while k < len
                    while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return kValue.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                            return kValue;
                        }
                        // e. Increase k by 1.
                        k++;
                    }

                    // 7. Return undefined.
                    return undefined;
                },
                configurable: true,
                writable: true
            });
        }
    }

    win.onload = function(){
        addEventOverlay();
        showPlayer(0);
        setLanguage();
        setLanguageStrings();
        addPhoneInputEventListener();
        hideElem(loading);

        // Polyfills
        addObjectEntries();
        addArraySome();
        addArrayFilter();
        addArrayFind();
    }

    this.checkPhoneNumber = checkPhoneNumber;
    this.showPlayer = showPlayer;
    this.countDown = countDown;

})(window, document);

