const router = require("express").Router();
const bcryipt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // Lets validate the data before we make a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if alerady in the Database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send(`email ${req.body.email} alerady email Exist`);

  // HASH The password
  const salt = await bcryipt.genSalt(10);
  const hashedPassword = await bcryipt.hash(req.body.password, salt);

  // Create a new user

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUsers = await user.save();
    res.status(200).send({ user: user._id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  // Lets validate the data before we make a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Check if User exist in  the Database
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send(`${req.body.email}  email is not found`);
  //  PASSWORD IS correct
  const validPass = await bcryipt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  //Create and assigne a token

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
