//ServiceAuthenticator.js
var fetch = require('node-fetch');

module.exports = function () {
  let authenticationEndpoint = '/authenticate';
  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    }
  };

  this.authenticateAsync = async (serviceUrl, credentials) => {
    let url = `${serviceUrl}${authenticationEndpoint}`;
    options.body = credentials;
    let response = await fetch(url, options);
    if (!response.ok) {
      return;
    }

    let json = response.json();
    return json.token;
  };
};