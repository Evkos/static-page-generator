const fs = require('fs');
const ImageParser = require('./src/ImageParser');
const ImageCompressor = require('./src/ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);

const templatesPath = process.env.TEMPLATES_PATH;

const generateThumbnail = path => {
  const imageObject = imageParser.parseImageFileToImageObject(path);
  const compressedImageObject = imageCompressor.compressImage(imageObject);
  return imageParser.parseImageBufferToBase64(compressedImageObject);
};

const writeToHtml = (item, imagePaths, thumbnailFiles) => {

  const images = imagePaths.reduce((accumulator, imagePath) => {
    return accumulator.concat(`<img src="../${imagePath}" alt="imagePath"/>`);
  }, '');

  const thumbnails = thumbnailFiles.reduce((accumulator, thumbnailFile) => {
    return accumulator.concat(`<img src="data:image/bmp;base64,${thumbnailFile}" alt="thumbnailFile"/>`);
  }, '');

  const indexData = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Template 1</title>
    </head>
    <body>
    ${images}
    ${thumbnails}
    </body>
    </html> 
  `;

  fs.writeFileSync(`public/${item}`, indexData);
};


fs.readdir(templatesPath, function(err, templates) {


  templates.forEach((template) => {
    const buffer = fs.readFileSync(`${templatesPath}/${template}`);
    const content = buffer.toString();
    const contentParts = content.split('"');

    const imagePaths = [];
    const thumbnails = [];
    contentParts.forEach((part) => {
      if (part.includes('../images')) {
        imagePaths.push(part.slice(3));
      }
    });

    imagePaths.forEach((imagePath) => {
      thumbnails.push(generateThumbnail(imagePath));
    });

    writeToHtml(template, imagePaths, thumbnails);
  });
});
