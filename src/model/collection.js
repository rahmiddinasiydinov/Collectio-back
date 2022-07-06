const { Schema, model } = require("mongoose");

const collectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  img: String,
  isMarkdown: {
    type: Boolean,
    default: false
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Items",
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  createdAt: Date,
});
const collectionModel = model("Collections", collectionSchema);
module.exports = {
  collectionModel,
};
