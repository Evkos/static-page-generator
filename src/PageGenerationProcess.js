const events = require('events');

const PageDataLoader = require('./PageDataLoader');
const DataEnricher = require('./DataEnricher');
const PageRenderer = require('./PageRenderer');
const TemplatesProcessor = require('./TemplatesProcessor');
const ThumbnailCreator = require('./ThumbnailCreator');

const thumbnailCreator = new ThumbnailCreator();
const templatesProcessor = new TemplatesProcessor(thumbnailCreator);
const dataEnricher = new DataEnricher(thumbnailCreator);
const eventEmitter = new events.EventEmitter();
const pageDataLoader = new PageDataLoader();
const pageRenderer = new PageRenderer(templatesProcessor);

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
      eventEmitter.emit('template_data_loaded', templateData.templateImages, templateData.templateName);
    });

    eventEmitter.on('template_data_loaded', async (templateImages, templateName) => {
      const templateRichData = await dataEnricher.addThumbnails(templateImages);
      eventEmitter.emit('template_data_enriched', templateRichData, templateName);
    });


    eventEmitter.on('template_data_enriched', (templateRichData, templateName) => {
      const pagesData = pageDataLoader.run(templateName);
      pagesData.forEach(pageData => {
        eventEmitter.emit('page_data_loaded', pageData, templateRichData);
      });
    });

    eventEmitter.on('page_data_loaded', async (pageData, templateRichData) => {
      pageData.images = await dataEnricher.addThumbnails(pageData.images);
      pageData.templateImages = templateRichData;
      eventEmitter.emit('combined_data_loaded', pageData);
    });

    eventEmitter.on('combined_data_loaded', combinedData => {
      pageRenderer.render(combinedData);
    });
  };
}

module.exports = PageGenerationProcess;
