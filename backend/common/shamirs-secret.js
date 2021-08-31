const { split, combine } = require('shamirs-secret-sharing-ts');
module.exports.encryptSecretKey = (secretKey) =>
  split(Buffer.from(secretKey), { shares: 10, threshold: 3 }).map((key) =>
    key.toString()
  );
module.exports.decryptSecretKey = (keys) => combine(keys).toString();
