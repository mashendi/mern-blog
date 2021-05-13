// future use

const router = require("express").Router();
const Subscriber = require("../models/subscriberModel");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const newSubscriber = new Subscriber({
      name,
    });

    const savedSubscriber = await newSubscriber.save();

    res.json(savedSubscriber);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
