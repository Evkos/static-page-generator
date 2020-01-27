const ImageParser = require('./ImageParser');
const ImageCompressor = require('./ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);

class ThumbnailCreator {

  generateThumbnail = async (thumbnailsData, image) => {
    const imageObject = await imageParser.parseImageFileToImageObject(image.src);
    const compressedImageObject = imageCompressor.compressImage(imageObject);
    thumbnailsData.push(
      {
        src: image.src,
        data: imageParser.parseImageBufferToBase64(compressedImageObject),
        alt: image.alt,
      },
    );
  };

}

module.exports = ThumbnailCreator;