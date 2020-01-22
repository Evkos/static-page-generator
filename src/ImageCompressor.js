class ImageCompressor {
  compressingMethod;

  compressingFactor;

  constructor(method, factor) {
    this.compressingMethod = method;
    this.compressingFactor = factor;
  }

  compressPixels = (pixels, hasPallet = false) => {
    let compressedPixel;

    switch (this.compressingMethod) {
      case 'top-left':
        if (hasPallet) {
          const [firstPixel] = pixels;
          compressedPixel = firstPixel;
        } else {
          compressedPixel = {
            r: pixels[0][0],
            g: pixels[0][1],
            b: pixels[0][2],
          };
        }
        break;
      case 'average':
        if (hasPallet) {
          throw new Error('Unsupported format (8-bit) for this method. Please use only 24-bit BMP images');
        }
        compressedPixel = {
          r: (pixels[0][0] + pixels[1][0] + pixels[2][0] + pixels[3][0]) / 4,
          g: (pixels[0][1] + pixels[1][1] + pixels[2][1] + pixels[3][1]) / 4,
          b: (pixels[0][2] + pixels[1][2] + pixels[2][2] + pixels[3][2]) / 4,
        };
        break;
      default:
        compressedPixel = null;
        break;
    }

    return compressedPixel;
  };

  updatePixels24Bit = (pixelData, bitMapInfoHeader) => {
    const arrayHeight = bitMapInfoHeader.imageHeight;
    const arrayImageWidth = bitMapInfoHeader.imageWidth * 3;
    const arrayWidth = bitMapInfoHeader.imageWidth * 3 + this.getPadding(bitMapInfoHeader.imageWidth * 3);

    const updatedPixelData = [];

    for (let dH = 0; dH < arrayHeight; dH += 2) {
      for (let dW = 0; dW < arrayImageWidth; dW += 6) {
        const pixels = [
          [pixelData[dH * arrayWidth + dW], pixelData[dH * arrayWidth + dW + 1], pixelData[dH * arrayWidth + dW + 2]],
          [
            pixelData[dH * arrayWidth + dW + 3],
            pixelData[dH * arrayWidth + dW + 4],
            pixelData[dH * arrayWidth + dW + 5],
          ],
          [
            pixelData[arrayWidth + dH * arrayWidth + dW],
            pixelData[arrayWidth + dH * arrayWidth + dW + 1],
            pixelData[arrayWidth + dH * arrayWidth + dW + 2],
          ],
          [
            pixelData[arrayWidth + dH * arrayWidth + dW + 3],
            pixelData[arrayWidth + dH * arrayWidth + dW + 4],
            pixelData[arrayWidth + dH * arrayWidth + dW + 5],
          ],
        ];

        const { r, g, b } = this.compressPixels(pixels);
        updatedPixelData.push(r, g, b);
      }

      this.countPadding(updatedPixelData, bitMapInfoHeader, 3);
    }

    return updatedPixelData;
  };

  updatePixels8Bit = (pixelData, bitMapInfoHeader) => {
    const arrayHeight = bitMapInfoHeader.imageHeight;
    const arrayImageWidth = bitMapInfoHeader.imageWidth;
    const arrayWidth = bitMapInfoHeader.imageWidth + this.getPadding(bitMapInfoHeader.imageWidth);

    const updatedPixelData = [];

    for (let dH = 0; dH < arrayHeight; dH += 2) {
      for (let dW = 0; dW < arrayImageWidth; dW += 2) {
        const pixels = [
          pixelData[dH * arrayWidth + dW],
          pixelData[dH * arrayWidth + dW + 1],
          pixelData[arrayWidth + dH * arrayWidth + dW],
          pixelData[arrayWidth + dH * arrayWidth + dW + 1],
        ];

        const compressedPixel = this.compressPixels(pixels, true);
        updatedPixelData.push(compressedPixel);
      }
      this.countPadding(updatedPixelData, bitMapInfoHeader);
    }

    return updatedPixelData;
  };

  getPadding = pixelsPerRow => {
    const uncoveredPixels = pixelsPerRow % 4;
    return uncoveredPixels === 0 ? 0 : 4 - uncoveredPixels;
  };

  getDeepCopy = imageObject => {
    return JSON.parse(JSON.stringify(imageObject));
  };

  countPadding = (updatedPixelData, bitMapInfoHeader, factor = 1) => {
    const padding = this.getPadding(Math.ceil(bitMapInfoHeader.imageWidth / 2) * factor);
    // TODO make it shorter
    for (let i = 0; i < padding; i += 1) {
      updatedPixelData.push(0);
    }
  };

  compressImage = imageObject => {
    const { bitMapInfoHeader, colorPallet, pixelData } = imageObject;

    const modifiedObject = this.getDeepCopy(imageObject);

    modifiedObject.pixelData = !colorPallet
      ? this.updatePixels24Bit(pixelData, bitMapInfoHeader)
      : this.updatePixels8Bit(pixelData, bitMapInfoHeader);

    modifiedObject.bitMapFileHeader.fileSize =
      modifiedObject.pixelData.length + modifiedObject.bitMapFileHeader.pixelDataOffset;
    modifiedObject.bitMapInfoHeader.imageSize = modifiedObject.pixelData.length;
    modifiedObject.bitMapInfoHeader.imageHeight = Math.ceil(bitMapInfoHeader.imageHeight / this.compressingFactor);
    modifiedObject.bitMapInfoHeader.imageWidth = Math.ceil(bitMapInfoHeader.imageWidth / this.compressingFactor);

    return modifiedObject;
  };
}

module.exports = ImageCompressor;
