
function parseScriptQuery(scriptTag) {
    var args = {}
    if (scriptTag) {
        var query = scriptTag.src.replace(/^[^\?]+\??/,'')

        var vars = query.split("&")
        for (var i=0; i<vars.length; i++) {
            var pair = vars[i].split("=")
            // decodeURI doesn't expand "+" to a space.
            args[pair[0]] = decodeURI(pair[1]).replace(/\+/g, ' ')
        }
    }
    return args
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

// Return an string repeated number times provided
function repeatString(string, times) {
    let repeatedString = "";
    while (times > 0) {
        repeatedString += string;
        times--;
    }
    return repeatedString;
}
