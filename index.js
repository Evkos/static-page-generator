const fs = require('fs');
const ImageParser = require('./src/ImageParser');
const ImageCompressor = require('./src/ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);

const templatesPath = process.env.TEMPLATES_PATH;

const generateThumbnail = image => {
  const imageObject = imageParser.parseImageFileToImageObject(image.src);
  const compressedImageObject = imageCompressor.compressImage(imageObject);
  return {
    src: imageParser.parseImageBufferToBase64(compressedImageObject),
    alt: image.alt,
  };
};

const writeToHtml = (name, content, imagePaths, thumbnailFiles) => {

  const images = imagePaths.reduce((accumulator, imagePath) => {
    return accumulator.concat(`<img src="../${imagePath.src}" alt="${imagePath.alt}"/>`);
  }, '');

  const thumbnails = thumbnailFiles.reduce((accumulator, thumbnailFile) => {
    return accumulator.concat(`<img src="data:image/bmp;base64,${thumbnailFile.src}" alt="${thumbnailFile.alt}"/>`);
  }, '');

  console.log(images);
  console.log(thumbnails);

  const indexData = content.replace(/{{(.*)}}/gs, `${images}${thumbnails}`);
  //console.log(indexData)
  fs.writeFile(`public/${name}`, indexData, (error) => {
  });
};


fs.readdir(templatesPath, function(err, templates) {

  templates.forEach((templateName) => {

    const buffer = fs.readFileSync(`${templatesPath}/${templateName}`);
    const content = buffer.toString();

    const contentParts = content.match(/<(.*)>/g);

    //console.log(contentParts);

    const images = [];
    const thumbnails = [];

    contentParts.forEach((part) => {
      //console.log(part)
      const partArray = part.match(/src="..\/(.*)" alt="(.*)"/);
      //console.log(partArray);
      if (partArray) {
        const imageObject = {
          src: partArray[1],
          alt: partArray[2],
        };
        images.push(imageObject);
      }


    });


    images.forEach((image) => {
      thumbnails.push(generateThumbnail(image));
    });


    writeToHtml(templateName, content, images, thumbnails);
  });
});
