const fs = require('fs');

const dataRootFolderPath = 'data';

class PageDataLoader {
  run = templateName => {
    const dataFolderPath = this.getDataFolderPath(templateName);
    const dataFiles = fs.readdirSync(dataFolderPath);
    return this.getPagesData(dataFiles, dataFolderPath);
  };

  getPagesData(dataFiles, dataFolderPath) {
    const pagesData = [];
    dataFiles.forEach((dataFile, i) => {
      const pageData = this.getPageData(dataFile, dataFolderPath);
      if (pageData) {
        pagesData[i] = pageData;
      }
    });
    return pagesData;
  }

  getPageData = (dataFile, dataFolderPath) => {
    const buffer = fs.readFileSync(`${dataFolderPath}/${dataFile}`);
    const pageData = JSON.parse(buffer.toString());
    if (pageData.slug.split('/')[0] !== dataFolderPath.split('/')[1]) {
      console.error(
        `Folder name '${dataFolderPath.split('/')[1]}' and slug '${pageData.slug.split('/')[0]}' do not matched`,
      );
      return false;
    }
    return pageData;
  };

  getDataFolderPath = templateName => {
    return `${dataRootFolderPath}/${templateName.split('.')[0]}`;
  };
}

module.exports = PageDataLoader;
