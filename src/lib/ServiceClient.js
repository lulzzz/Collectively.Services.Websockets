//ServiceClient.js
var fetch = require('node-fetch');
var ServiceAuthenticator = require('./security/ServiceAuthenticator.js');

module.exports = function() {
  this.getAsync = async (name, endpoint) => {
    let serviceAuthenticator = new ServiceAuthenticator();
    let token = await serviceAuthenticator.authenticateAsync();
    if(!token) {
      return;
    }

    let url = `http://${name}/${endpoint}`;
    let options = {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${token}`,
        'Accept': 'application/json',
      }
    };
    let response = await fetch(url, options);

    return response.json();
  };
};