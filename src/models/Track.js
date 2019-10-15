// this module represents the structure of a created track
const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number
  }
});
const trackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // this tells mongoose this references another object stored inside MongoDB
    ref: "User"
  },
  name: {
    type: String,
    default: "" //if name is not provided, default is blank
  },
  locations: [pointSchema]
});

// we only load up "Track" to mongoose and not "Point"
//becuase we don't need to use pointSchema outside of this module,
// it is embedded in trackSchema instead
mongoose.model("Track", trackSchema);
