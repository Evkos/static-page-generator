const fs = require('fs');
const publicPath = process.env.PUBLIC_PATH;

class HtmlRenderer {
  renderHtml = (name, content, thumbnailsData) => {

    const indexData = content.replace(/{{thumbnail:(.*)}}/g, (match, src) => {
      const thumbnail = thumbnailsData.find((item) => {
        if (src === item.src) {
          return item;
        }
      });

      if (thumbnail) {
        return `<img src="data:image/bmp;base64,${thumbnail.data}" alt="${thumbnail.alt}"/>`;
      }
    });

    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath);
    }
    fs.writeFile(`${publicPath}/${name}`, indexData, () => {
    });
  };
}

module.exports = HtmlRenderer;