class ImageModel {
  bitMapFileHeader = {
    fileType: null,
    fileSize: null,
    reserved1: null,
    reserved2: null,
    pixelDataOffset: null,
  };

  bitMapInfoHeader = {
    headerSize: null,
    imageWidth: null,
    imageHeight: null,
    planes: null,
    bitsPerPixel: null,
    compression: null,
    imageSize: null,
    xPixelsPerMeter: null,
    yPixelsPerMeter: null,
    totalColors: null,
    importantColors: null,
  };

  colorPallet = null;

  pixelData = null;
}

module.exports = ImageModel;
