const fs = require('fs');

class DataLoader {

  run = (templateName) => {
    const dataFolderPath = this.getDataFolderPath(templateName);
    const dataFiles = fs.readdirSync(dataFolderPath);
    const array = [];
    dataFiles.forEach((dataFile,i) => {
      array[i] = this.getDataObject(dataFile, dataFolderPath);
    });
    return array;
  };

  getDataObject = (dataFile, dataFolderPath) => {
    const buffer = fs.readFileSync(`${dataFolderPath}/${dataFile}`);
    return JSON.parse(buffer.toString());
  };

  getDataFolderPath = (templateName) => {
    return `data/${templateName.split('.')[0]}`;
  };
}

module.exports = DataLoader;