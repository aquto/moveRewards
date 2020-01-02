/**
 * Creates and loads an image element in order to determine of a user is online or offline
 * @param  {Function} callback - returns a boolean to determine if the user is online or offline
 */
function isOnline(callback) {
  var url = '//d1y0qivfpuylge.cloudfront.net/images/pixel.gif'
  var img = new Image()
  img.onload = function() { callback(true) }
  img.onerror = function() { callback(false) }
  img.src = url + '?rcb=' + Math.floor((1 + Math.random()) * 0x10000).toString(16)
}

/**
 * Format reward amount
 * Adds MB or GB as broadway-devropriate
 *
 * @param {Integer} rewardAmount Reward amount in MB
 *
 */
function formatData(rewardAmount) {
  var dataNum = rewardAmount
  var dataLabel = 'MB'
  if (dataNum > 9999) {
    dataNum = Math.floor(dataNum/1024)
    dataLabel = 'GB'
  }
  return dataNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + dataLabel
}

/**
 *
 *
 */
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

module.exports = {
  isOnline: isOnline,
  formatData: formatData,
  _parseScriptQuery: parseScriptQuery
}
