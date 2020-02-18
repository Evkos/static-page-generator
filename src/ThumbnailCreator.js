const ImageParser = require('./ImageParser');
const ImageCompressor = require('./ImageCompressor');

const imageParser = new ImageParser();
const imageCompressor = new ImageCompressor('top-left', 2);
const thumbnailsCache = [];

class ThumbnailCreator {
  getThumbnail = imageSrc => {
    const thumbnail = this.tryGetThumbnailFromCache(imageSrc);
    if (thumbnail) return thumbnail;

    const compressedImageBase64 = this.generateThumbnail(imageSrc);
    this.addThumbnailToCache(imageSrc, compressedImageBase64);

    return compressedImageBase64;
  };

  generateThumbnail = imageSrc => {
    const imageObject = imageParser.parseImageFileToImageObject(imageSrc);
    const compressedImageObject = imageCompressor.compressImage(imageObject);
    return imageParser.parseImageBufferToBase64(compressedImageObject);
  };

  addThumbnailToCache = (imageSrc, compressedImageBase64) => {
    thumbnailsCache[imageSrc] = compressedImageBase64;
  };

  tryGetThumbnailFromCache = imageSrc => {
    return thumbnailsCache[imageSrc];
  };
}

module.exports = ThumbnailCreator;
