const { collectionModel } = require("../model/collection");
const { userModel } = require("../model/user");
const { uploader } = require("../utils/utils");
const Collection = {
  GET_ALL: async (req, res) => {
    try {
      const data = await collectionModel
        .find({})
        .sort({ createdAt: -1 })
        .populate("user");
      res.status(200).send({
        status: 200,
        data,
      });
    } catch (error) {
      res.send({
        status: 404,
        message: "Item not found",
      });
    }
  },
  GET: async (req, res) => {
    try {
      const data = await collectionModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(7)
        .populate("user");
      res.status(200).send({
        status: 200,
        data,
      });
    } catch (error) {
      res.send({
        status: 404,
        message: "Item not found",
      });
    }
  },
  GETONE: async (req, res) => {
    try {
      const { id } = req.query;
      const oneCollection = await collectionModel.findById(id).populate('user').populate('items');
      res.send({
        status: 200,
        data: oneCollection,
      });
    } catch (error) {
      res.send({
        status: 404,
        message: "Collection not found",
      });
    }
  },
  GET_BY_USER: async (req, res) => {
    try {
      const { id } = req.query;
      const user = await userModel.findOne({ _id: id }).populate("collections");
      res.send({
        status: 200,
        data: user?.collections,
      });
    } catch (error) {
      res.send({
        status: 404,
        message: "User not found",
      });
    }
  },
  POST: async (req, res) => {
    try {
      const { name, desc, topic, userId } = req.body;
      console.log(name, desc, topic);
      const response = await uploader(req.file.path);
      console.log(response);
      const newCollection = new collectionModel({
        name,
        desc,
        topic,
        img: response.url,
        createdAt: new Date().getTime(),
        user: userId,
      });
      const data = await newCollection.save();
      const user = await userModel.findOne({ _id: userId });
      user?.collections.push(data._id);
      await user.save();
      const upDated = await userModel
        .findOne({ _id: userId })
        .populate("collections");
      res.send({
        status: 200,
        message: "Successfully created!",
        data: upDated,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: "Internal server error",
      });
    }
  },
};
module.exports = {
  Collection,
};
