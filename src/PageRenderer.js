const fs = require('fs');
const publicPath = process.env.PUBLIC_PATH;
const TemplatesProcessor = require('./TemplatesProcessor');
const templatesProcessor = new TemplatesProcessor();

class PageRenderer {

  render = (pageData) => {
    const pagePathParts = pageData.slug.split('/');
    const outputFolderPath = this.createOutputFolder(pagePathParts[0]);
    const template = templatesProcessor.getTemplateBySlug(pageData.slug);
    const pageContent = this.createPageContent(template, pageData);

    this.createPage(outputFolderPath, pagePathParts[1], pageContent);
  };

  createPage = (outputFolderPath, pageName, pageContent) => {
    fs.writeFile(`${outputFolderPath}/${pageName}.html`, pageContent, (err) => {
      if (err) {
        console.error(err.stack);
      }
    });
  };

  createPageContent = (template, pageData) => {
    return template.replace(/{{(.*)}}/g, (match, key) => {
      if (key.includes('meta')) {
        return this.fillFileMetaTags(pageData, key);
      }
      if (key.includes('image')) {
        return this.fillFileImages(pageData, key);
      }
      if (key.includes('thumbnail')) {
        return this.fillFileImages(pageData, key, true);
      }
      return pageData[key];
    });
  };

  fillFileMetaTags = (pageData, key) => {
    let metaTags = '';
    for (const value in pageData[key]) {
      metaTags += `<meta name="${value}" content="${pageData[key][value]}"/>\n`;
    }
    return metaTags;
  };

  fillFileImages = (pageData, key, isThumbnail = false) => {
    const imageName = key.split(':')[1];
    if (pageData.images === undefined) {
      return '';
    }
    const imageSrc = (isThumbnail) ? pageData.images[imageName].thumbnail : pageData.images[imageName].src;
    const imgSrcPrefix = (isThumbnail) ? 'data:image/gif;base64,' : '../../';
    return `<img src="${imgSrcPrefix + imageSrc}" alt="${pageData.images[imageName].alt}"/>`;
  };

  createOutputFolder = (outputFolderName) => {
    const outputFolderPath = `${publicPath}/${outputFolderName}`;
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath, { recursive: true });
    }
    return outputFolderPath;
  };
}

module.exports = PageRenderer;