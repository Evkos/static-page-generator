class DataEnricher {

  constructor(thumbnailCreator) {
    this.thumbnailCreator = thumbnailCreator;
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

  addTemplateDataThumbnails = async templateImages => {
    if (templateImages == undefined) {
      return templateImages;
    }
    for await (const key of Object.keys(templateImages)) {
      templateImages[key].thumbnail = this.thumbnailCreator.getThumbnail(templateImages[key].src);
    }

    return templateImages;
  };

}

module.exports = DataEnricher;
