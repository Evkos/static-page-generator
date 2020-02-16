const fs = require('fs');
const templatesPath = process.env.TEMPLATES_PATH;
class TemplatesProcessor {

  run = () => {
    return
  };

  getTemplateStructureBySlug = (slug) => {
    const templateName = this.getCurrentTemplateName(slug);
    const buffer = fs.readFileSync(`${templatesPath}/${templateName}`);
    return buffer.toString();
  };

  getCurrentTemplateName = (slug) => {
    return `${slug.split('/')[0]}.template`;
  };
}

module.exports = TemplatesProcessor;