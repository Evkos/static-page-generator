const ThumbnailCreator = require('./thumbnailsCreator/ThumbnailCreator');
const thumbnailCreator = new ThumbnailCreator();

class PageDataEnricher {

  //TODO add doc-comment that method changes input parameter
  addThumbnails = async (pageData) => {
    const images = pageData.images;
    //TODO redo
    const imagesKeys = Object.keys(pageData.images === undefined? {}: pageData.images);
    for (const i in imagesKeys) {
        images[imagesKeys[i]].thumbnail = await thumbnailCreator.getThumbnail(images[imagesKeys[i]].src);
    }
    return pageData;
  };
}

module.exports = PageDataEnricher;