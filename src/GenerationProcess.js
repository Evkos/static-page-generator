const templatesPath = process.env.TEMPLATES_PATH;
const events = require('events');
const fs = require('fs');

const DataLoader = require('./DataLoader');
const DataEnricher = require('./DataEnricher');
const HTMLProcessor = require('./HTMLProcessor');

const eventEmitter = new events.EventEmitter();
const dataLoader = new DataLoader();
const dataEnricher = new DataEnricher();
const htmlProcessor = new HTMLProcessor();

class GenerationProcess {

  constructor () {
    this.initEventListeners();
  }

  start = () => {
    fs.readdir(templatesPath, (err, templates) => {
      templates.forEach((templateName) => {
        eventEmitter.emit('template_read', templateName);
      });
    });

  };

  initEventListeners = () => {

    eventEmitter.on('template_read', (templateName) => {
      const dataObjectsArray = dataLoader.run(templateName);
      dataObjectsArray.forEach((dataObject) => {
        eventEmitter.emit('data_loaded', dataObject);
      });

    });

    eventEmitter.on('data_loaded', (dataObject) => {
      const dataRichObject = dataEnricher.run(dataObject);
      eventEmitter.emit('data_enriched', dataRichObject);
    });

    eventEmitter.on('data_enriched', (dataRichObject) => {
      htmlProcessor.run(dataRichObject);
    });

  };

}

module.exports = GenerationProcess;