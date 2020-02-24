const events = require('events');

const PageDataLoader = require('./PageDataLoader');
const DataEnricher = require('./DataEnricher');
const PageRenderer = require('./PageRenderer');
const TemplatesProcessor = require('./TemplatesProcessor');
const ThumbnailCreator = require('./ThumbnailCreator');

const thumbnailCreator = new ThumbnailCreator();
const templatesProcessor = new TemplatesProcessor();
const dataEnricher = new DataEnricher(thumbnailCreator);
const eventEmitter = new events.EventEmitter();
const pageDataLoader = new PageDataLoader();
const pageRenderer = new PageRenderer();

class PageGenerationProcess {

  constructor() {
    this.initEventListeners();
  }

  start = () => {
    const templates = templatesProcessor.getTemplatesNames();
    if (templates.length !== 0) {
      templates.forEach(templateName => {
        eventEmitter.emit('template_read', templateName);
      });
    }
    else{
      console.log("Can't find any templates in folder")
    }
  };

  initEventListeners = () => {

    eventEmitter.on('template_read', templateName => {
      const templateData = templatesProcessor.getTemplateData(templateName);
      eventEmitter.emit('template_data_loaded', templateData);
    });

    eventEmitter.on('template_data_loaded', async templateData => {
      templateData.templateImages = await dataEnricher.addThumbnails(templateData.templateImages);
      eventEmitter.emit('template_data_enriched', templateData);
    });


    eventEmitter.on('template_data_enriched', templateData => {
      const pagesData = pageDataLoader.run(templateData.templateName);
      pagesData.forEach(pageData => {
        eventEmitter.emit('page_data_loaded', pageData, templateData);
      });
    });

    eventEmitter.on('page_data_loaded', async (pageData, templateData) => {
      pageData.images = await dataEnricher.addThumbnails(pageData.images);
      eventEmitter.emit('combined_data_loaded', pageData, templateData);
    });

    eventEmitter.on('combined_data_loaded', (pageData, templateData) => {
      pageRenderer.render(pageData, templateData);
    });
  };
}

module.exports = PageGenerationProcess;
