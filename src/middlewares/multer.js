const multer = require("multer");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log(file, 2);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const type = file.originalname.split(".");
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + type[1]);
  },
});

const upload = multer({ storage: storage });
module.exports = { upload };

// {
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const type = file.originalname.split('.');
//     cb(null, file.fieldname + "-" + uniqueSuffix + '.' + type[1]);
//   },
// }
