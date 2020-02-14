const fs = require('fs');
const Processor = require('./Processor');

class HTMLProcessor extends Processor {

  eventEmitter = super.getEventEmitter();

  constructor(templatesProcessor) {
    super();
    this.templatesProcessor = templatesProcessor;
  }


  run = (data) => {
    //console.log(data);
    this.setEvents(data);
    const currentTemplateName = this.getCurrentTemplateName(data.slug);
    this.templatesProcessor.getTemplateStructure(currentTemplateName);


    /*const path = this.data.slug.split('/');

    fs.mkdirSync(`public/${path[0]}`, { recursive: true });
    fs.writeFile(`public/${path[0]}/${path[1]}.html`, this.data.title, (err) => {
      if (err) {
        console.error(err.stack);
      }
    });*/


  };

  createHTML = (templateStructure, data) => {

  };

  getCurrentTemplateName = (slug) => {
    return `${slug.split('/')[0]}.template`;
  };

  setEvents = (data) => {
    this.eventEmitter.on('template_structure_loaded', (templateStructure) => {
      this.createHTML(templateStructure, data);
    });
  };
}

module.exports = HTMLProcessor;