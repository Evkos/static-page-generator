const fs = require('fs');
const events = require('events');
const ThumbnailCreator = require('./src/ThumbnailCreator');
const HtmlRenderer = require('./src/HtmlRenderer');
const utils = require('./src/utils');

const templatesPath = process.env.TEMPLATES_PATH;

const eventEmitter = new events.EventEmitter();
const thumbnailCreator = new ThumbnailCreator();
const htmlRenderer = new HtmlRenderer();

fs.readdir(templatesPath, (err, templates) => {
  templates.forEach((templateName) => {
    eventEmitter.emit('read_template', templateName);
  });
});

eventEmitter.on('read_template', (templateName) => {
  fs.readFile(`${templatesPath}/${templateName}`, (err, buffer) => {

    const content = buffer.toString();
    const contentParts = content.match(/<(.*)>/g);

    const imageSet = [];
    const images = utils.getImages(contentParts);

    images.forEach((image) => {
      thumbnailCreator.generateThumbnail(imageSet, image).then(() => {
        htmlRenderer.renderHtml(templateName, content, imageSet);
      });
    });
  });
});







