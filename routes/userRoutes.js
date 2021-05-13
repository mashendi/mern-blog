const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const Post = require("../models/postModel");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/profiles/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});

router.post("/", upload.single("profilePic"), async (req, res) => {
  try {
    console.log(req);
    const { username, email, password, passwordVerify } = req.body;
    const profilePic = req.file.originalname;

    // validation
    if (!username || !email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required feilds" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        errorMessage: "Password must be equal or more than 8 characters",
      });
    }

    if (password !== passwordVerify) {
      return res.status(400).json({
        errorMessage: "Make sure password and password confirm are equal",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ errorMessage: "Email already exists" });
    }

    // hashing password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // add user to database
    const newUser = new User({ username, email, passwordHash, profilePic });
    try {
      const savedUser = await newUser.save();
      const token = jwt.sign({ user: savedUser._id }, process.env.JWT_SECRET);
      console.log(token);

      // set cookie
      res.cookie("token", token, { httpOnly: true });
      res.cookie("username", username);
      res.send();
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required feilds" });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(401).json({ errorMessage: "Wrong email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ errorMessage: "Wrong email or password" });
    }

    // generate token
    const token = jwt.sign({ user: userExists._id }, process.env.JWT_SECRET);

    // send token
    res.cookie("token", token, { httpOnly: true });
    res.cookie("username", userExists.username);
    res.send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("username", "", {
    expires: new Date(0),
  });
  res.send();
});
router.get("/:username/posts", (req, res) => {
  Post.find({ "postedBy.username": req.params.username })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/", (req, res) => {
  User.find().then((response) => res.json(response));
});

module.exports = router;
