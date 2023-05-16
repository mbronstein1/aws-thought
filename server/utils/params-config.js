const { v4: uuidv4 } = require('uuid');

const params = fileName => {
  const myFile = fileName.originalname.split('.');
  const fileType = myFile[myFile.length - 1];

  const imageParams = {
    Bucket: 'user-images-465d81e6-00da-4599-874c-703057c1b98a',
    Key: `${uuidv4()}.${fileType}`,
    Body: fileName.buffer,
  };

  return imageParams;
};

module.exports = params;
