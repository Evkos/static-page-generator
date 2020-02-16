const ThumbnailCreator = require('./thumbnailsCreator/ThumbnailCreator');
const thumbnailCreator = new ThumbnailCreator();

class DataEnricher {

  run = (dataObject) => {
    const images = dataObject.images;
    for (const imageKey in images) {
      thumbnailCreator.getThumbnail(images[imageKey].src)
        .then((thumbnail) => {
          images[imageKey].thumbnail = thumbnail;
        });
    }
    return dataObject;
  };

}

module.exports = DataEnricher;