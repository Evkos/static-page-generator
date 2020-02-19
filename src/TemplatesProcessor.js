const fs = require('fs');
const templatesPath = process.env.TEMPLATES_PATH;

class TemplatesProcessor {

  constructor(thumbnailCreator) {
    this.thumbnailCreator = thumbnailCreator;
  }

  getTemplatesNames = () => {
    try {
      return fs.readdirSync(templatesPath);
    } catch {
      console.error(`Can't find folder '${templatesPath}'`);
      return false;
    }
  };

  getTemplateBySlug = slug => {
    const templateName = this.getCurrentTemplateName(slug);
    return this.getTemplateByName(templateName);
  };

  getTemplateByName = name => {
    const buffer = fs.readFileSync(`${templatesPath}/${name}`);
    return buffer.toString();
  };

  getTemplateImages = template => {
    let templateImages = {};
    const imagesDataArray = Array.from(template.matchAll(/<img id="(.*)" src="..\/..\/(.*)" alt="(.*)"\/>/g));

    if (imagesDataArray) {
      for (const imageData of imagesDataArray) {
        templateImages[imageData[1]] = {
          src: imageData[2],
          alt: imageData[3],
        };
      }
    }
    return templateImages;
  };

  getCurrentTemplateName = slug => {
    return `${slug.split('/')[0]}.template`;
  };
}

module.exports = TemplatesProcessor;
