const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dfxwyxeuq",
  api_key: "577473634935249",
  api_secret: "Os5SqEcoYBMN7sfRr5jc_Ai8bNE",
});

const uploader = (path) => {
  return cloudinary.uploader.upload(path);
};
const destroyer = (path) => {
  return cloudinary.uploader.destroy(path?.split('/').pop().split('.')[0], {
    invalidate: true,
    resource_type: "image",
  });
}
module.exports = {
  uploader,
  destroyer
};


