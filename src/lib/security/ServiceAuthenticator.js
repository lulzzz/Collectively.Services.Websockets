//ServiceAuthenticator.js
var fetch = require('node-fetch');

module.exports = function () {
  let authenticationEndpoint = '/authenticate';

  this.authenticateAsync = async (serviceUrl, credentials) => {
    let url = `${serviceUrl}${authenticationEndpoint}`;
    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    };
    let response = await fetch(url, options);
    if (!response.ok) {
      console.log(`Service authentication failed, service: ${serviceUrl}`);
      return;
    }
    console.log(`Service authentication succeed, service: ${serviceUrl}`);
    let json = await response.json();
    return json.token;
  };
};