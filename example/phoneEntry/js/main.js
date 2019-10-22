
const getUrlParameter = function getUrlParameter(sParam) {
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

function handleCheckAppEligibilityPhoneEntry(phoneNumber){

    aquto.checkAppEligibilityPhoneEntry({
        campaignId: getUrlParameter('cid'),
        phoneNumber: phoneNumber || getUrlParameter('phoneNumber'),
        callback: (response) => {
            const eligible = response.eligible;
            const rewardAmount = response.rewardAmount;

            // If phoneNumber is NOT Eligible
            if (phoneNumber && !eligible) {
                console.log('get first if...');
                $('.pe_customize_two').css('visibility','visible');
                $('.phoneEntry_view').hide();
                $('.banner_view').hide();
                $('.fail_view').show();
            }
            // If phoneNumber is Eligible
            if (phoneNumber && eligible) {
                console.log('get second if...');
                $('.banner_view').hide();
                $('.phoneEntry_view').hide();
                $('.fail_view').hide();
                $('#amount_reward').text(rewardAmount);
                $('.success_view').show();
                countdown();
            }
            // If phoneNumber is NOT defined
            if (!phoneNumber){
                redirectUrl(); // just redirect to rurl for now
            }

        },
        error: (e) => {
            console.error(e)
        }
    });


}

function handleCheckAppEligibility() {
    $('.loading_wrapper').show();
    $('.btn.pe_customize').attr('disabled', true).removeClass('btn-success').addClass('btn-secondary');
    $('.btn_text').hide();

    var phoneNumber;

    if ($('#phone').val()){
        var countryData = intlTelInput.getSelectedCountryData();
        phoneNumber= countryData.dialCode + $('#phone').val();
        return handleCheckAppEligibilityPhoneEntry(phoneNumber);
    }

    if (getUrlParameter('phoneNumber')){
        phoneNumber= getUrlParameter('phoneNumber');
        return handleCheckAppEligibilityPhoneEntry(phoneNumber);
    }

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
    window.location.href = rurl || 'https://aquto.com/';
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

$( document ).ready(function() {
    handleCheckAppEligibility();
});
