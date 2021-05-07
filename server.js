const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// setup express
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started on port: ${PORT} - http://localhost:${PORT}`)
);

// set up routes
app.use("/posts", require("./routes/postRoutes"));

// setup mongoose
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) return console.error(err);
    console.log("Mongodb connection established");
  }
);
