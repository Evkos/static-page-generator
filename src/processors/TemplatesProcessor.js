const Processor = require('./Processor');
const fs = require('fs');

class TemplatesProcessor extends Processor {

  eventEmitter = super.getEventEmitter();

  constructor(templatesPath) {
    super();
    this.templatesPath = templatesPath;
  }

  run = () => {
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
      console.log('__________________________________________________________read template', templateName);
      const templateStructure = buffer.toString();
      this.eventEmitter.emit('template_structure_loaded', templateStructure);
    });
  };
}

module.exports = TemplatesProcessor;