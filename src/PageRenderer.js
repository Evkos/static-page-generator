const fs = require('fs');
const publicPath = process.env.PUBLIC_PATH;

class PageRenderer {
  constructor(templatesProcessor) {
    this.templatesProcessor = templatesProcessor;
  }

  render = pageData => {
    const pagePathParts = pageData.slug.split('/');
    const outputFolderPath = this.createOutputFolder(pagePathParts[0]);
    const template = this.templatesProcessor.getTemplateBySlug(pageData.slug);
    const templateImages = this.templatesProcessor.getTemplateImages(template);
    const pageContent = this.createPageContent(template, pageData, templateImages);

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

  createPageContent = (template, pageData, templateImages) => {
    const templateWithImages = this.fillFileImagesFromTemplate(template, templateImages);
    return templateWithImages.replace(/{{(.*)}}/g, (match, key) => {
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

  fillFileImagesFromTemplate = (template, templateImages) => {
    return template.replace(/<img src="(.*)" (.*)>/g, (match, src) => {
      let currentImage = {};
      templateImages.forEach((image) => {
        if (image.src === src) {
          currentImage = image;
        }
      });
      return `<img src="${currentImage.src}" alt="${currentImage.alt}"/>\n<img src="data:image/gif;base64,${currentImage.thumbnail}" alt="${currentImage.alt}"/>`;
    });
  };

  fillFileMetaTags = (pageData, key) => {
    let metaTags = '';
    Object.keys(pageData[key]).forEach(value => {
      metaTags += `<meta name="${value}" content="${pageData[key][value]}"/>\n`;
    });
    return metaTags;
  };

  fillFileImages = (pageData, key, isThumbnail = false) => {
    const imageName = key.split(':')[1];
    if (pageData.images === undefined) {
      return '';
    }
    const imageSrc = isThumbnail ? pageData.images[imageName].thumbnail : pageData.images[imageName].src;
    const imgSrcPrefix = isThumbnail ? 'data:image/gif;base64,' : '../../';
    return `<img src="${imgSrcPrefix + imageSrc}" alt="${pageData.images[imageName].alt}"/>`;
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
