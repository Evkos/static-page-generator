const fs = require('fs');
const Processor = require('./Processor');

class HTMLProcessor extends Processor {

  eventEmitter = super.getEventEmitter();

  constructor(templatesProcessor) {
    super();
    this.templatesProcessor = templatesProcessor;
  }

  run = (data) => {
    this.setEvents(data);
    this.templatesProcessor.loadTemplateStructureBySlug(data.slug);
  };

  render = (structure, data) => {
    this.createFolder(data);
    const path = data.slug.split('/');
    const filledFileData = this.getFilledFileData(structure, data);
    fs.writeFile(`public/${path[0]}/${path[1]}.html`, filledFileData, (err) => {
      if (err) {
        console.error(err.stack);
      }
    });
  };

  getFilledFileData = (structure, data) => {

    for (let prop in data) {
     // console.log('obj.' + prop + ' = ' + data[prop]);
      return structure.replace(/{{(.*)}}/g, (match, key) => {
        return data[key]
      });


    }


  };

  createFolder = (data) => {
    const path = data.slug.split('/');
    fs.mkdirSync(`public/${path[0]}`, { recursive: true });
  };


  setEvents = (data) => {
    this.eventEmitter.on('template_structure_loaded', (templateStructure) => {
      this.render(templateStructure, data);
    });
  };
}

module.exports = HTMLProcessor;