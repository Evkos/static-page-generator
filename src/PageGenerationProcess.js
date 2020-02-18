const events = require('events');

const PageDataLoader = require('./PageDataLoader');
const PageDataEnricher = require('./PageDataEnricher');
const PageRenderer = require('./PageRenderer');
const TemplatesProcessor = require('./TemplatesProcessor');

const templatesProcessor = new TemplatesProcessor();
const eventEmitter = new events.EventEmitter();
const pageDataLoader = new PageDataLoader();
const pageDataEnricher = new PageDataEnricher();
const pageRenderer = new PageRenderer();

class PageGenerationProcess {

  constructor() {
    this.initEventListeners();
  }

  start = () => {
    const templates = templatesProcessor.getTemplatesNames();
    if (templates) {
      templates.forEach((templateName) => {
        eventEmitter.emit('template_read', templateName);
      });
    }

  };

  initEventListeners = () => {

    eventEmitter.on('template_read', (templateName) => {
      const pagesData = pageDataLoader.run(templateName);
      pagesData.forEach((pageData) => {
        eventEmitter.emit('data_loaded', pageData);
      });

    });

    //TODO test that cache is still working
    eventEmitter.on('data_loaded', async (pageData) => {
      const dataRichObject = await pageDataEnricher.addThumbnails(pageData);
      eventEmitter.emit('data_enriched', dataRichObject);
    });

    eventEmitter.on('data_enriched', (dataRichObject) => {
      pageRenderer.render(dataRichObject);
    });

  };

}

module.exports = PageGenerationProcess;