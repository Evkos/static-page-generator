const fs = require('fs');
const ImageParser = require('./src/ImageParser');
const ImageCompressor = require('./src/ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);

const filePath = 'images/test1.bmp';

const templatesPath = process.env.TEMPLATES_PATH;
const imagesPath = process.env.IMAGES_PATH;

const generateThumbnail = path => {
  const imageObject = imageParser.parseImageFileToImageObject(path);
  const compressedImageObject = imageCompressor.compressImage(imageObject);
  return imageParser.parseImageBufferToBase64(compressedImageObject);
};

const writeToHtml = (imagePath, thumbnailFile) => {
  const indexData = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Template 1</title>
    </head>
    <body>
    <img id="image" src="../${imagePath}"/>
      <img id="thumbnail" src="data:image/bmp;base64,${thumbnailFile}"/ >
    </body>
    </html> 
  `;

  fs.writeFileSync('public/index.html', indexData);
};

const thumbnail = generateThumbnail(filePath);
writeToHtml(filePath, thumbnail);


fs.readdir(templatesPath, function(err, items) {


  items.forEach((item) => {
    const fileBuffer = fs.readFileSync(`${templatesPath}/${item}`);
    const fileContent = fileBuffer.toString();
    console.log(fileContent);
  });
});
