const router = require("express").Router();
const User = require("../models/User");
const { loginValidation, registerValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/register", (req, res) => {
  console.log("Reached Route");
  res.send("try to send a post request");
});
router.post("/register", async (req, res) => {
  // Validate the data
  console.log(req.body);
  const { error, value } = registerValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);

  // Check if the user already exists
  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists) return res.status(400).send("username already exists");

  const salt = bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, parseInt(salt));

  // Create New User
  const user = new User({
    username: req.body.username,
    number: req.body.number,
    address: req.body.address,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    return res.send({ user: savedUser._id });
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

router.post("/login", async (req, res) => {
  // Validate the data
  const { error, value } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { username, password } = req.body;

  // Validating the email
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(400).send("username or password is wrong");
  }

  // Validating the passowrd
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).send("username or password is wrong");
  }

  // Create a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
