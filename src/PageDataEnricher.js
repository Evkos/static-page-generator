const ThumbnailCreator = require('./thumbnailsCreator/ThumbnailCreator');
const thumbnailCreator = new ThumbnailCreator();

class PageDataEnricher {

  /**
   * This method modify input parameter, adding "thumbnail" key
   * @param pageData
   * @returns {Promise<*>}
   */
  addThumbnails = async (pageData) => {
    if (pageData.images === undefined) {
      return pageData;
    }

    const images = pageData.images;
    const imagesKeys = Object.keys(images);
    for (const i in imagesKeys) {
      images[imagesKeys[i]].thumbnail = await thumbnailCreator.getThumbnail(images[imagesKeys[i]].src);
    }
    return pageData;
  };
}

module.exports = PageDataEnricher;