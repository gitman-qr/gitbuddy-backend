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
  console.log(req.body);
  const { error, value } = registerValidation(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists)
    return res.status(400).send({ error: "username already exists" });

  const salt = bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, parseInt(salt));

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
  const { error, value } = loginValidation(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(400).send({ error: "username or password is wrong" });
  }

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).send({ error: "username or password is wrong" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  return res.header("auth-token", token).send({ user: token });
});

module.exports = router;
