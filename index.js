const env = require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
// Import routes
mongoose.connect(
  process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("mongdb is connected");
  }
);

const cors = require("cors");
app.use(cors());

// MiddleWare to use json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const authRoutes = require("./routes/auth");

app.use("/app/user", authRoutes);
// Index Route
app.get("/", (req, res) => {
  res.send({
    msg: "Hello there this app is working totally fine",
    route: "/app/user/register",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
