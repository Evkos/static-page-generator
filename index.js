const fs = require('fs');
const events = require('events');
const ImageParser = require('./src/ImageParser');
const ImageCompressor = require('./src/ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);
const eventEmitter = new events.EventEmitter();

const templatesPath = process.env.TEMPLATES_PATH;
const publicPath = process.env.PUBLIC_PATH;

const generateThumbnail = async (imageSet, image) => {
  const imageObject = await imageParser.parseImageFileToImageObject(image.src);
  const compressedImageObject = imageCompressor.compressImage(imageObject);
  imageSet.push(
    image,
    {
      type: 'thumbnail',
      src: imageParser.parseImageBufferToBase64(compressedImageObject),
      alt: image.alt,
    },
  );
};

const writeToHtml = (name, content, imageSet) => {
  const images = imageSet.reduce((result, item) => {
    if (item.type === 'image') {
      return result.concat(`<img src="../${item.src}" alt="${item.alt}"/>`);
    }
    return result.concat(`<img src="data:image/bmp;base64,${item.src}" alt="${item.alt}"/>`);
  }, '');

  const indexData = content.replace(/{{(.*)}}/gs, `${images}`);

  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }
  fs.writeFile(`${publicPath}/${name}`, indexData, () => {
  });
};

const getImages = (contentParts) => {
  const images = [];
  contentParts.forEach((part) => {
    const partArray = part.match(/src="..\/(.*)" alt="(.*)"/);
    if (partArray) {
      const imageObject = {
        type: 'image',
        src: partArray[1],
        alt: partArray[2],
      };
      images.push(imageObject);
    }
  });

  return images;
};

eventEmitter.on('read_template', (templateName) => {
  fs.readFile(`${templatesPath}/${templateName}`, (err, buffer) => {

    const content = buffer.toString();
    const contentParts = content.match(/<(.*)>/g);

    const imageSet = [];
    const images = getImages(contentParts);

    images.forEach((image) => {
      generateThumbnail(imageSet, image).then(() => {
        writeToHtml(templateName, content, imageSet);
      });
    });
  });
});

fs.readdir(templatesPath, (err, templates) => {
  templates.forEach((templateName) => {
    eventEmitter.emit('read_template', templateName);
  });
});





