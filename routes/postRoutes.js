const router = require("express").Router();
const Post = require("../models/postModel");

router.get("/", (req, res) => {
  Post.find().then((response) => res.json(response));
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id.toString()).then((response) =>
    res.json(response)
  );
});

router.post("/", (req, res) => {
  const { title, createdAt, tags, body } = req.body;
  console.log({ title, createdAt, tags, body });

  const newPost = new Post({ title, createdAt, tags, body });

  try {
    newPost.save().then((response) => res.json(response));
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
