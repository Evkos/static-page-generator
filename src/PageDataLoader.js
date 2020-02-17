const fs = require('fs');

class PageDataLoader {

  run = (templateName) => {
    const dataFolderPath = this.getDataFolderPath(templateName);
    const dataFiles = fs.readdirSync(dataFolderPath);
    return this.getPagesData(dataFiles, dataFolderPath);
  };

  getPagesData (dataFiles, dataFolderPath) {
    const pagesData = [];
    dataFiles.forEach((dataFile, i) => {
      pagesData[i] = this.getPageData(dataFile, dataFolderPath);
    });
    return pagesData;
  }

  getPageData = (dataFile, dataFolderPath) => {
    const buffer = fs.readFileSync(`${dataFolderPath}/${dataFile}`);
    //TODO add condition to check if json file placed in correct forlder (slug ~~ foldername)
    return JSON.parse(buffer.toString());
  };

  getDataFolderPath = (templateName) => {
    //TODO extract data to constant
    return `data/${templateName.split('.')[0]}`;
  };
}

module.exports = PageDataLoader;