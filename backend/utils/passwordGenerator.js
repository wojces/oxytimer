const crypto = require('crypto');

function generatePassword(length) {
  const buffer = crypto.randomBytes(length);
  const password = buffer.toString('base64').slice(0, length);
  return password;
}

module.exports = generatePassword
