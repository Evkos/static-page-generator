const fs = require('fs');
const publicPath = process.env.PUBLIC_PATH;

class HtmlRenderer {
  render = ({ templateName, content, templateImagesData }) => {
    this.generatePublicFolderIfAbsent();
    const filledFileData = this.getFilledFileData(content, templateImagesData);
    fs.writeFile(`${publicPath}/createdFrom_${templateName}`, filledFileData, () => {
    });
  };

  generatePublicFolderIfAbsent = () => {
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath);
    }
  };

  getFilledFileData(content, templateImagesData) {
    return content.replace(/{{thumbnail:(.*)}}/g, (match, src) => {
      const templateImageData = this.getTemplateImageData(templateImagesData, src);

      if (templateImageData && templateImageData.base64) {
        return `<img src="data:image/bmp;base64,${templateImageData.base64}" alt="${templateImageData.alt}"/>`;
      }

      return `<img src="" alt="${templateImageData ? templateImageData.alt : 'Unknown thumbnail'}"/>`;
    });
  }

  getTemplateImageData = (templateImagesData, src) => {
    return templateImagesData.find((item) => {
      if (src === item.src) {
        return item;
      }
      return undefined;
    });
  };
}

module.exports = HtmlRenderer;