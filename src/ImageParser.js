const fs = require('fs');
const ImageModel = require('./ImageModel');

class ImageParser {
  parseImageFileToImageObject = imageFile => {
    const imageBuffer = fs.readFileSync(imageFile);
    return this.parseImageBufferToImageObject(imageBuffer);
  };

  parseImageBufferToImageObject = imageBuffer => {
    const model = new ImageModel();
    const fileHeader = model.bitMapFileHeader;
    const infoHeader = model.bitMapInfoHeader;

    fileHeader.fileType = imageBuffer.readUIntLE(0, 2);
    fileHeader.fileSize = imageBuffer.readUIntLE(2, 4);
    fileHeader.reserved1 = imageBuffer.readUIntLE(6, 2);
    fileHeader.reserved2 = imageBuffer.readUIntLE(8, 2);
    fileHeader.pixelDataOffset = imageBuffer.readUIntLE(10, 4);

    infoHeader.headerSize = imageBuffer.readUIntLE(14, 4);
    infoHeader.imageWidth = imageBuffer.readIntLE(18, 4);
    infoHeader.imageHeight = imageBuffer.readIntLE(22, 4);
    infoHeader.planes = imageBuffer.readUIntLE(26, 2);
    infoHeader.bitsPerPixel = imageBuffer.readUIntLE(28, 2);
    infoHeader.compression = imageBuffer.readUIntLE(30, 4);
    infoHeader.imageSize = imageBuffer.readUIntLE(34, 4);
    infoHeader.xPixelsPerMeter = imageBuffer.readIntLE(38, 4);
    infoHeader.yPixelsPerMeter = imageBuffer.readIntLE(42, 4);
    infoHeader.totalColors = imageBuffer.readUIntLE(46, 4);
    infoHeader.importantColors = imageBuffer.readUIntLE(50, 4);
    if (infoHeader.bitsPerPixel <= 8) {
      model.colorPallet = imageBuffer.slice(54, fileHeader.pixelDataOffset);
    }
    model.pixelData = imageBuffer.slice(fileHeader.pixelDataOffset);

    return model;
  };

  parseImageObjectToImageBuffer = ({ bitMapFileHeader, bitMapInfoHeader, colorPallet, pixelData }) => {
    const headersBuffer = Buffer.alloc(54);
    let colorPalletBuffer = Buffer.alloc(0);
    if (colorPallet) {
      colorPalletBuffer = Buffer.from(colorPallet);
    }
    const pixelsBuffer = Buffer.from(pixelData);

    headersBuffer.writeUIntLE(bitMapFileHeader.fileType, 0, 2);
    headersBuffer.writeUIntLE(bitMapFileHeader.fileSize, 2, 4);
    headersBuffer.writeUIntLE(bitMapFileHeader.reserved1, 6, 2);
    headersBuffer.writeUIntLE(bitMapFileHeader.reserved2, 8, 2);
    headersBuffer.writeUIntLE(bitMapFileHeader.pixelDataOffset, 10, 4);

    headersBuffer.writeUIntLE(bitMapInfoHeader.headerSize, 14, 4);
    headersBuffer.writeUIntLE(bitMapInfoHeader.imageWidth, 18, 4);
    headersBuffer.writeUIntLE(bitMapInfoHeader.imageHeight, 22, 4);
    headersBuffer.writeUIntLE(bitMapInfoHeader.planes, 26, 2);
    headersBuffer.writeUIntLE(bitMapInfoHeader.bitsPerPixel, 28, 2);
    headersBuffer.writeUIntLE(bitMapInfoHeader.compression, 30, 4);
    headersBuffer.writeUIntLE(bitMapInfoHeader.imageSize, 34, 4);
    headersBuffer.writeUIntLE(bitMapInfoHeader.xPixelsPerMeter, 38, 4);
    headersBuffer.writeUIntLE(bitMapInfoHeader.yPixelsPerMeter, 42, 4);
    headersBuffer.writeUIntLE(bitMapInfoHeader.totalColors, 46, 4);
    headersBuffer.writeUIntLE(bitMapInfoHeader.importantColors, 50, 4);

    return Buffer.concat([headersBuffer, colorPalletBuffer, pixelsBuffer]);
  };

  parseImageBufferToBase64 = imageObject => {
    const imageBuffer = this.parseImageObjectToImageBuffer(imageObject);

    return imageBuffer.toString('base64');
  };
}

module.exports = ImageParser;
