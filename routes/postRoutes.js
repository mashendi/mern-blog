const router = require("express").Router();
const Post = require("../models/postModel");
const User = require("../models/userModel");
const multer = require("multer");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/posts/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  Post.find().then((response) => res.json(response));
});
router.get("/me", auth, (req, res) => {
  console.log(req.user);
  console.log(req.userData);
  Post.find({ postedBy: req.user })
    .populate("postedBy")
    .then((myPosts) => res.json(myPosts))
    .catch((err) => console.error(err));
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id.toString()).then((response) =>
    res.json(response)
  );
});

router.post("/", auth, upload.single("postImage"), (req, res) => {
  const { title, createdAt, tags, body } = req.body;
  const postImage = !req.file
    ? "default_post_image.png"
    : req.file.originalname;
  const postedBy = req.user;
  console.log({ title, createdAt, tags, body, postImage, postedBy });

  const newPost = new Post({
    title,
    createdAt,
    tags,
    body,
    postImage,
    postedBy,
  });

  try {
    newPost.save().then((response) => res.json(response));
  } catch (err) {
    console.log(err);
  }
});

router.put("/update/:id", upload.single("image"), (req, res) => {
  Post.findById(req.params.id).then((post) => {
    (post.title = req.body.title),
      (post.tags = req.body.tags),
      (post.body = req.body.body),
      (post.image = req.file.originalname);
  });
});

module.exports = router;
