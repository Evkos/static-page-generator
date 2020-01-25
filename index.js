const fs = require('fs');
const path = require('path');
const ImageParser = require('./src/ImageParser');
const ImageCompressor = require('./src/ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);

const templatesPath = path.resolve(process.env.TEMPLATES_PATH);

const generateThumbnail = async (thumbnails, image) => {
  const imageObject = await imageParser.parseImageFileToImageObject(image.src);
  const compressedImageObject = imageCompressor.compressImage(imageObject);
  thumbnails.push({
    src: imageParser.parseImageBufferToBase64(compressedImageObject),
    alt: image.alt,
  });
};

const writeToHtml = (name, content, imagePaths, thumbnailFiles) => {

  const images = imagePaths.reduce((accumulator, imagePath) => {
    return accumulator.concat(`<img src="../${imagePath.src}" alt="${imagePath.alt}"/>`);
  }, '');

  const thumbnails = thumbnailFiles.reduce((accumulator, thumbnailFile) => {
    return accumulator.concat(`<img src="data:image/bmp;base64,${thumbnailFile.src}" alt="${thumbnailFile.alt}"/>`);
  }, '');

  const indexData = content.replace(/{{(.*)}}/gs, `${images}${thumbnails}`);

  const resultsFolder = 'public';

  if (!fs.existsSync(resultsFolder)) {
    fs.mkdirSync(resultsFolder);
  }
  fs.writeFile(`${resultsFolder}/${name}`, indexData, () => {
  });
};

const main = () => {
  fs.readdir(templatesPath, (err, templates) => {

    templates.forEach((templateName) => {
      fs.readFile(`${templatesPath}/${templateName}`, (err, buffer) => {

        const content = buffer.toString();
        const contentParts = content.match(/<(.*)>/g);

        const images = [];
        const thumbnails = [];

        contentParts.forEach((part) => {
          const partArray = part.match(/src="..\/(.*)" alt="(.*)"/);
          if (partArray) {
            const imageObject = {
              src: partArray[1],
              alt: partArray[2],
            };
            images.push(imageObject);
          }

        });

        images.forEach((image) => {
          generateThumbnail(thumbnails, image).then(() => {
            writeToHtml(templateName, content, images, thumbnails);
          });
        });
      });

    });
  });
};

main();



