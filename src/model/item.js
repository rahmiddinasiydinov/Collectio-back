const { Schema, model } = require("mongoose"); ;
const itemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
  },
  desc: String,
  tag: {
    type: Schema.Types.ObjectId,
    ref: "Tags",
  },
  img: String,
  isMarkdown: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  views: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  collectionName: {
    type: Schema.Types.ObjectId,
    ref: "Collections",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  createdAt: Date,
});
const itemModel = model("Items", itemSchema);
module.exports = {
    itemModel
}