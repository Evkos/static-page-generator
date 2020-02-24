class DataEnricher {

  constructor(thumbnailCreator) {
    this.thumbnailCreator = thumbnailCreator;
  }

  addThumbnails = async (images) => {
    if (images !== undefined) {
      for await (const key of Object.keys(images)) {
        images[key].thumbnail = this.thumbnailCreator.getThumbnail(images[key].src);
      }
      return images;
    }
  };
}

module.exports = DataEnricher;
