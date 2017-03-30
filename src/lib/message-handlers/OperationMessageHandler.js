//OperationMessageHandler.js

module.exports = function(io){
  this.io = io;

  this.publishOperationUpdated = (event) => {
    console.log(`Publishing operation_updated message, operation: ${event.name}, state: ${event.state}`);
    this.io.to(event.userId).emit('operation_updated', event);
  }
};