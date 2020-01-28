const fs = require('fs');
const events = require('events');
const TemplateModel = require('./src/TemplateModel');
const ThumbnailCreator = require('./src/ThumbnailCreator');
const HtmlRenderer = require('./src/HtmlRenderer');
const utils = require('./src/utils');

const templatesPath = process.env.TEMPLATES_PATH;

const eventEmitter = new events.EventEmitter();
const thumbnailCreator = new ThumbnailCreator();
const htmlRenderer = new HtmlRenderer();

fs.readdir(templatesPath, (err, templates) => {
  templates.forEach((templateName) => {
    eventEmitter.emit('template_name_read', templateName);
  });
});

eventEmitter.on('template_name_read', (templateName) => {
  fs.readFile(`${templatesPath}/${templateName}`, (err, buffer) => {
    // TODO Create error handler
    const templateModel = new TemplateModel();
    templateModel.templateName = templateName;
    templateModel.content = buffer.toString();
    const contentParts = templateModel.content.match(/<(.*)>/g);
    templateModel.templateImagesData = utils.getImages(contentParts);

    eventEmitter.emit('template_images_collected', templateModel);
  });
});

const emitEventIfReady = (dataToProcess, counter, eventData) => {
  if (dataToProcess.length <= counter) {
    eventEmitter.emit('thumbnails_generated', eventData);
  }
};

eventEmitter.on('template_images_collected', (templateModel) => {
  let counter = 0;
  templateModel.templateImagesData.forEach((image) => {
    thumbnailCreator.getThumbnail(image.src)
      .then((compressedImageBase64) => {
        image.base64 = compressedImageBase64;
        counter += 1;
        emitEventIfReady(templateModel.templateImagesData, counter, templateModel);
      })
      .catch(() => {
        counter += 1;
        emitEventIfReady(templateModel.templateImagesData, counter, templateModel);
    });
  });

});

eventEmitter.on('thumbnails_generated', (templateModel) => {
  htmlRenderer.render(templateModel);
});








