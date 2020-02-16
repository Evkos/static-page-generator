const fs = require('fs');
const TemplateModel = require('./TemplateModel');
const ThumbnailCreator = require('./thumbnailsCreator/ThumbnailCreator');
const HtmlRenderer = require('./HtmlRenderer');
const utils = require('./utils');

const thumbnailCreator = new ThumbnailCreator();
const htmlRenderer = new HtmlRenderer();

class EventHandlers {

  eventEmitter;

  templatesPath;

  constructor(eventEmitter, templatesPath) {


    this.eventEmitter = eventEmitter;
    this.templatesPath = templatesPath;

    this.eventEmitter.on('template_images_collected', (templateModel) => {
      let counter = 0;
      templateModel.templateImagesData.forEach((image) => {
        thumbnailCreator.getThumbnail(image.src)
          .then((compressedImageBase64) => {
            image.base64 = compressedImageBase64;
            counter += 1;
            this.emitEventIfReady(templateModel.templateImagesData, counter, templateModel);
          })
          .catch(() => {
            counter += 1;
            this.emitEventIfReady(templateModel.templateImagesData, counter, templateModel);
          });
      });

    });

    this.eventEmitter.on('thumbnails_generated', (templateModel) => {
      htmlRenderer.render(templateModel);
    });

  }

  emitEventIfReady = (dataToProcess, counter, eventData) => {
    if (dataToProcess.length <= counter) {
      this.eventEmitter.emit('thumbnails_generated', eventData);
    }
  };
}

module.exports = EventHandlers;




