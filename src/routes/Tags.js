const { tagModel } = require("../model/tags") ;
const Tag = {
  GET: async (req, res) => {
    try {
      const tags = await tagModel.find();
      res.send({
        status: 200,
        data: tags,
      });
    } catch (error) {
      res.send({
        status: 500,
        message: "Internal server error!",
      });
    }
  },
  POST: async (req, res) => {
    const { title } = req.body;
    const newTag = new tagModel({
      title,
      createdAt: new Date().getTime(),
    });
    const data = await newTag.save();
  },
};
module.exports = {
    Tag
}