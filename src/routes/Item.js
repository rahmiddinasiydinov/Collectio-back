const { collectionModel } = require("../model/collection");
const { itemModel } = require("../model/item");
const { uploader } = require("../utils/utils");
const { userModel } = require("../model/user");

const Item = {
  GET_ALL: async (req, res) => {
    try {
      const items = await itemModel.find({}).sort({ createdAt: -1 });
      console.log(req.cookies);
      res.send({
        status: 200,
        data: items,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: "Internal server error",
      });
    }
  },
  GET: async (req, res) => {
    try {
      const items = await itemModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(7)
        .populate("user")
        .populate("collectionName")
        .populate("tag");
      console.log(req.cookies);
      res.send({
        status: 200,
        data: items,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: "Internal server error",
      });
    }
  },
  GETONE: async (req, res) => {
    try {
      const { id, userId } = req.query;
      const item = await itemModel.findOne({ _id: id });
      if (userId != 'undefined') {
        if (!item.views.includes(userId)) {
          item.views.push(userId);
          await item.save();
        }
      }
      const newItem = await itemModel
        .findOne({ _id: id })
        ?.populate("user")
        ?.populate("collectionName")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        });
      res.send({
        status: 200,
        data: newItem,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: 404,
        message: "Item not found",
      });
    }
  },
  GET_BY_USER: async (req, res) => {
    try {
      const { id } = req.query;
      const user = await userModel.findOne({ _id: id }).populate("items");
      res.send({
        status: 200,
        data: user?.items,
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
      const { title, tag, desc, userId, collection } = req.body;
      const response = await uploader(req.file.path);

      const newItem = new itemModel({
        title,
        tag,
        desc,
        img: response.url,
        user: userId,
        createdAt: new Date().getTime(),
        collectionName: collection,
      });
      const data = await newItem.save();
      const user = await userModel.findOne({ _id: userId });
      user?.items.push(data?._id);
      await user.save();
      const foundCollection = await collectionModel.findOne({
        _id: collection,
      });
      foundCollection?.items.push(data?._id);
      await foundCollection.save();
      const upDated = await userModel
        .findOne({ _id: userId })
        .populate("items");

      console.log(upDated);
      res.send({
        status: 200,
        message: "Successfully created!",
        data: upDated,
      });
    } catch (error) {
      res.send({
        status: 500,
        message: "Internal server error",
      });
    }
  },
};
module.exports = {
  Item,
};
