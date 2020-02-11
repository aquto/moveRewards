(function(win, doc) {
    // DOM Elements to use
    var global = function(){
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
        }

        function getElement(el){
            return DOMelements[el]
        }

        function getDOMElement(id){
            return doc.getElementById(id);
        }

        return{
            getElement: getElement,
            getDOMElement: getDOMElement
        }
    }();

    let videoOverlay,
        loadingOverlay;

    const campaignId = getUrlParameter('cid');
    const vastTagUrl = getUrlParameter('vu');
    const debugEnabled = getUrlParameter('d') === '1';
    const bannerUrl = getUrlParameter('b');

    const percentageThresholds = [0, 25, 50, 75, 95];

    /** Check if Aquto backend hostname has been passed in */
    const scriptParams = parseScriptQuery(document.getElementById('aquto-api'));
    const be = scriptParams.be || 'app.aquto.com';
    const ow = scriptParams.ow || 'ow.aquto.com';

    let timeoutRef;
    let videoError = false;
    let isEligible = false;
    let vastVideoComplete = false;
    let responseCopy;

    // Eligible Player Options
    const playerOptions = {
        controls: false,
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
        videoError && hideElem(global.getElement('video'));
        if(!vastVideoComplete) {
            global.getElement('currentTimeTxt').innerHTML = timerFormatter(Math.floor(this.currentTime()));
        }
    });

    function setTimerLabels(currentTime, duration){
        global.getElement('currentTimeTxt').innerHTML = timerFormatter(Math.floor(currentTime));
        global.getElement('durationTxt').innerHTML = timerFormatter(Math.floor(duration));
    }

    player.on('timeupdate', function (e) {
        videoError && hideElem(global.getElement('video'));
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
        hideElem(global.getElement('ineligibleMsgElement'));
        debug("vast.adError", event.error);
        hideElem(global.getElement('eligibleElement'));
        videoError && hideElem(global.getElement('video'));
        showElem(global.getElement('errorElement'));
        videoError = true;
    });

    player.on("vast.contentEnd", function() {
        debug("vast.contentEnd");
        hideElem(global.getElement('video'));
        if (!videoError && isEligible){ // If vast.adError Event then stop the process.
            showElem(global.getElement('eligibleElement'));
            completeReward();
        }
        if(!isEligible && !videoError){
            debug('not eligible');
            hideElem(global.getElement('video'));
            showElem(global.getElement('ineligibleMsgElement'));
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
    const iti = win.intlTelInput(global.getElement('input'), inputTelOptions);
    let count = 5;

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
                    showElem(global.getElement('videoTimer'))
                    responseCopy = Object.assign({}, response);
                    if (response.identified) {
                        if (response.eligible) {
                            isEligible = true;
                            if(phone){
                                debug('phone entered eligible');
                                count = 5;
                                showElem(global.getElement('eligibleUI'));
                                hideElem(global.getElement('phoneCheck'));
                                global.getElement('rewardTextEligible').innerHTML = response.rewardText;
                            } else{
                                debug('identified & eligible');
                                hideElem(global.getElement('loading'));
                                showElem(global.getElement('video'));
                                player.play();
                            }
                        } else {
                            isEligible = false;
                            if (phone) {
                                debug('phone entered ineligible');
                                count = 5;
                                showElem(global.getElement('ineligibleUI'));
                                hideElem(global.getElement('phoneCheck'));
                            } else {
                                debug('identified + ineligible')
                                count = 10;
                                hideElem(global.getElement('loading'));
                                hideElem(global.getElement('video'));
                                showElem(global.getElement('phoneEntry'));
                                hideElem(global.getElement('phoneCheck'));
                                showElem(global.getElement('ineligibleUI'));
                                showElem(global.getElement('timer'));
                                startCountdown();
                            }
                        }
                        if (phone) {
                            global.getElement('timer').classList.remove('hide');
                            startCountdown();
                        }
                    } else {
                        if (phone){
                            debug('phone entered unidentified');
                            count = 10;
                            isEligible = false;
                            showElem(global.getElement('ineligibleUI'));
                            hideElem(global.getElement('phoneCheck'));
                            showElem(global.getElement('timer'));
                            startCountdown();
                        } else {
                            debug('unidentified');
                            isEligible = false;
                            hideElem(global.getElement('loading'));
                            hideElem(global.getElement('video'));
                            showElem(global.getElement('phoneEntry'));
                        }
                    }
                } else {
                    debug('error.checkAppEligibility');
                    hideElem(global.getElement('loading'));
                    hideElem(global.getElement('video'));
                    showElem(global.getElement('errorElement'));
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
            hideElem(global.getElement('video'));
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
                    hideElem(global.getElement('loading'));
                    showElem(global.getElement('eligibleElement'));
                    global.getElement('icon').classList.remove("fa-check-circle", "fa-times-circle");

                    if (response.eligible) {
                        debug('complete success');
                        global.getElement('icon').classList.add('fa-check-circle');
                        toggleBodyBgColor('success');
                        global.getElement('text').innerHTML = response.rewardText;
                    } else {
                        debug('complete failure');
                        // ineligibleMsgElement.add
                        global.getElement('ineligibleMsgElement').add; // review after test
                        global.getElement('icon').classList.toggle('fa-times-circle');
                        toggleBodyBgColor('fail');
                        global.getElement('text').innerHTML = 'Lo sentimos, tu número no aplica para ganar megas en' +
                            ' éste momento';
                    }
                } else {
                    debug('complete invalid response');
                    global.getElement('icon').classList.toggle('fa-times-circle');
                    toggleBodyBgColor('fail');
                    global.getElement('text').innerHTML = 'Lo sentimos, hubo un problema para activar los megas.';
                }
            }
        });
    }

    const showPlayer = function(ap){
        event && event.preventDefault();
        stopCountdown(); // Cancel timer if set
        hideElem(global.getElement('phoneEntry'));
        hideElem(global.getElement('eligibleElement'));
        showElem(global.getElement('video'));
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
            global.getElement('body').classList.remove('fail');
            global.getElement('body').classList.add(className);
        }
        if(className === 'fail'){
            global.getElement('body').classList.remove('success');
            global.getElement('body').classList.add(className);
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

    function repeatString(string, times) {
        let repeatedString = "";
        while (times > 0) {
            repeatedString += string;
            times--;
        }
        return repeatedString;
    }

    window.onload = function(){
        hideElem(global.getElement('loading'));
        addEventOverlay();
        showPlayer(0);

        // Adding String.prototype.padStart compatibility for IE 11
        if (!String.prototype.padStart) {
            String.prototype.padStart = function padStart(targetLength,padString) {
                targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
                padString = String((typeof padString !== 'undefined' ? padString : ' '));
                if (this.length > targetLength) {
                    return String(this);
                }
                else {
                    targetLength = targetLength-this.length;
                    if (targetLength > padString.length) {
                        repeatString(padString, targetLength/padString.length);
                    }
                    return padString.slice(0,targetLength) + String(this);
                }
            };
        }
    }

    this.checkPhoneNumber = checkPhoneNumber;
    this.showPlayer = showPlayer;
    this.countDown = countDown;

})(window, document);

