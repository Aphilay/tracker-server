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

router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  // validation
  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and locations" });
  }

  // create new track to be saved inside MongoDB
  const track = new Track({ name, locations, userId: req.user._id });

  try {
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
