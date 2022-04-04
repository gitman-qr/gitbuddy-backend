const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  number: {
    type: String,
    min: 7,
    max: 11,
  },
  address: {
    type: String,
    min: 4,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Register the schema as a model
module.exports = mongoose.model("akshat-db", userSchema);
