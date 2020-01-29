const fs = require('fs');
const events = require('events');
const EventHandlers = require('./EventHandlers');
const eventEmitter = new events.EventEmitter();


class TemplatesProcessor {

  templatesPath;

  constructor(templatesPath) {
    this.templatesPath = templatesPath;
  }

  run = () => {
    fs.readdir(this.templatesPath, (err, templates) => {
      if (err) {
        console.error(err.stack);
        return
      }
      templates.forEach((templateName) => {
        eventEmitter.emit('template_name_read', templateName);
      });
    });
  };

  setEventHandlers = () => {
    new EventHandlers(eventEmitter, this.templatesPath);
  };
}

module.exports = TemplatesProcessor;