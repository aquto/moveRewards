function getUrlParameter(sParam, sPageURL) {
    let sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

// Return an array as result of intersection between two arrays
function intersect(arr1, arr2) {
    if(arr1 && arr2){
        const result = arr1.filter(function(item) {
            return arr2.indexOf(item) > -1;
        });

        if (result.length > 0){
            return result;
        } else{
            return null;
        }
    }else{
        return null;
    }

}
