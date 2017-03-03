var config = require('config');
var WebSocketService = require('./lib/WebsocketService.js');

console.log('Fetching configuration data');
var env = process.env.NODE_ENV || 'local';
console.log(`Environment ${env}`);
if(env === 'production' || env === 'development') {
  let LockboxClient = require('./lib/LockBoxClient.js');
  let client = new LockboxClient();
  client.getConfig()
    .then((configuration) => {
      console.log('Configuration fetched from LockBox');
      let service = new WebSocketService(configuration.config);
      service.run();
    })
} else {
  var configuration = config.get('config');
  let service = new WebSocketService(configuration);
  service.run();
}

