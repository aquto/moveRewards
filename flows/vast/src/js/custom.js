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
    let overlayVideo;

    let campaignId = getUrlParameter('cid');
    const vastTagUrl = getUrlParameter('vu');
    const debugEnabled = getUrlParameter('d') === '1';

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
        poster: '../assets/images/watch-this-eligible.png',
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
        })

        player.on('timeupdate', function (e) {
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
        ineligibleMsgElement.classList.add('hide');
        debug("vast.adError", event.error);
        eligibleElement.classList.add('hide');
        errorElement.classList.remove('hide');
        videoError = true;
    });

    player.on("vast.contentEnd", function() {
        debug("vast.contentEnd");
        video.classList.add('hide');
        if (!videoError && isEligible){ // If vast.adError Event then stop the process.
            eligibleElement.classList.remove('hide');
            completeReward();
        }
        if(!isEligible && !videoError){
            debug('not eligible');
            ineligibleMsgElement.classList.remove('hide');
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

        aquto.checkAppEligibility({
            campaignId: campaignId,
            phoneNumber: phone,
            callback: function(response) {
                debug('checkAppEligibility');
                if (response) {
                    response.identified = true;
                    response.eligible = true;
                    if (response.identified) {
                        if (response.eligible) {
                            isEligible = true;
                            if(phone){
                                debug('phone entered eligible');
                                count = 5;
                                eligibleUI.classList.remove('hide');
                                phoneCheck.classList.add('hide');
                                rewardTextEligible.innerHTML = response.rewardText;
                            } else{
                                debug('identified & eligible');
                                loading.classList.add('hide');
                                overlayVideo.classList.add('hide');
                                video.classList.remove('hide');
                                player.play();
                            }
                        } else {
                            isEligible = false;
                            if (phone) {
                                debug('phone entered ineligible');
                                count = 5;
                                ineligibleUI.classList.remove('hide');
                                phoneCheck.classList.add('hide');
                            } else {
                                debug('identified + ineligible')
                                count = 10;
                                loading.classList.add('hide');
                                video.classList.add('hide');
                                phoneEntry.classList.remove('hide');
                                phoneCheck.classList.add('hide');
                                overlayVideo.classList.add('hide');
                                ineligibleUI.classList.remove('hide');
                                timer.classList.remove('hide');
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
                            ineligibleUI.classList.remove('hide');
                            phoneCheck.classList.add('hide');
                            timer.classList.remove('hide');
                            setTimeout("countDown()", 1000);
                        } else {
                            debug('unidentified');
                            isEligible = false;
                            loading.classList.add('hide');
                            video.classList.add('hide');
                            overlayVideo.classList.add('hide');
                            phoneEntry.classList.remove('hide');
                        }

                    }
                } else {
                    debug('error.checkAppEligibility');
                    loading.classList.add('hide');
                    errorElement.classList.remove('hide');
                }
            }
        });
    }

    function addOverlay(){
        overlayVideo = getElem('videoOverlay');
        overlayVideo.addEventListener('click', function(event) {
            if(event.stopPropagation){
                event.stopPropagation();
            }
            if(event.cancelBubble !== null) {
                event.cancelBubble = true;
            }
            checkPhoneNumber();
        });
    }

    // Aquto complete method call
    function completeReward(){
        aquto.complete({
            campaignId: campaignId,
            callback: function(response) {
                debug('complete');
                if (response) {
                    loading.classList.add('hide');
                    eligibleElement.classList.remove('hide');
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
        phoneEntry.classList.add('hide');
        eligibleElement.classList.add('hide');
        video.classList.remove('hide');
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

    win.onload = function(){
        loading.classList.add('hide');
        addOverlay();
        showPlayer(0);
    }

    this.checkPhoneNumber = checkPhoneNumber;
    this.showPlayer = showPlayer;
    this.countDown = countDown;

})(window, document);
