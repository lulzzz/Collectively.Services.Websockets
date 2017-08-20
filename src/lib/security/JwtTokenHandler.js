//JwtTokenHandler.js
var fs = require('fs');
var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = function(jwtConfiguration) {
  let config = jwtConfiguration;
  let secret = "";
  let algorithm = 'HS256';
  if (config.useRsa)
  {
    algorithm = 'RS256';
    if (config.rsaUseFilePath) {
      secret = fs.readFileSync(jwtConfiguration.rsaPublicKey);
      console.log("Public RSA key loaded from a file: " + config.rsaPublicKey);
    } else {
      console.log("Public RSA key loaded from Lockbox.");
      secret = jwtConfiguration.rsaPublicKey;
    }    
  }
  else {
    secret = config.secretKey;
    console.log("Loaded secret HMAC key.");
  }

  this.decode = (token) => {
    if(!token) {
      return;
    }

    return jwt.decode(token, secret, false, algorithm);
  }

  this.isValid = (token) => {
    if (!token) {
      return false;
    }
    return moment.unix(token.exp) > moment.utc();
  };
};