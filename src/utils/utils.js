const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dfxwyxeuq",
  api_key: "577473634935249",
  api_secret: "Os5SqEcoYBMN7sfRr5jc_Ai8bNE",
});

const uploader = (path) => {
  return cloudinary.uploader.upload(path);
};

module.exports = {
  uploader,
};


