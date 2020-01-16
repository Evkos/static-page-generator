const fs = require('fs');
const ImageParser = require('./src/ImageParser');
const ImageCompressor = require('./src/ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);

const filePath = 'images/test1.bmp';

const generateThumbnail = (filePath) => {
  const imageObject = imageParser.parseImageFileToImageObject(filePath);
  const compressedImageObject = imageCompressor.compressImage(imageObject);
  return imageParser.parseImageBufferToBase64(compressedImageObject);
};

const writeToHtml = (imagePath, thumbnailFile) => {
  const indexData = `
  <img id="image" src="../${imagePath}"/>
  <img id="thumbnail" src="data:image/bmp;base64,${thumbnailFile}"/ >
  `;

  fs.writeFile('public/index.html', indexData, function(err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
};

const thumbnail = generateThumbnail(filePath);
writeToHtml(filePath, thumbnail);
