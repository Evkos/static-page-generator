const getImages = (contentParts) => {
  const images = [];
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

  return images;
};

module.exports.getImages = getImages;