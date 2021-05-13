const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, required: true },
  tags: { type: [String] },
  body: { type: String, required: true },
  postImage: { type: String },
  postedBy: { type: Object, ref: "User" },
});

module.exports = Post = mongoose.model("post", postSchema);
