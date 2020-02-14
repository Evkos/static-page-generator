const fs = require('fs');
const Processor = require('./Processor');

class DataProcessor extends Processor{

  eventEmitter = super.getEventEmitter();

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
      console.log('__________________________________________________________get data', dataFile);
      const dataObject = JSON.parse(buffer.toString());
      this.eventEmitter.emit('data_loaded', dataObject);
    });
  };

  getDatFolderPath = (templateName) => {
    return `data/${templateName.split('.')[0]}`;
  };
}

module.exports = DataProcessor;