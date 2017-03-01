var config = require('config');
var WebSocketService = require('./WebsocketService.js');

console.log('Fetching configuration data');
var env = process.env.NODE_ENV || 'local';
if(env === 'production' || env === 'development') {
  let lockboxClient = require('./lib/LockBoxClient.js');
  lockboxClient.getConfig()
    .then((configuration) => {
      console.log('Configuration fetched from LockBox');
      let service = new WebSocketService(configuration);
      service.run();
    })
} else {
  var configuration = config.get('config');
  let service = new WebSocketService(configuration);
  service.run();
}

