const fs = require('fs');
const ImageParser = require('./src/ImageParser');
const ImageCompressor = require('./src/ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);

const filePath = 'images/rectangle_24bit.bmp';

const generateThumbnail = path => {
  const imageObject = imageParser.parseImageFileToImageObject(path);
  const compressedImageObject = imageCompressor.compressImage(imageObject);
  return imageParser.parseImageBufferToBase64(compressedImageObject);
};

const writeToHtml = (imagePath, thumbnailFile) => {
  const indexData = `
  <img id="image" src="../${imagePath}"/>
  <img id="thumbnail" src="data:image/bmp;base64,${thumbnailFile}"/ >
  `;

  fs.writeFileSync('public/index.html', indexData);
};

const thumbnail = generateThumbnail(filePath);
writeToHtml(filePath, thumbnail);
