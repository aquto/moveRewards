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

module.exports = {
  isOnline: isOnline
}
