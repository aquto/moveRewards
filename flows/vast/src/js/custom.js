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
    let videoOverlay,
        loadingOverlay;

    let campaignId = getUrlParameter('cid');
    const vastTagUrl = getUrlParameter('vu');
    const debugEnabled = getUrlParameter('d') === '1';
    const bannerUrl = getUrlParameter('b');

    let videoError = false;
    let isEligible = false;

    // Eligible Player Options
    let playerOptions = {
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
    let player = videojs('player', playerOptions);

    // Eligible Player Events
    if (debugEnabled) {
        player.on('ready', function() {
        })

        player.on('play', function () {
            debug('play');
            videoError && hideElem(video);
        })

        player.on('timeupdate', function (e) {
            videoError && hideElem(video);
            let current = (this.currentTime() / this.duration()) * 100;
            debug('update', current);
        })

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
        initialCountry: "mx",
        nationalMode: false,
        onlyCountries: ['mx', 'pe'],
        separateDialCode: true
    };
    const iti = win.intlTelInput(input, inputTelOptions);
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
                                setTimeout("countDown()", 1000);
                            }
                        }
                        if (phone) {
                            timer.classList.remove('hide');
                            setTimeout("countDown()", 1000);
                        }
                    } else {
                        if (phone){
                            debug('phone entered unidentified');
                            count = 10;
                            isEligible = false;
                            showElem(ineligibleUI);
                            hideElem(phoneCheck);
                            showElem(timer);
                            setTimeout("countDown()", 1000);
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
                        body.classList.toggle('success');
                        text.innerHTML = response.rewardText;
                    } else {
                        debug('complete failure');

                        ineligibleMsgElement.add
                        icon.classList.toggle('fa-times-circle');
                        body.classList.toggle('fail');
                        text.innerHTML = 'Lo sentimos, tu número no aplica para ganar megas en éste momento';
                    }
                } else {
                    debug('complete invalid response');

                    icon.classList.toggle('fa-times-circle');
                    body.classList.toggle('fail');
                    text.innerHTML = 'Lo sentimos, hubo un problema para activar los megas.';
                }
            }
        });
    }

    const showPlayer = function(ap){
        event && event.preventDefault();
        hideElem(phoneEntry);
        hideElem(eligibleElement);
        showElem(video);
        ap !== 0 && autoPlay();
    }

    function autoPlay(){
        player.play();
    }

    const countDown = function() {
        let timer = getElem("timer");
        if (count > 0) {
            count--;
            timer.innerHTML = "Ver el video en " + count + " segundos.";
            setTimeout("countDown()", 1000);
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

    win.onload = function(){
        hideElem(loading);
        addEventOverlay();
        showPlayer(0);
    }

    this.checkPhoneNumber = checkPhoneNumber;
    this.showPlayer = showPlayer;
    this.countDown = countDown;

})(window, document);
