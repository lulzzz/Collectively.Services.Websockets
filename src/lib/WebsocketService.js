//WebsocketService.js
var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var amqp = require('amqp');
var RabbitMqConnection = require('./RabbitMqConnection.js');
var OperationMessageHandler = require('./message-handlers/OperationMessageHandler.js');
var RemarkMessageHandler = require('./message-handlers/RemarkMessageHandler.js');

module.exports = function(configuration) {
  this.configuration = configuration;
  var port = this.configuration.port || 15000;
  var rabbitMqConfig = this.configuration.rabbitMq;

  this.run = () => {
    console.log('Starting Collectively Websockets Service...');
    var app = express();
    var server = http.createServer(app);
    var io = socketio(server);

    var operationMessageHandler = new OperationMessageHandler(io);
    var remarkMessageHandler = new RemarkMessageHandler(io, this.configuration.services);
    var rmqConnection = new RabbitMqConnection(rabbitMqConfig);

    rmqConnection.subscribe('collectively.messages.events.operations',
      'operationupdated.#',
      operationMessageHandler.publishOperationUpdated);
      
    rmqConnection.subscribe('collectively.messages.events.remarks',
      'remarkcreated.#',
      remarkMessageHandler.publishRemarkCreated);

    rmqConnection.subscribe('collectively.messages.events.remarks',
      'remarkresolved.#',
      remarkMessageHandler.publishRemarkResolved);

    rmqConnection.subscribe('collectively.messages.events.remarks',
      'remarkdeleted.#',
      remarkMessageHandler.publishRemarkDeleted);

    rmqConnection.subscribe('collectively.messages.events.remarks',
      'photostoremarkadded.#',
      remarkMessageHandler.publishPhotosToRemarkAdded);

    rmqConnection.connect();

    function onSocketConnection(socket) {
      console.log('connected');
      socket.on('initialize', (data) => {
        console.log('initialized');
      });
    }

    io.set('origins', '*:*');

    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.header('Access-Control-Expose-Headers', 'Content-Length');
      res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
      if (req.method === 'OPTIONS') {
        return res.send(200);
      } else {
        return next();
      }
    });

    server.listen(port, () => {
      console.log('Server listening at port %d', port);
    });

    app.get('/', (req, res) => {
      res.send('Collectively Websocket Service');
    });

    io.on('connection', onSocketConnection);    
  }
};