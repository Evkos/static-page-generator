const fs = require('fs');
const publicPath = process.env.PUBLIC_PATH;

class HtmlRenderer {
  renderHtml = (name, content, imageSet) => {
    const images = imageSet.reduce((result, item) => {
      if (item.type === 'image') {
        return result.concat(`<img src="../${item.src}" alt="${item.alt}"/>`);
      }
      return result.concat(`<img src="data:image/bmp;base64,${item.src}" alt="${item.alt}"/>`);
    }, '');

    const indexData = content.replace(/{{(.*)}}/gs, `${images}`);

    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath);
    }
    fs.writeFile(`${publicPath}/${name}`, indexData, () => {
    });
  };
}

module.exports = HtmlRenderer;