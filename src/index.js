var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var amqp = require('amqp');
var RabbitMqConnection = require('./lib/RabbitMqConnection.js');
var OperationMessageHandler = require('./lib/OperationMessageHandler.js');
var RemarkMessageHandler = require('./lib/RemarkMessageHandler.js');

console.log('Starting Collectively Websockets Service...');

var port = process.env.PORT || 17000;
var app = express();
var server = http.createServer(app);
var io = socketio(server);

var operationMessageHandler = new OperationMessageHandler(io);
var remarkMessageHandler = new RemarkMessageHandler(io);
var rmqConnection = new RabbitMqConnection();

rmqConnection.subscribe('coolector.services.operations.shared.events',
  'operationupdated.#',
  operationMessageHandler.publishOperationUpdated);
  
rmqConnection.subscribe('coolector.services.remarks.shared.events',
  'remarkcreated.#',
  remarkMessageHandler.publishRemarkCreated);

rmqConnection.subscribe('coolector.services.remarks.shared.events',
  'remarkresolved.#',
  remarkMessageHandler.publishRemarkResolved);

rmqConnection.subscribe('coolector.services.remarks.shared.events',
  'remarkdeleted.#',
  remarkMessageHandler.publishRemarkDeleted);

rmqConnection.subscribe('coolector.services.remarks.shared.events',
  'photostoremarkadded.#',
  remarkMessageHandler.publishPhotosToRemarkAdded);

rmqConnection.subscribe('coolector.services.remarks.shared.events',
  'photosfromremarkremoved.#',
  remarkMessageHandler.publishPhotosFromRemarkRemoved);

rmqConnection.subscribe('coolector.services.remarks.shared.events',
  'remarkvotesubmitted.#',
  remarkMessageHandler.publishRemarkVoteSubmitted);

rmqConnection.subscribe('coolector.services.remarks.shared.events',
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
  let response = `Collectively Websocket Service</br>`
    + `Connection status ${app.connectionStatus}</br>`
    + `Exchange status ${app.exchangeStatus}</br>`
    + `Queue status ${app.queueStatus}</br>`;
  res.send(response);
});

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });