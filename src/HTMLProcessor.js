const fs = require('fs');

class HTMLProcessor {

  eventEmitter;
  templatesProcessor;

  constructor(eventEmitter, templatesProcessor) {
    this.eventEmitter = eventEmitter;
    this.templatesProcessor = templatesProcessor;
  }


  run = (data) => {
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

  getCurrentTemplateName = (slug) => {
    return `${slug.split('/')[0]}.html`;
  };

  setEvents = (data) => {
    this.eventEmitter.on('template_structure_loaded', (templateStructure) => {
      console.log(templateStructure, data);
    });
  };
}

module.exports = HTMLProcessor;