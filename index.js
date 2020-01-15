const fs = require('fs');

/*
const generateThumbnailAsync = (imagePath) => {
  fs.readFile(imagePath, function(err, data) {
    createIndexFile(imagePath, thumbnailFile);
  });
};
*/

const compressImage = data => {

  const bitMapFileHeader = {
    fileType: data.slice(0, 2).toString('ascii'),
    fileSize: data.slice(2, 6).readUIntLE(0, 4),
    pixelDataOffset: data.slice(10, 14).readUIntLE(0, 4),
  };

  const bitMapInfoHeader = {
    headerSize: data.slice(14, 18).readUIntLE(0, 4),
    imageWidth: data.slice(18, 22).readIntLE(0, 4),
    imageHeight: data.slice(22, 26).readIntLE(0, 4),
    planes: data.slice(26, 28).readUIntLE(0, 2),
    bitsPerPixel: data.slice(28, 30).readUIntLE(0, 2),
    compression: data.slice(30, 34).readUIntLE(0, 4),
    imageSize: data.slice(34, 38).readUIntLE(0, 4),
    xPixelsPerMeter: data.slice(38, 42).readIntLE(0, 4),
    yPixelsPerMeter: data.slice(42, 46).readIntLE(0, 4),
    totalColors: data.slice(46, 50).readUIntLE(0, 4),
    importantColors: data.slice(50, 54).readUIntLE(0, 4),
  };

  //const pixelData = data.slice(bitMapFileHeader.pixelDataOffset)
  const pixelData = data.slice(bitMapFileHeader.pixelDataOffset);

  const pixelArray = [];
  for (let i = 0; i < bitMapInfoHeader.imageWidth; i++) {
    pixelArray[i] = []
    for(let j = 0; j<bitMapInfoHeader.imageHeight; j++){
      pixelArray[i][j] = 0
    }
  }


  console.log(pixelArray);
  return data;
};

const generateThumbnail = imagePath => {
  const data = fs.readFileSync(imagePath);
  const compressedData = compressImage(data);
  return Buffer.from(compressedData).toString('base64');
};

const createIndexFile = (imagePath, thumbnailFile) => {
  const indexData = `
  <img id="image" src="${imagePath}"/>
  <img id="thumbnail" src="data:image/bmp;base64,${thumbnailFile}"/ >
  <span>${thumbnailFile}</span>
  `;

  fs.writeFile('index.html', indexData, function(err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
};

const thumbnail = generateThumbnail('test1.bmp');
createIndexFile('test1.bmp', thumbnail);
