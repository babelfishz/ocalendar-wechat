function encode(buffer) {

  return buffer/*.toString('base64')*/
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

module.exports = {
  encode: encode
}