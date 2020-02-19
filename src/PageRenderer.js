const fs = require('fs');
const publicPath = process.env.PUBLIC_PATH;

class PageRenderer {
  constructor(templatesProcessor) {
    this.templatesProcessor = templatesProcessor;
  }

  render = combinedData => {
    const pagePathParts = combinedData.slug.split('/');
    const outputFolderPath = this.createOutputFolder(pagePathParts[0]);
    const template = this.templatesProcessor.getTemplateBySlug(combinedData.slug);
    const pageContent = this.createPageContent(template, combinedData);

    this.createPage(outputFolderPath, pagePathParts[1], pageContent);
  };

  createPage = (outputFolderPath, pageName, pageContent) => {
    fs.writeFile(`${outputFolderPath}/${pageName}.html`, pageContent, err => {
      if (err) {
        console.error(err.stack);
      }
      console.log(`Page ${pageName}.html was created successfully`);
    });
  };

  createPageContent = (template, combinedData) => {
    return template.replace(/{{(.*)}}/g, (match, key) => {
      if (key.includes('templateImage')) {
        return this.fillFileImagesFromTemplate(combinedData, key);
      }
      if (key.includes('meta')) {
        return this.fillFileMetaTags(combinedData, key);
      }
      if (key.includes('image')) {
        return this.fillFileImages(combinedData, key);
      }
      if (key.includes('thumbnail')) {
        return this.fillFileImages(combinedData, key, true);
      }
      return combinedData[key];
    });
  };

  fillFileImagesFromTemplate = (combinedData, key) => {
    const imageName = key.split(':')[1];
    const imageSrc = combinedData.templateImages[imageName].thumbnail;
    return `<img src="data:image/gif;base64,${imageSrc}" alt="${combinedData.templateImages[imageName].alt}"/>`;
  };

  fillFileMetaTags = (combinedData, key) => {
    let metaTags = '';
    Object.keys(combinedData[key]).forEach(value => {
      metaTags += `<meta name="${value}" content="${combinedData[key][value]}"/>\n`;
    });
    return metaTags;
  };

  fillFileImages = (combinedData, key, isThumbnail = false) => {
    const imageName = key.split(':')[1];
    if (combinedData.images === undefined) {
      return '';
    }
    const imageSrc = isThumbnail ? combinedData.images[imageName].thumbnail : combinedData.images[imageName].src;
    const imgSrcPrefix = isThumbnail ? 'data:image/gif;base64,' : '../../';
    return `<img src="${imgSrcPrefix + imageSrc}" alt="${combinedData.images[imageName].alt}"/>`;
  };

  createOutputFolder = outputFolderName => {
    const outputFolderPath = `${publicPath}/${outputFolderName}`;
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath, { recursive: true });
    }
    return outputFolderPath;
  };
}

module.exports = PageRenderer;
