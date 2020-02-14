const {
  Processor,
  TemplateProcessor,
  DataProcessor,
  HTMLProcessor,
} = require('./processors');

const processor = new Processor();
const eventEmitter = processor.getEventEmitter();

const templatesPath = process.env.TEMPLATES_PATH;

const templatesProcessor = new TemplateProcessor(templatesPath);
const dataProcessor = new DataProcessor();
const htmlProcessor = new HTMLProcessor(templatesProcessor);


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