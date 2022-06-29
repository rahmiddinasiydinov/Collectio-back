const { Schema, model } = require("mongoose"); ;
const commentSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,
});
const commentModel = model("Comments", commentSchema);
module.exports = {
    commentModel
}