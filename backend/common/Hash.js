// const { AES, enc } = require('crypto-js');

// module.exports.encrypt = (value, key) =>
//   AES.encrypt(String(value), key).toString();

// module.exports.decrypt = (value, key) =>
//   CryptoJS.AES.decrypt(value, key).toString(enc.Utf8);

const hmacSHA512 = require('crypto-js/hmac-sha512');

module.exports.encrypt = (value, key) =>
  hmacSHA512(String(value), key).toString();
