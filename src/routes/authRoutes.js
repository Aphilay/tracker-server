const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// get access to User object tied to mongoose
const User = mongoose.model("User");

// @route   POST /signup
// @desc    Register new user
router.post("/signup", async (req, res) => {
  //.body comes from bodyparser middleware
  console.log(req.body);
  // destructure properties from body
  const { email, password } = req.body;
  try {
    // create user object with posted data
    const user = new User({ email, password });
    // async method to save into mongoDB
    await user.save();
    // TEST:res.send("you made a post request");

    // create new jwt
    // _id comes from the default key generator by MongoDB
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    // send back token obj
    res.send({ token });
  } catch (err) {
    // 422: user has either entered a non-unique email,
    // or no email and password at all
    res.status(422).send(err.message);
  }
});

module.exports = router;
