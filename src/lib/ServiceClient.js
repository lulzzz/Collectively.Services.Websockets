//ServiceClient.js
var fetch = require('node-fetch');
var ServiceAuthenticator = require('./security/ServiceAuthenticator.js');

module.exports = function(serviceConfig) {

  let credentials = {
    username: serviceConfig.username,
    password: serviceConfig.password
  };

  this.getAsync = async (name, endpoint) => {

    let serviceAuthenticator = new ServiceAuthenticator();
    let token = await serviceAuthenticator.authenticateAsync(`http://${name}`, credentials);
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
    console.log(`Fetching resource from ${url}`);
    let response = await fetch(url, options);

    return await response.json();
  };
};