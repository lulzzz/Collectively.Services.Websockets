//WebsocketService.js
var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var amqp = require('amqp');
var RabbitMqConnection = require('./lib/RabbitMqConnection.js');
var OperationMessageHandler = require('./lib/OperationMessageHandler.js');
var RemarkMessageHandler = require('./lib/RemarkMessageHandler.js');


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
    var remarkMessageHandler = new RemarkMessageHandler(io);
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

    rmqConnection.subscribe('collectively.messages.events.remarks',
      'photosfromremarkremoved.#',
      remarkMessageHandler.publishPhotosFromRemarkRemoved);

    rmqConnection.subscribe('collectively.messages.events.remarks',
      'remarkvotesubmitted.#',
      remarkMessageHandler.publishRemarkVoteSubmitted);

    rmqConnection.subscribe('collectively.messages.events.remarks',
      'remarkvotedeleted.#',
      remarkMessageHandler.publishRemarkVoteDeleted);

    rmqConnection.connect();

    function onSocketConnection(socket) {
      console.log('connected');
      socket.on('initialize', (data) => {
        console.log('initialized');
      });
    }

    io.on('connection', onSocketConnection);

    server.listen(port, () => {
      console.log('Server listening at port %d', port);
    });

    app.get('/', (req, res) => {
      res.send('Collectively Websocket Service');
    });
  }
};