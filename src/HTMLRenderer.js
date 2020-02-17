const fs = require('fs');
const publicPath = process.env.PUBLIC_PATH;
const TemplatesProcessor = require('./TemplatesProcessor');
const templatesProcessor = new TemplatesProcessor();

class HTMLRenderer {

  render = (data) => {
    const structure = templatesProcessor.getTemplateStructureBySlug(data.slug);
    const pathParts = data.slug.split('/');
    const outputFolderPath = `${publicPath}/${pathParts[0]}`;

    this.createOutputFolder(outputFolderPath);
    const filledFileData = this.getFilledFileData(structure, data);
    fs.writeFile(`${outputFolderPath}/${pathParts[1]}.html`, filledFileData, (err) => {
      if (err) {
        console.error(err.stack);
      }
    });
  };

  getFilledFileData = (structure, data) => {
    return structure.replace(/{{(.*)}}/g, (match, key) => {
      if (key.includes('meta')) {
        return this.fillFileMetaTags(data, key);
      }
      if (key.includes('image')) {
        return this.fillFileImages(data, key);
      }
      if (key.includes('thumbnail')) {
        return this.fillFileImages(data, key, true);
      }
      return data[key];
    });
  };


  fillFileMetaTags = (data, key) => {
    let metaTags = '';
    for (const value in data[key]) {
      metaTags += `<meta name="${value}" content="${data[key][value]}"/>\n`;
    }
    return metaTags;
  };

  fillFileImages = (data, key, isThumbnail = false) => {
    const imageName = key.split(':')[1];
    if (data.images === undefined) {
      return '';
    }
    const imageSrc = (isThumbnail) ? data.images[imageName].thumbnail : data.images[imageName].src;
    const imgSrcPrefix = (isThumbnail) ? 'data:image/gif;base64,' : '../../';
    return `<img src="${imgSrcPrefix + imageSrc}" alt="${data.images[imageName].alt}"/>`;
  };

  createOutputFolder = (outputFolderPath) => {
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath, { recursive: true });
    }
  };
}

module.exports = HTMLRenderer;