const TemplateProcessor = require('./TemplatesProcessor');
const DataProcessor = require('./DataProcessor');
const HTMLProcessor = require('./HTMLProcessor');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const templatesPath = process.env.TEMPLATES_PATH;

class StaticPageGenerator {

  run = () => {
    const dataProcessor = new DataProcessor(eventEmitter);
    const htmlProcessor = new HTMLProcessor(eventEmitter);
    const templatesProcessor = new TemplateProcessor(templatesPath, dataProcessor, htmlProcessor, eventEmitter);

    templatesProcessor.run();

  };

}

module.exports = StaticPageGenerator;