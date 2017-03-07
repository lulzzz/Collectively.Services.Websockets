//JwtTokenHandler.js
var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = function(configuration) {
  let config = configuration.jwtToken;

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

    return jwt.encode(payload, config.secretKey, 'HS512')
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

    return jwt.decode(token, config.secretKey, false, 'HS512');
  };

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