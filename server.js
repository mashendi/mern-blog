const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// setup express
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "./public/")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started on port: ${PORT} - http://localhost:${PORT}`)
);

// set up routes
app.use("/posts", require("./routes/postRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/subscribers", require("./routes/subscriberRoutes"));

// setup mongoose
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) return console.error(err);
    console.log("Mongodb connection established");
  }
);
