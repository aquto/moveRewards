// var modal;
//
// function getUrlParameter(sParam) {
//     var sPageURL = window.location.search.substring(1),
//         sURLVariables = sPageURL.split('&'),
//         sParameterName,
//         i;
//
//     for (i = 0; i < sURLVariables.length; i++) {
//         sParameterName = sURLVariables[i].split('=');
//
//         if (sParameterName[0] === sParam) {
//             return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
//         }
//     }
// }
//
// function redirect(url, clickId){
//     const rurl = getUrlParameter('rurl');
//     const finalUrl = rurl && rurl.replace('$$clickId$$', clickId || '');
//
//     if (finalUrl) {
//         console.log('redirecting to', finalUrl)
//         window.location.href = finalUrl
//     } else {
//         modal.close();
//         alert('invalidconfig')
//     }
// }
//
// function handleCheckAppEligibilityPhoneEntry(phoneNumber){
//     showLoader();
//     const usePhoneNumberEntry = getUrlParameter('pne') === '1';
//     const autoIdentify = getUrlParameter('ai') !== '0';
//
//     aquto.checkAppEligibilityPhoneEntry({
//         campaignId: getUrlParameter('cid'),
//         phoneNumber: phoneNumber || getUrlParameter('phoneNumber'),
//         targetUrl: 'http://nike.com/?clickId=$$clickId$$',
//         callback: (response) => {
//             const eligible = response.eligible;
//             const identified = response.identified && autoIdentify;
//
//             // If phone number entry flag is set and not identified show phone entry (unless this is from phone entry call)
//             if (usePhoneNumberEntry && !identified && !phoneNumber) {
//                 hideLoader();
//                 showPhoneEntryForm();
//             }
//             // If ineligible by operator, use that otherwise use 'ineligible' error message
//             else if (phoneNumber && !eligible) {
//                 hideLoader();
//                 showErrorMessage();
//                 hidePhoneEntryForm();
//                 $('.jBox-Confirm-button.jBox-Confirm-button-cancel').text('Continuar, Sin Ganar Megas');
//                 $('.jBox-Confirm-button.jBox-Confirm-button-cancel').click(function(){
//                     modal.close({ignoreDelay: true});
//                     redirect();
//                 });
//                 $('.jBox-Confirm-button.jBox-Confirm-button-submit').unbind('click');
//                 $('.jBox-Confirm-button.jBox-Confirm-button-submit').bind('click', function(){
//                     resetModalContent();
//                 });
//             } else { // Otherwise redirect to target URL (this includes ineligible if no pne flag)
//                 hidePhoneEntryForm();
//                 showSuccessMessage();
//                 $('#amount_reward').text(response.rewardAmount);
//                 const display = document.querySelector('.countdown');
//                 startTimer(5, display, response.clickUrl, response.clickId);
//             }
//         },
//         error: (e) => {
//             console.error(e);
//             alert('generalerror');
//         }
//     });
//
//
// }
//
// function showLoader(){
//     const modalContent = $(".jBox-content");
//     modalContent && modalContent.append('<div class="loader"></div>');
// }
//
// function hideLoader(){
//     var loader = $(".loader");
//     loader && loader.detach();
// }
//
// function clearModalContent(){
//     const modalContent = $(".jBox-content");
//     modalContent.empty();
// }
//
// function resetModalContent() {
//     hideErrorMessage();
//     showPhoneEntryForm();
//     $('.jBox-Confirm-button.jBox-Confirm-button-cancel').text('No, gracias');
//     $('.jBox-Confirm-button.jBox-Confirm-button-cancel').unbind('click');
//     $('.jBox-Confirm-button.jBox-Confirm-button-submit').unbind('click');
//     $('.jBox-Confirm-button.jBox-Confirm-button-cancel').bind('click', function(){
//         modal.close();
//     });
//     $('.jBox-Confirm-button.jBox-Confirm-button-submit').bind('click', function(){
//         handleValidatePhoneNumber();
//     });
// }
//
// function showPhoneEntryForm(){
//     const phoneEntryForm = '<form>\n' +
//         '  <div class="form-group">\n' +
//         '    <p>Para participar necesitamos validar tu número de teléfono</p>\n' +
//         '    <input type="tel" class="form-control" id="phoneNumber" placeholder="+528909899890">\n' +
//         '  </div>\n' +
//         '</form>' ;
//
//     const modalContent = $(".jBox-content");
//     const appendAllowed = $('#phoneNumber').length === 0;
//     appendAllowed && modalContent && modalContent.append(phoneEntryForm);
// }
//
// function hidePhoneEntryForm(){
//     var form = $("form");
//     form && form.detach();
// }
//
// function showErrorMessage(){
//     const errorMessage = '<h2 class="fail_message">Lo sentimos tu número no participa para ganar megas.</h2>';
//     const modalContent = $(".jBox-content");
//     const appendAllowed = $('.fail_message').length === 0;
//     appendAllowed && modalContent && modalContent.append(errorMessage);
// }
//
// function hideErrorMessage(){
//     var errorMessage = $(".fail_message");
//     errorMessage && errorMessage.detach();
// }
//
// function showSuccessMessage(){
//     const successMessage = '<div class="success_message"><h2>Tu número participa para <span id="amount_reward"></span> MB</h2>\n' +
//         '<p>Redireccion en <span class="countdown"></span></p></div>';
//     const modalContent = $(".jBox-content");
//     const appendAllowed = $('.success_message').length === 0;
//     appendAllowed && modalContent && modalContent.append(successMessage);
// }
//
// function handleValidatePhoneNumber() {
//     if ($('#phoneNumber').val()){
//         const phoneNumber = $('#phoneNumber').val();
//         return handleCheckAppEligibilityPhoneEntry(phoneNumber);
//     }
//
//     if (getUrlParameter('phoneNumber')){
//         phoneNumber= getUrlParameter('phoneNumber');
//         return handleCheckAppEligibilityPhoneEntry(phoneNumber);
//     }
//
// }
//
// function validateInputNumber(event) {
//     if(event.which < 48 || event.which >57 && event.type === 'keypress'){
//         return false;
//     }
//     if (event.originalEvent.clipboardData && event.originalEvent.clipboardData.getData('Text').match(/[^\d]/)) {
//         event.preventDefault();
//     }
// }
//
// function handleBannerClick(){
//     modal.open();
// }
//
// function startTimer(duration, display, url, clickId) {
//     var timer = duration, seconds;
//     var countdown = setInterval(function () {
//         seconds = parseInt(timer % 60, 10);
//         seconds = seconds < 10 ? "0" + seconds : seconds;
//         display.textContent = "00:" + seconds;
//
//         if (--timer < 0) {
//             clearInterval(countdown);
//             return redirect(url, clickId);
//         }
//     }, 1000);
// }
//
// $( document ).ready(function() {
//     modal = new jBox('Confirm', {
//         width: 450,
//         height: 250,
//         closeButton: 'title',
//         animation: false,
//         title: 'Verificando Numero',
//         content: '',
//         cancelButton: 'No, gracias',
//         confirmButton: 'Validar número',
//         onOpen: function(){ handleValidatePhoneNumber() },
//         onClose: function(){ clearModalContent()},
//         confirm: function(){},
//         closeOnConfirm: false,
//     });
//
// });
//
//
