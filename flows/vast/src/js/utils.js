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
