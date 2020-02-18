const fs = require('fs');
const templatesPath = process.env.TEMPLATES_PATH;

class TemplatesProcessor {

  constructor(thumbnailCreator) {
    this.thumbnailCreator = thumbnailCreator
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
    const buffer = fs.readFileSync(`${templatesPath}/${templateName}`);
    return buffer.toString();
  };

  getTemplateImages = template => {
    let templateImages = [];
    const imagesDataArray = Array.from(template.matchAll(/<img src="(.*)" alt="(.*)"\/>/g));

    if (imagesDataArray) {
      for (const imageData of imagesDataArray) {
        templateImages.push({
          src: imageData[1],
          alt: imageData[2],
          thumbnail: this.thumbnailCreator.getThumbnail(imageData[1].substring(6))
        }) ;
      }
    }

    return templateImages;
  };

  getCurrentTemplateName = slug => {
    return `${slug.split('/')[0]}.template`;
  };
}

module.exports = TemplatesProcessor;
