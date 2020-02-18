class PageDataEnricher {

  constructor(thumbnailCreator) {
    this.thumbnailCreator = thumbnailCreator
  }
  /**
   * This method modify input parameter, adding "thumbnail" key
   * @param pageData
   * @returns {Promise<*>}
   */
  addThumbnails = async pageData => {
    if (pageData.images === undefined) {
      return pageData;
    }

    const { images } = pageData;
    for await (const key of Object.keys(images)) {
      images[key].thumbnail = this.thumbnailCreator.getThumbnail(images[key].src);
    }

    return pageData;
  };
}

module.exports = PageDataEnricher;
