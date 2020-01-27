const ImageParser = require('./ImageParser');
const ImageCompressor = require('./ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);

class ThumbnailCreator {

  generateThumbnail = async (imageSet, image) => {
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

}

module.exports = ThumbnailCreator;