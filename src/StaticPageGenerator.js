const TemplateProcessor = require('./TemplatesProcessor');
const DataProcessor = require('./DataProcessor');
const HTMLProcessor = require('./HTMLProcessor');
const events = require('events');

const eventEmitter = new events.EventEmitter();
const templatesPath = process.env.TEMPLATES_PATH;

const templatesProcessor = new TemplateProcessor(templatesPath, eventEmitter);
const dataProcessor = new DataProcessor(eventEmitter);
const htmlProcessor = new HTMLProcessor(eventEmitter, templatesProcessor);


class StaticPageGenerator {

  run = () => {
    this.setEvents();
    templatesProcessor.run();
  };

  setEvents = () => {
    eventEmitter.on('template_read', (templateName) => {
      dataProcessor.run(templateName);
    });

    eventEmitter.on('data_loaded', (dataObject) => {
      htmlProcessor.run(dataObject);
    });
  };


}

module.exports = StaticPageGenerator;