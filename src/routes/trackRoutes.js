// this module allows a user to manipulate a track
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Track = mongoose.model("Track");

// all different route handlers will require the user to be
// signed in making use of the requireAuth middleware
router.use(requireAuth);

router.get("/tracks", async (req, res) => {
  // find tracks that are created by this user id
  const tracks = await Track.find({ userId: req.user._id });

  // send array of tracks, it's possible to that it's empty.
  res.send(tracks);
});

module.exports = router;
