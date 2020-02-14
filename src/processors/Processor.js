const events = require('events');
const eventEmitter = new events.EventEmitter();

class Processor {

  getEventEmitter() {
    return eventEmitter
  };

}

module.exports = Processor;