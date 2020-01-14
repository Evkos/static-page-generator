const fs = require('fs');

/*const generateThumbnailAsync = (imagePath) => {
  fs.readFile(imagePath, function(err, data) {
    createIndexFile(imagePath, thumbnailFile);
  });
};*/

const generateThumbnail = (imagePath) => {
  const data = fs.readFileSync(imagePath);
  const compressedData = compressImage(data);
  return Buffer.from(compressedData).toString('base64');
};


const compressImage = (data) => {
  return data;
};


const createIndexFile = (imagePath, thumbnailFile) => {
  const indexData = `
  <img id="image" src="${imagePath}"/>
  <img id="thumbnail" src="data:image/bmp;base64,${thumbnailFile}"/ >
  `;

  fs.writeFile('index.html', indexData, function(err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
};

const thumbnail = generateThumbnail('image.bmp');
createIndexFile('image.bmp', thumbnail);





