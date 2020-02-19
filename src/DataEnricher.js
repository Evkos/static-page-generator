class DataEnricher {

  constructor(thumbnailCreator) {
    this.thumbnailCreator = thumbnailCreator;
  }

  addThumbnails = async (data) => {
    if (data.slug !== undefined) {
      return await this.addPageDataThumbnails(data);
    } else {
      return await this.addTemplateDataThumbnails(data);
    }
  };


  /**
   * This method modify input parameter, adding "thumbnail" key
   * @param pageData
   * @returns {Promise<*>}
   */
  addPageDataThumbnails = async pageData => {
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

  concatData = (templateData, pageData) => {
    pageData.templateImages = templateData;
    return pageData;
  };

}

module.exports = DataEnricher;
