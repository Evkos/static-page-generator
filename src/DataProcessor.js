const fs = require('fs');

class DataProcessor {

  eventEmitter;

  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  run = (templateName) => {

    const dataFolderPath = this.getDatFolderPath(templateName);

    fs.readdir(dataFolderPath, (err, dataFiles) => {
      if (err) {
        console.error(err.stack);
        return;
      }

      dataFiles.forEach((dataFile) => {
        this.getDataObject(dataFile, dataFolderPath);
      });
    });
  };

  getDataObject = (dataFile, dataFolderPath) => {
    fs.readFile(`${dataFolderPath}/${dataFile}`, (err, buffer) => {
      if (err) {
        console.error(err.stack);
        return;
      }
      const dataObject = JSON.parse(buffer.toString());
      this.eventEmitter.emit('data_loaded', dataObject);
    });
  };

  getDatFolderPath = (templateName) => {
    return `data/${templateName.split('.')[0]}`;
  };
}

module.exports = DataProcessor;