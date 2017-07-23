//JwtTokenHandler.js
var fs = require('fs');
var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = function(jwtConfiguration) {
  let config = jwtConfiguration;
  let publicKey = "";
  if (config.rsaUseFilePath) {
    publicKey = fs.readFileSync(jwtConfiguration.rsaPublicKey);
    console.log("Public RSA key loaded from a file: " + config.rsaPublicKey);
  } else {
    console.log("Public RSA key loaded from Lockbox.");
    publicKey = jwtConfiguration.rsaPublicKey;
  }

  this.decode = (token) => {
    if(!token) {
      return;
    }

    return jwt.decode(token, publicKey, false, 'RS256');
  }

  this.isValid = (token) => {
    if (!token) {
      return false;
    }
    return moment.unix(token.exp) > moment.utc();
  };
};