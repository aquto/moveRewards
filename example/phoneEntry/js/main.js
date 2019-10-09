
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function handleCheckAppEligibility() {
    $('.loading_wrapper').show();
    $('.btn.pe_customize').attr('disabled', true).removeClass('btn-success').addClass('btn-secondary');
    $('.btn_text').hide();

    var pne = getUrlParameter('pne');
    var phoneNumber;

    if (getUrlParameter('phoneNumber')){
        phoneNumber= getUrlParameter('phoneNumber');
    }
    if ($('#phone').val()){
        var countryData = intlTelInput.getSelectedCountryData();
        phoneNumber= countryData.dialCode + $('#phone').val();
    }

    aquto.checkAppEligibilityPhoneEntry({
        campaignId: getUrlParameter('cid'),
        publisherId: getUrlParameter('pid'),
        publisherClickId: getUrlParameter('tid'),
        publisherSiteUuid: getUrlParameter('psid'),
        advertiserId: getUrlParameter('pid'),
        ios_idfa: getUrlParameter('idfa'),
        android_aid: getUrlParameter('aid'),
        phoneNumber,
        callback: (response) => {
            const identified = response.identified
            const eligible = response.eligible

            // If phone number entry flag is set and not identified show phone entry (unless this is from phone entry call)
            if (pne === "1" && !identified && !phoneNumber) {
                setTimeout(function() {
                    $('.banner_view').hide();
                    $('.phoneEntry_view').show();
                }, 1000);
            }

            // If phoneNumber exists and is NOT eligible, show Fail view
            else if (phoneNumber && !eligible) {
                $('.pe_customize_two').css('visibility','visible');
                setTimeout(function() {
                    $('.phoneEntry_view').hide();
                    $('.banner_view').hide();
                    $('.fail_view').show();
                }, 1000);
            }

            // If phoneNumber exists and is eligible, show Success view
            else if (phoneNumber && eligible) {
                $('.phoneEntry_view').hide();
                $('.success_view').show();
                countdown();
            }

            // Otherwise redirect to target URL (this includes ineligible if no pne flag)
            else { // NO phoneNumber and NO pne flag
                redirectUrl()
            }
        },
        error: (e) => {
            console.error(e)
        }
    });
}

function backValidateNumber(){
    $('.fail_view').hide();
    $('#phone').val(null);
    $('.pe_customize_two').css('visibility','hidden');
    $('.phoneEntry_view').show();
    handleEnableBtn();
}

function redirectUrl(){
    var rurl = getUrlParameter('rurl');
    window.location.href = rurl;
}

function validateInputNumber(event) {
    if(event.which < 48 || event.which >57 && event.type === 'keypress'){
        return false;
    }
    if (event.originalEvent.clipboardData && event.originalEvent.clipboardData.getData('Text').match(/[^\d]/)) {
        event.preventDefault();
    }
}

function handleEnableBtn() {
    if($('#phone').val()){
        $('.validateBtn').attr('disabled', false);
        $('.validateBtn').css('cursor', 'pointer');
    } else {
        $('.validateBtn').attr('disabled', true);
        $('.validateBtn').css('cursor', 'not-allowed');
    }
}

function countdown(){
    var counter = 5;
    $('.countdown').text(counter);
    setInterval(function(){
        counter--;
        if(counter>=0){
            $('.countdown').text(counter);
        }
        if(counter==0){
            redirectUrl();
        }
    },1000);
}

function handleChangeTheme(){
    var urlbeg = 'https://maxcdn.bootstrapcdn.com/bootswatch/4.3.1/'
    var urlend = '/bootstrap.min.css'
    var theme = getUrlParameter('theme');
    if (theme === 'dark'){
        var themeurl = urlbeg + 'slate' + urlend;
        $('link[rel="stylesheet"][href$="/bootstrap.min.css"]').attr('href', themeurl);
    }
}


$('[id^=phone]').on('keypress', validateInputNumber);
$('[id^=phone]').on('keyup', handleEnableBtn);
$('[id^=phone]').on('paste', validateInputNumber);

var input = document.querySelector("#phone");

var intlTelInput = window.intlTelInput(input,{
    separateDialCode: true,
    preferredCountries: ['mx']
});

handleChangeTheme();
