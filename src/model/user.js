const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  fullName: String,
  email: String,
  img: String,
  createdAt: Date,
  updatedAt: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  collections: [{
    type: Schema.Types.ObjectId,
    ref:"Collections"
  }],
  items: [{
    type: Schema.Types.ObjectId,
    ref:'Items'
  }]
});
const userModel = model("Users", userSchema);
module.exports = {
  userModel,
};
