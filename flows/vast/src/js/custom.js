(function(win, doc) {
    // DOM Elements to use
    var DOMelements = {
        body: doc.body,
        video: getDOMElement('video'),
        eligibleElement: getDOMElement('eligibleWrapper'),
        errorElement: getDOMElement('errorWrapper'),
        ineligibleMsgElement: getDOMElement('ineligibleMessage'),
        icon: getDOMElement('icon'),
        phoneEntry: getDOMElement('phoneEntryWrapper'),
        eligibleUI: getDOMElement('eligible'),
        ineligibleUI: getDOMElement('ineligible'),
        timer: getDOMElement('timer'),
        phoneCheck: getDOMElement('phoneCheck'),
        input: doc.querySelector("#phone"),
        videoTimer: getDOMElement('videoTimer'),
        currentTimeTxt: getDOMElement('currentTime'),
        durationTxt: getDOMElement('duration'),
        loadingWrapper: getDOMElement('loadingWrapper'),
        loading: getDOMElement('loading'),
        phoneEntryTitle: getDOMElement('phoneEntryTitle'),
        thanksMsg: getDOMElement('thanksMsg'),
        processingText: getDOMElement('processingText'),
        phoneEntrySubTitle: getDOMElement('phoneEntrySubTitle'),
        phoneEntrySubmitBtn: getDOMElement('phoneEntrySubmitBtn'),
        rewardTextEligible: getDOMElement('rewardTextEligible'),
        continueBtn: getDOMElement('continueBtn'),
        eligibleBtn: getDOMElement('eligibleBtn'),
        ineligibleTitle: getDOMElement('ineligibleTitle'),
        ineligibleSubTitle: getDOMElement('ineligibleSubTitle'),
        ineligibleBtn: getDOMElement('ineligibleBtn'),
        errorMsg: getDOMElement('errorMsg')
    };

    let videoOverlay = getDOMElement('videoOverlay');
    let loadingOverlay = getDOMElement('loadingOverlay');

    const campaignId = getUrlParameter('cid');
    const vastTagUrl = getUrlParameter('vu');
    const debugEnabled = getUrlParameter('d') === '1';
    const bannerUrl = getUrlParameter('b');
    const disableControls = getUrlParameter('dc') === '1';
    const publisherSiteUuid = getUrlParameter('psid');
    const channel = getUrlParameter('ch');
    const userCountries = getUrlParameter('co') && getUrlParameter('co').split(',');
    const userLanguages = getUrlParameter('l') && getUrlParameter('l').split(',');

    const percentageThresholds = [0, 25, 50, 75, 95];

    const impressionUrl = getUrlParameter('trimp');
    const bannerClickUrl = getUrlParameter('trclk');
    const videoUrls = {
        start: getUrlParameter('trvst'),
        25: getUrlParameter('trv25'),
        50: getUrlParameter('trv50'),
        75: getUrlParameter('trv75'),
        95: getUrlParameter('trv95'),
        complete: getUrlParameter('trvc')
    };

    // const pixelSubType = 'mrflowsvast';
    const channelDelimiter = '-';
    const channelSuffixes = {
        impression: 'impression',
        autoIdentify: 'click',
        phoneEntry: 'phonenumber',
        videoStart: 'videostart',
        videoEnd: 'videoend',
        videoError: 'videoerror'
    }

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
    const availableCountries = ['mx', 'cl', 'ar', 'co', 'pe', 'br'];
    const defaultCountries = availableCountries;
    const countries = intersect(userCountries, availableCountries) || defaultCountries;
    const country = countries[0];
    const availableLanguages = ['es', 'pt', 'en'];
    const defaultLanguages = availableLanguages;
    const languages = intersect(userLanguages, availableLanguages) || defaultLanguages;
    const navLanguage = getNavigatorLanguage();
    const lang = languages.find( function (l) {return navLanguage === l}) || languages[0];

    // Strings Translation
    const messages = translations[lang];

    let timeoutRef;
    let videoStarted = false;
    let videoError = false;
    let isEligible = false;
    let vastVideoComplete = false;
    let responseCopy;

    // Player Options
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
    player.on('play', function() {
        debug('play');
        videoError && hideElem(DOMelements.video);
        if (!vastVideoComplete && disableControls) {
            DOMelements.currentTimeTxt.innerHTML = timerFormatter(Math.floor(this.currentTime()));
        }
        if (!videoStarted) {
            videoStarted = true;
            videoStartPixel();
        }
    });

    player.on('timeupdate', function(e) {
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
        if (!videoError) {
            videoEndPixel();
            new Image().src = videoUrls.complete;
            if (isEligible) {
                showElem(DOMelements.eligibleElement);
                completeReward();
            }
            else {
                debug('not eligible');
                hideElem(DOMelements.video);
                showElem(DOMelements.ineligibleMsgElement);
            }
        } else {
            videoErrorPixel();
        }
    });

    if (debugEnabled) {
        // player.on('ready', function() {
        // })
        player.on("click", function(event) {
            debug("click", event);
        });

        player.on("vast.adClick", function(event) {
            debug("vast.adClick", event);
        });
    }

    const inputTelOptions = {
        allowDropdown: true,
        formatOnDisplay: true,
        initialCountry: country,
        nationalMode: false,
        onlyCountries: countries,
        separateDialCode: true
    };
    const iti = win.intlTelInput(DOMelements.input, inputTelOptions);
    let count = 5;

    // Aquto checkAppEligibility method call
    const checkPhoneNumber = function() {
        event && event.preventDefault();
        const phone = iti.getNumber().replace('+', '');
        addLoadingOverlay();

        const callChannel = getChannel(channel, phone ? channelSuffixes.phoneEntry : channelSuffixes.autoIdentify);
        debug('checkPhoneNumber', { phone, publisherSiteUuid, callChannel });
        if (!phone){
            trackUrl('custom bannerClick pixel', bannerClickUrl);
        }

        aquto.checkAppEligibility({
            campaignId: campaignId,
            phoneNumber: phone,
            publisherSiteUuid: publisherSiteUuid,
            channel: callChannel,
            callback: function(response) {
                debug('checkAppEligibilityResponse', response);

                hideElem(loadingOverlay);
                if (response) {
                    hideElem(videoOverlay);
                    if (disableControls) showElem(DOMelements.videoTimer)
                    responseCopy = Object.assign({}, response);
                    if (response.identified) {
                        if (response.eligible) {
                            isEligible = true;
                            if (phone) {
                                debug('phone entered eligible');
                                count = 5;
                                showElem(DOMelements.eligibleUI);
                                hideElem(DOMelements.phoneCheck);
                                DOMelements.rewardTextEligible.innerHTML = response.rewardText;
                            } else {
                                debug('identified & eligible');
                                hideElem(DOMelements.loadingWrapper);
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
                                hideElem(DOMelements.loadingWrapper);
                                hideElem(DOMelements.video);
                                showElem(DOMelements.phoneEntry);
                                hideElem(DOMelements.phoneCheck);
                                showElem(DOMelements.ineligibleUI);
                                showElem(DOMelements.timer);
                                DOMelements.timer.innerHTML = timerMessage(count);
                                startCountdown();
                            }
                        }
                        if (phone) {
                            showElem(DOMelements.timer);
                            DOMelements.timer.innerHTML = timerMessage(count);
                            startCountdown();
                        }
                    } else {
                        if (phone) {
                            debug('phone entered unidentified');
                            count = 10;
                            isEligible = false;
                            showElem(DOMelements.ineligibleUI);
                            hideElem(DOMelements.phoneCheck);
                            showElem(DOMelements.timer);
                            DOMelements.timer.innerHTML = timerMessage(count);
                            startCountdown();
                        } else {
                            debug('unidentified');
                            isEligible = false;
                            hideElem(DOMelements.loadingWrapper);
                            hideElem(DOMelements.video);
                            showElem(DOMelements.phoneEntry);
                        }
                    }
                } else {
                    debug('error.checkAppEligibility');
                    hideElem(DOMelements.loadingWrapper);
                    hideElem(DOMelements.video);
                    showElem(DOMelements.errorElement);
                }
            }
        });
    }

    const showPlayer = function(ap) {
        event && event.preventDefault();
        stopCountdown(); // Cancel timer if set
        hideElem(DOMelements.phoneEntry);
        hideElem(DOMelements.eligibleElement);
        showElem(DOMelements.video);
        ap !== 0 && autoPlay();
    }

    const countDown = function() {
        const timer = DOMelements.timer;
        if (count > 0) {
            count--;
            timer.innerHTML = timerMessage(count);
            startCountdown();
        } else {
            showPlayer(true);
        }
    }

    // Aquto complete method call
    function completeReward() {
        aquto.complete({
            campaignId: campaignId,
            callback: function(response) {
                debug('complete');
                if (response) {
                    hideElem(DOMelements.loadingWrapper);
                    showElem(DOMelements.eligibleElement);
                    DOMelements.icon.classList.remove("fa-check-circle", "fa-times-circle");

                    if (response.eligible) {
                        debug('complete success');
                        DOMelements.icon.classList.add('fa-check-circle');
                        toggleBodyBgColor('success');
                        DOMelements.processingText.innerHTML = response.rewardText;
                    } else {
                        debug('complete failure');
                        DOMelements.icon.classList.toggle('fa-times-circle');
                        toggleBodyBgColor('fail');
                        DOMelements.processingText.innerHTML = messages.ineligibleMsg;
                    }
                } else {
                    debug('complete invalid response');
                    DOMelements.icon.classList.toggle('fa-times-circle');
                    toggleBodyBgColor('fail');
                    DOMelements.processingText.innerHTML = messages.completeFailMsg;
                }
            }
        });
    }

    // Phone Number Entry Validation
    function numberIsValid() {
        const phoneNumber = iti.getNumber().replace('+', '');
        const countryCode = findCountry();
        const isValid = countryCode && phoneNumber.length >= phoneNumberValidation[countryCode].minLen && phoneNumber.length <= phoneNumberValidation[countryCode].maxLen
        DOMelements.phoneEntrySubmitBtn.disabled = !isValid
    }

    function setTimerLabels(currentTime, duration) {
        if (disableControls) {
            DOMelements.currentTimeTxt.innerHTML = timerFormatter(Math.floor(currentTime));
            DOMelements.durationTxt.innerHTML = timerFormatter(Math.floor(duration));
        }
    }

    function findCountry() {
        const phoneNumber = iti.getNumber().replace('+', '');
        const entries = Object.entries(countryDialingCodes);

        for (let i = 0; i < entries.length; i++) {
            if (phoneNumber.substring(0, entries[i][0].length) === entries[i][0]) {
                return entries[i][1];
            }
        }
    }

    function addEventOverlay() {
        videoOverlay.addEventListener('click', function(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            if (event.cancelBubble !== null) {
                event.cancelBubble = true;
            }
            hideElem(video);
            checkPhoneNumber();
        });
    }

    function addLoadingOverlay() {
        showElem(loadingOverlay);
        loadingOverlay.addEventListener('click', function(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            if (event.cancelBubble !== null) {
                event.cancelBubble = true;
            }
        });
    }

    function autoPlay() {
        player.play();
    }

    function getUrlParameter(sParam) {
        let sPageURL = win.location.search.substring(1),
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

    function debug(message, options) {
        if (debugEnabled) {
            console.log(message, options);
        }
    }

    function getDOMElement(id) {
        return doc.getElementById(id);
    }

    function showElem(elem) {
        elem && elem.classList.remove('hide');
    }

    function hideElem(elem) {
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

    function toggleBodyBgColor(className) {
        if (className === 'success') {
            DOMelements.body.classList.remove('fail');
            DOMelements.body.classList.add(className);
        }
        if (className === 'fail') {
            DOMelements.body.classList.remove('success');
            DOMelements.body.classList.add(className);
        }
    }

    function timerFormatter(data) {
        return Math.floor(data / 60).toString().padStart(2, '0') + ':' + (data % 60).toString().padStart(2, '0')
    }

    function impressionPixel() {
        trackingPixel(channelSuffixes.impression);
        trackUrl('custom impression pixel', impressionUrl)
    }

    function videoStartPixel() {
        trackingPixel(channelSuffixes.videoStart);
        trackUrl('custom video start pixel', videoUrls.start);
    }

    function videoEndPixel() {
        trackingPixel(channelSuffixes.videoEnd);
        trackUrl('custom video end pixel', videoUrls.complete);
    }

    function videoErrorPixel() {
        trackingPixel(channelSuffixes.videoError);
    }

    function trackingPixel(channelSuffix) {
        const params = '?campaignId=' + encodeURIComponent(campaignId)
          + '&publisherSiteUuid=' + encodeURIComponent(orEmptyStr(publisherSiteUuid))
          + '&channel=' + encodeURIComponent(getChannel(channel, channelSuffix));
        const relativePath = 'datarewards/pixel';

        // Generic campaign event
        // const params = '?subType=' + encodeURIComponent(pixelSubType)
        //   '&campaignId=' + encodeURIComponent(campaignId)
        //   + '&source=' + encodeURIComponent(orEmptyStr(publisherSiteUuid))
        //   + '&details=' + encodeURIComponent(getChannel(channel, channelSuffix));
        // const relativePath = 'event/generic';

        pixelUrl(relativePath, params, 'tracking url');
    }

    function trackVideoView(clickId, percentageViewed) {
        const params = '?clickId=' + orEmptyStr(clickId) + '&percentageViewed=' + percentageViewed;
        const relativePath = 'event/videoview';
        pixelUrl(relativePath, params, 'video tracking url');
        trackUrl('video tracking url', videoUrls[percentageViewed]);
    }

    function pixelUrl(relativePath, params, name) {
        const url = '//' + be + '/api/campaign/' + relativePath + params;
        debug(name, url);
        new Image().src = url;
    }

    function getNavigatorLanguage() {
        const navigatorLang = (navigator.languages && navigator.languages.length) ? navigator.languages[0] :
            navigator.userLanguage || navigator.language || navigator.browserLanguage || defaultLanguages[0];
        return navigatorLang.substring(0, 2);
    }

    function setElementsText() {
        const elements = [
            DOMelements.loading,
            DOMelements.phoneEntryTitle,
            DOMelements.thanksMsg,
            DOMelements.processingText,
            DOMelements.phoneEntrySubTitle,
            DOMelements.phoneEntrySubmitBtn,
            DOMelements.rewardTextEligible,
            DOMelements.continueBtn,
            DOMelements.eligibleBtn,
            DOMelements.ineligibleTitle,
            DOMelements.ineligibleSubTitle,
            DOMelements.ineligibleBtn,
            DOMelements.errorMsg,
            DOMelements.timer,
        ];

        for (let i = 0; i < elements.length; i ++){
            if(typeof elements[i].id === 'string'){
                elements[i].innerHTML = messages[elements[i].id].replace(/\n/, '<br/>');
            }
        }

    }

    function addPhoneInputEventListener() {
        DOMelements.input.maxLength = 18;
        DOMelements.input.onkeydown = function() {
            numberIsValid();
        };
        DOMelements.input.onkeyup = function() {
            numberIsValid();
        };
        DOMelements.input.addEventListener("countrychange", function() {
            numberIsValid();
            DOMelements.input.value = '';
        });
        DOMelements.input.onkeypress = function(e) {
            let ASCIICode = (e.which) ? e.which : e.keyCode
            if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
                return false;
            return true;
        };
    }

    function timerMessage(count){
        return messages.timer.replace(/\{count\}/, count);
    }

    function getChannel(channel, channelSuffix) {
        const delimiter = channel ? channelDelimiter : '';
        return orEmptyStr(channel) + delimiter + orEmptyStr(channelSuffix);
    }

    function orEmptyStr(v) {
        return v === undefined || v === null ? '' : v;
    }

    function trackUrl(name, url) {
        if (url) {
            debug(name, url);
            new Image().src = url;
        }
    }

    function init() {
        addEventOverlay();
        showPlayer(0);
        setElementsText();
        addPhoneInputEventListener();
        hideElem(DOMelements.loadingWrapper);
        // Fire impression pixel
        impressionPixel();

        // Store in window scope so HTML can access
        this.checkPhoneNumber = checkPhoneNumber;
        this.showPlayer = showPlayer;
        this.countDown = countDown;
    }

    init();
})(window, document);
