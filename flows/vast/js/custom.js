// DOM Elements to use
const loading = document.getElementById('preload');
const video = document.getElementById('video');
const eligibleElement = document.getElementById('eligibleWrapper');
const errorElement = document.getElementById('errorWrapper');
const ineligibleMsgElement = document.getElementById('ineligibleMessage');
const body = document.body;
const icon = document.getElementById('icon');
const text = document.getElementById('rewardText');
const phoneEntry = document.getElementById('phoneEntryWrapper');
const eligibleUI = document.getElementById('eligible');
const ineligibleUI = document.getElementById('ineligible');
const timer = document.getElementById('timer');
const rewardTextEligible = document.getElementById('rewardTextEligible');
const phoneCheck = document.getElementById('phoneCheck');
const input = document.querySelector("#phone");

const campaignId = getUrlParameter('cid');
const vastTagUrl = getUrlParameter('vu');
var videoError = false;
var isEligible = false;

// Eligible Player Options
const playerOptions = {
    controls: true,
    autoplay: false,
    preload: true,
    nativeControlsForTouch: false,
    inactivityTimeout: 0,
    poster: './images/watch-this-ineligible.png',
    sources: [{
        type: 'video/mp4',
        src: './videos/placeholder.mp4'
    }],
    plugins: {
        vastClient: {
            // adTagUrl: vastTagUrl,
            adTagUrl: 'test-01.xml', // remove After test
            preferredTech: 'html5',
            adsEnabled: true
        }
    }
};

// Eligible Player Initialization
var player = videojs('player', playerOptions);

// Eligible Player Events
player.on('ready', function() {
    checkAppEligibility();
})

player.on('play', function() {
    console.log('play');
})

player.on('timeupdate', function(e) {
    var current = (this.currentTime() / this.duration()) * 100;
    console.log('update', current);
})

player.on("click", function(event) {
    console.log("click", event);
});

player.on("vast.adClick", function(event) {
    console.log("vast.adClick", event);
});

player.on("vast.adError", function(event) {
    console.log("vast.adError", event.error);
    eligibleElement.classList.add('hide');
    errorElement.classList.remove('hide');
    videoError = true;
});

player.on("vast.contentEnd", function(event) {
    console.log("vast.contentEnd");
    video.classList.add('hide');
    if (!videoError && isEligible){ // If vast.adError Event then stop the process.
        eligibleElement.classList.remove('hide');
        completeReward();
    }
    if(!isEligible){
        ineligibleMsgElement.classList.remove('hide');
    }
});

const inputTelOptions = {
    allowDropdown: true,
    formatOnDisplay: true,
    initialCountry: "mx",
    nationalMode: false,
    onlyCountries: ['mx', 'br'],
    separateDialCode: true
};
const iti = window.intlTelInput(input, inputTelOptions);
var count = 5;

// Aquto checkAppEligibility method call
function checkAppEligibility(){
    var phone = iti.getNumber().replace('+', '');
    event && event.preventDefault();
    aquto.checkAppEligibility({
        campaignId: campaignId,
        phoneNumber: phone,
        callback: function(response) {
            console.log('checkAppEligibility', response);
            // Test and skip eligible & identified scenario and show phone Entry
            // if(!phone){
            //     response.identified = false;
            // }
            if (response) {
                if (response.identified) {
                    if (response.eligible) {
                        isEligible = true;
                        if(phone){
                            count = 5;
                            eligibleUI.classList.remove('hide');
                            phoneCheck.classList.add('hide');
                            rewardTextEligible.innerHTML = response.rewardText;
                        } else{
                            console.log('identified & eligible');
                            player.poster('./images/watch-this-eligible.png');
                            loading.classList.add('hide');
                            video.classList.remove('hide');
                        }
                    } else {
                        isEligible = false;
                        if(phone){
                            count = 10;
                            ineligibleUI.classList.remove('hide');
                            phoneCheck.classList.add('hide');
                        }else{
                            console.log('identified + ineligible')
                            loading.classList.add('hide');
                            // Remove iframe from DOM
                            window.parent.document.getElementById('aqutoTag')
                                .parentNode.removeChild(window.parent.document.getElementById('aqutoTag'));
                        }
                    }
                    if(phone){
                        timer.classList.remove('hide');
                        setTimeout("countDown()", 1000);
                    }
                } else {
                    if(response.status === 'ineligiblenet'){
                        count = 10;
                        ineligibleUI.classList.remove('hide');
                        phoneCheck.classList.add('hide');
                        if(phone){
                            timer.classList.remove('hide');
                            setTimeout("countDown()", 1000);
                        }
                    }else{
                        console.log('Unidentified');
                        isEligible = false;
                        loading.classList.add('hide');
                        phoneEntry.classList.remove('hide');
                    }
                }
            } else {
                console.log('error.checkAppEligibility');
                loading.classList.add('hide');
                errorElement.classList.remove('hide');
            }
        }
    });
}

// Aquto complete method call
function completeReward(){
    aquto.complete({
        campaignId: campaignId,
        callback: function(response) {
        console.log('complete', response);

        if (response) {
            loading.classList.add('hide');
            eligibleElement.classList.remove('hide');
            icon.classList.remove("fa-check-circle", "fa-times-circle");
            if (response.eligible) {
                icon.classList.add('fa-check-circle');
                body.classList.toggle('success');
                text.innerHTML = response.rewardText;
            } else {
                icon.classList.toggle('fa-times-circle');
                body.classList.toggle('fail');
                text.innerHTML = 'Lo sentimos, tu número no aplica para ganar megas en éste momento';
            }
        } else {
            icon.classList.toggle('fa-times-circle');
            body.classList.toggle('fail');
            text.innerHTML = 'Lo sentimos, hubo un problema para activar los megas.';
        }
    }
    });
}

function showPlayer(){
    event && event.preventDefault();
    phoneEntry.classList.add('hide');
    eligibleElement.classList.add('hide');
    video.classList.remove('hide');
    player.play();
}

function countDown() {
    var timer = document.getElementById("timer");
    if (count > 0) {
        count--;
        timer.innerHTML = "Ver el video en " + count + " segundos.";
        setTimeout("countDown()", 1000);
    } else {
        if (isEligible){
          player.poster('./images/watch-this-eligible.png');
        } else {
            player.poster('./images/watch-this-ineligible.png');
        }
        showPlayer();
    }
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
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