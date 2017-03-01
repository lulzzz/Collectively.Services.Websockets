//RabbitMqConnection.js
var amqp = require('amqp');

module.exports = function(){
  this.connection = {};
  let subscriptions = [];
  let exchanges = {};
  let queues = {};

  this.connect = (options) => {
    this.connection = amqp.createConnection({host: 'localhost'});

    this.connection.on('error', (e) => {
      console.error("Error from amqp: ", e);
    });

    this.connection.on('ready', () => {
      console.log('Connection to RabbitMQ established');
      console.log(`${subscriptions.length} subscriptions defined`);
      subscriptions.forEach((subscription) => {
        exchanges[subscription.exchange] = this.connection.exchange(subscription.exchange);
        console.log(`Attached to exchange ${subscription.exchange}`);
        queues[subscription.queue] = this.connection.queue(subscription.queue, (q) => {
          console.log(`Attached to queue ${subscription.queue}`);
          q.bind(exchanges[subscription.exchange], subscription.routingKey);
          console.log(`Queue: ${subscription.queue} bound to exchange: ${subscription.exchange} with routingKey: ${subscription.routingKey}`);
          q.subscribe((message) => {
            let buffer = new Buffer(message.data);
            let string = buffer.toString('utf8');
            let event = JSON.parse(string);
            subscription.callback(event);
          });
        });
      }, this);
    })
  };

  this.subscribe = (exchange, routingKey, callback) => {
    let eventName = routingKey.split('.')[0];
    let queue = `collectively.websockets.service/${eventName}`;
    let subscription = {
      exchange: exchange,
      queue: queue,
      routingKey: routingKey,
      callback: callback
    };
    subscriptions.push(subscription);
  };
};