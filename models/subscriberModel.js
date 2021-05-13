const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = Subscriber = mongoose.model("subscriber", subscriberSchema);
