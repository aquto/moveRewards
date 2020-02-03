(function(win, doc) {
    // DOM Elements to use
    const loading = getElem('preload');
    const video = getElem('video');
    const eligibleElement = getElem('eligibleWrapper');
    const errorElement = getElem('errorWrapper');
    const ineligibleMsgElement = getElem('ineligibleMessage');
    const body = doc.body;
    const icon = getElem('icon');
    const text = getElem('rewardText');
    const phoneEntry = getElem('phoneEntryWrapper');
    const eligibleUI = getElem('eligible');
    const ineligibleUI = getElem('ineligible');
    const timer = getElem('timer');
    const rewardTextEligible = getElem('rewardTextEligible');
    const phoneCheck = getElem('phoneCheck');
    const input = doc.querySelector("#phone");

    const thanksMsg = getElem('thanksMsg');
    const phoneEntryTitle = getElem('phoneEntryTitle');
    const phoneEntrySubTitle = getElem('phoneEntrySubTitle');
    const phoneEntrySubmitBtn = getElem('phoneEntrySubmitBtn');
    const continueBtn = getElem('continueBtn');
    const eligibleBtn = getElem('eligibleBtn');
    const ineligibleTitle = getElem('ineligibleTitle');
    const ineligibleSubTitle = getElem('ineligibleSubTitle');
    const ineligibleBtn = getElem('ineligibleBtn');
    const errorMsg = getElem('errorMsg');

    let videoOverlay,
        loadingOverlay;

    const campaignId = getUrlParameter('cid');
    const vastTagUrl = getUrlParameter('vu');
    const debugEnabled = getUrlParameter('d') === '1';
    const bannerUrl = getUrlParameter('b');

    const phoneNumberValidation = {
        us: {
            minLen: 11,
            maxLen: 11,
            countryCode: '1'
        },
        pa: {
            minLen: 11,
            maxLen: 11,
            countryCode: '507'
        },
        sv: {
            minLen: 11,
            maxLen: 11,
            countryCode: '503'
        },
        ni: {
            minLen: 11,
            maxLen: 11,
            countryCode: '505'
        },
        cr: {
            minLen: 11,
            maxLen: 11,
            countryCode: '506'
        },
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
        pe: {
            minLen: 11,
            maxLen: 11,
            countryCode: '51'
        },
        br: {
            minLen: 13,
            maxLen: 13,
            countryCode: '55'
        },
        co: {
            minLen: 12,
            maxLen: 12,
            countryCode: '57'
        },
        gt: {
            minLen: 11,
            maxLen: 11,
            countryCode: '502'
        },
        ar: {
            minLen: 10,
            maxLen: 14,
            countryCode: '549'
        }
    };
    const countryDialingCodes = {
        // Mexico
        '52': 'mx',
        // Chile
        '56': 'cl',
        // Ecuador
        '593': 'ec',
        // Argentina
        '549': 'ar',
        // Colombia
        '57': 'co',
        // United States
        '1': 'us',
        // Peru
        '51': 'pe',
        // Brazil
        '55': 'br'
    };

    const defaultCountry = ['mx', 'cl', 'ec', 'ar', 'co', 'us', 'pe', 'br'];
    const defaultLanguage = ['es'];
    const countries = (getUrlParameter('co') && getUrlParameter('co').split(',')) || defaultCountry;
    const languages = (getUrlParameter('l') && getUrlParameter('l').split(',')) || defaultLanguage;
    const hasDefaultCountry = countries.includes('mx');
    const hasValidCountry = countries.some(c => !!phoneNumberValidation[c]);


    let timeoutRef;
    let videoError = false;
    let isEligible = false;
    let language;

    // Eligible Player Options
    const playerOptions = {
        controls: true,
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
        videoError && hideElem(video);
    })

    player.on('timeupdate', function (e) {
        videoError && hideElem(video);
        const current = (this.currentTime() / this.duration()) * 100;
        debug('update', current);
    })

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
        hideElem(ineligibleMsgElement);
        debug("vast.adError", event.error);
        hideElem(eligibleElement);
        videoError && hideElem(video);
        showElem(errorElement);
        videoError = true;
    });

    player.on("vast.contentEnd", function() {
        debug("vast.contentEnd");
        hideElem(video);
        if (!videoError && isEligible){ // If vast.adError Event then stop the process.
            showElem(eligibleElement);
            completeReward();
        }
        if(!isEligible && !videoError){
            debug('not eligible');
            hideElem(video);
            showElem(ineligibleMsgElement);
        }
    });

    const inputTelOptions = {
        allowDropdown: true,
        formatOnDisplay: true,
        initialCountry: (hasDefaultCountry && "mx") || "",
        nationalMode: false,
        onlyCountries: (hasValidCountry && countries) || ['mx'],
        separateDialCode: true
    };

    const iti = win.intlTelInput(input, inputTelOptions);
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

       for (const [dialingCode, cc] of entries) {
           if (phoneNumber.substring(0, dialingCode.length) === dialingCode) {
               return cc;
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
                    if (response.identified) {
                        if (response.eligible) {
                            isEligible = true;
                            if(phone){
                                debug('phone entered eligible');
                                count = 5;
                                showElem(eligibleUI);
                                hideElem(phoneCheck);
                                rewardTextEligible.innerHTML = response.rewardText;
                            } else{
                                debug('identified & eligible');
                                hideElem(loading);
                                showElem(video);
                                player.play();
                            }
                        } else {
                            isEligible = false;
                            if (phone) {
                                debug('phone entered ineligible');
                                count = 5;
                                showElem(ineligibleUI);
                                hideElem(phoneCheck);
                            } else {
                                debug('identified + ineligible')
                                count = 10;
                                hideElem(loading);
                                hideElem(video);
                                showElem(phoneEntry);
                                hideElem(phoneCheck);
                                showElem(ineligibleUI);
                                showElem(timer);
                                startCountdown();
                            }
                        }
                        if (phone) {
                            timer.classList.remove('hide');
                            startCountdown();
                        }
                    } else {
                        if (phone){
                            debug('phone entered unidentified');
                            count = 10;
                            isEligible = false;
                            showElem(ineligibleUI);
                            hideElem(phoneCheck);
                            showElem(timer);
                            startCountdown();
                        } else {
                            debug('unidentified');
                            isEligible = false;
                            hideElem(loading);
                            hideElem(video);
                            showElem(phoneEntry);
                        }
                    }
                } else {
                    debug('error.checkAppEligibility');
                    hideElem(loading);
                    hideElem(video);
                    showElem(errorElement);
                }
            }
        });
    }

    function addEventOverlay(){
        videoOverlay = getElem('videoOverlay');
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
        loadingOverlay = getElem('loadingOverlay');
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
                    hideElem(loading);
                    showElem(eligibleElement);
                    icon.classList.remove("fa-check-circle", "fa-times-circle");

                    if (response.eligible) {
                        debug('complete success');
                        icon.classList.add('fa-check-circle');
                        toggleBodyBgColor('success');
                        text.innerHTML = response.rewardText;
                    } else {
                        debug('complete failure');
                        ineligibleMsgElement.add
                        icon.classList.toggle('fa-times-circle');
                        toggleBodyBgColor('fail');
                        text.innerHTML = 'Lo sentimos, tu número no aplica para ganar megas en éste momento';
                    }
                } else {
                    debug('complete invalid response');
                    icon.classList.toggle('fa-times-circle');
                    toggleBodyBgColor('fail');
                    text.innerHTML = 'Lo sentimos, hubo un problema para activar los megas.';
                }
            }
        });
    }

    const showPlayer = function(ap){
        event && event.preventDefault();
        stopCountdown(); // Cancel timer if set
        hideElem(phoneEntry);
        hideElem(eligibleElement);
        showElem(video);
        ap !== 0 && autoPlay();
    }

    function autoPlay(){
        player.play();
    }

    const countDown = function() {
        const timer = getElem("timer");
        if (count > 0) {
            count--;
            timer.innerHTML = "Ver el video en " + count + " segundos.";
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

    function setLanguage(){
        const navigatorLang = (navigator.languages && navigator.languages.length) ? navigator.languages[0]
            : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
        const lang = navigatorLang.substring(0,2);

        if (languages.find(item => item === lang)){
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
        rewardTextEligible.innerHTML = getText('rewardTextEligible');
        continueBtn.innerHTML = getText('continueBtn');
        eligibleBtn.innerHTML = getText('eligibleBtn');
        ineligibleTitle.innerHTML = getText('ineligibleTitle');
        ineligibleSubTitle.innerHTML = getText('ineligibleSubTitle');
        ineligibleBtn.innerHTML = getText('continueBtn');
        errorMsg.innerHTML = getText('errorMsg');
    }

    function getText(text){
        const strings = !!translations[language] || translations[defaultLanguage];
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

    win.onload = function(){
        hideElem(loading);
        addEventOverlay();
        showPlayer(0);
        setLanguage();
        setLanguageStrings();
        addPhoneInputEventListener();
    }

    this.checkPhoneNumber = checkPhoneNumber;
    this.showPlayer = showPlayer;
    this.countDown = countDown;

})(window, document);

