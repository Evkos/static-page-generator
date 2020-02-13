const fs = require('fs');

class TemplatesProcessor {

  templatesPath;
  dataProcessor;
  htmlProcessor;
  eventEmitter;

  constructor(templatesPath, dataProcessor, htmlProcessor, eventEmitter) {
    this.templatesPath = templatesPath;
    this.dataProcessor = dataProcessor;
    this.htmlProcessor = htmlProcessor;
    this.eventEmitter = eventEmitter;
  }

  run = () => {

    this.setEvents();

    fs.readdir(this.templatesPath, (err, templates) => {
      if (err) {
        console.error(err.stack);
        return;
      }
      templates.forEach((templateName) => {
        this.eventEmitter.emit('template_read', templateName);
      });
    });
  };

  getTemplateStructure = (templateName) => {
    fs.readFile(`${this.templatesPath}/${templateName}`, (err, buffer) => {
      if (err) {
        console.error(err.stack);
        return;
      }

      const templateStructure = buffer.toString();

      this.eventEmitter.emit('template_structure_loaded', templateStructure, templateName);
    });
  };

  setEvents = () => {

    this.eventEmitter.on('template_read', (templateName) => {
      this.getTemplateStructure(templateName);
    });

    this.eventEmitter.on('template_structure_loaded', (templateStructure, templateName) => {
      this.dataProcessor.run(templateName);
      this.htmlProcessor.setStructure(templateStructure);
    });

    this.eventEmitter.on('data_loaded', (data) => {
      this.htmlProcessor.setData(data);
      this.htmlProcessor.run();
    });

  };
}

module.exports = TemplatesProcessor;