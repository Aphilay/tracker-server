// this module validates a given token
// it extracts the jwt from the authorization header
// extracts the user id out of it
// uses that id to find the appropriate user in the db
// then assign the user model to our request object
// request handler prints information about user and sends it back inside response
// this module is called upon every request, being used in app.js '/' route
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // Express downcasts any header e.g. "Authorization" => "authorization"
  const { authorization } = req.headers;
  // authorization === "Bearer lalsfdiojweljad"

  if (!authorization) {
    res.status(401).send("You must be logged in.");
  }

  // Extract token from authorization header
  const token = authorization.replace("Bearer ", "");

  // verify: 1st arg: token to validate
  // 2nd: secret key
  // 3rd: callback function after validation
  // payload: whatever info was included with the token
  // e.g. {user: user._id}
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send("You must be logged in.");
    }

    // extract userId property from payload
    const { userId } = payload;

    // mongoose async method findById
    const user = await User.findById(userId);

    // assign user to user property in request obj
    // so any other request handler can get access to the User model
    req.user = user;

    // flags that this middleware is complete
    // call next middleware function in chain of middlewares
    next();
  });
};
