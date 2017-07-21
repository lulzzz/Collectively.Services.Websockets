//JwtTokenHandler.js
var fs = require('fs');
var jwt = require('jwt-simple');
var moment = require('moment');
const privateKey = fs.readFileSync('rsa-private-key.pem');
const publicKey = fs.readFileSync('rsa-public-key.pem');

module.exports = function(jwtConfiguration) {
  let config = jwtConfiguration;

  this.create = (userId, expiryDays) => {
    let expiryDate = moment.utc();
    if (expiryDays) {
      expiryDate.add(expiryDays, 'd');
    } else {
      expiryDate.add(config.expiryDays, 'd');
    }

    let dotnetTicks = this.toDotnetTicks(expiryDate.valueOf());

    let payload = {
      sub: userId,
      exp: dotnetTicks
    };
    
    return jwt.encode(payload, privateKey, 'RS256')
  }

  this.getFromAuthorizationHeader = (header) => {
    if(!header) {
      return;
    }

    let data = header.trim().split(' ');
    if (data.length != 2) {
      return;
    }
    if (!data[0] || !data[1]) {
      return;
    }

    let jwtToken = data[1];

    return this.decode(jwtToken);
  };

  this.decode = (token) => {
    if(!token) {
      return;
    }
    return jwt.decode(token, publicKey, 'RS256');
  }

  this.isValid = (token) => {
    if (!token) {
      return false;
    }
    let jsTimestamp = toJsTimestamp(token.exp);
    let expiry = moment.utc(jsTimestamp);

    return expiry > moment.utc();
  };

  let toDotnetTicks = (jsMilliseconds) => {
    return jsMilliseconds * 10000 + 621355968000000000;
  }

  let toJsTimestamp = (dotnetTicks) => {
    return (dotnetTicks - 621355968000000000) / 10000;
  };
};