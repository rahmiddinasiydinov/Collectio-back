const { Schema, model } = require("mongoose"); ;
const tagSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: Date,
});
const tagModel = model("Tags", tagSchema);

module.exports = {
    tagModel
}