const fs = require('fs');
const TemplatesProcessor = require('./TemplatesProcessor');

const templatesProcessor = new TemplatesProcessor(null);

class HTMLProcessor {

  run = (data) => {
    const templateStructure = templatesProcessor.getTemplateStructureBySlug(data.slug);
    this.render(templateStructure, data);
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
      return structure.replace(/{{(.*)}}/g, (match, key) => {
        return data[key];
      });
    }
  };

  createFolder = (data) => {
    const path = data.slug.split('/');
    fs.mkdirSync(`public/${path[0]}`, { recursive: true });
  };
}

module.exports = HTMLProcessor;