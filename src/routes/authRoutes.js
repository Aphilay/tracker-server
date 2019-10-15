// this module contains the API route for authentication
// creates a new user and saves to the DB
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// this User model is used to interact with our users in MongoDB.
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

// @route   POST /signup
// @desc    sign in user, calls comparePassword in User model
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Invalid name or password." });
  }

  // if findOne fails to find anything, user will be null
  const user = await User.findOne({ email });

  // no user with the given email found in the DB
  if (!user) {
    return res.status(422).send({ error: "Invalid name or password." });
  }

  // password validation call comparePassword
  // since promise return from comparePassword
  // can be rejected, put into try-catch
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid name or password." });
  }
});

module.exports = router;
