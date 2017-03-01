var config = require('config');
var WebSocketService = require('./WebsocketService.js');

console.log('Fetching configuration data');
var env = process.env.NODE_ENV || 'local';
if(env === 'production' || env === 'development') {
  let LockboxClient = require('./lib/LockBoxClient.js');
  let client = new LockboxClient();
  client.getConfig()
    .then((configuration) => {
      console.log('Configuration fetched from LockBox');
      console.log(configuration);
      let service = new WebSocketService(configuration.config);
      service.run();
    })
} else {
  var configuration = config.get('config');
  let service = new WebSocketService(configuration);
  service.run();
}

