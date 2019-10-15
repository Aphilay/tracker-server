// this file creates a simple server using express and connects to MongoDB
// did not assign this require to anything because we only want this code
// mongoose.model("User", userSchema); to be "modeled" once
require("./models/User");
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const app = express();
const requireAuth = require("./middlewares/requireAuth");
const trackRoutes = require("./routes/trackRoutes");
// BodyParser is used to handle request as json
// because express does not recognize json by default
// Bodyparser middleware is included in express
app.use(express.json());
// our router object inside authRoutes, trackRoutes
// now has access to app object
app.use(authRoutes);
app.use(trackRoutes);

// mongoUri TODO: export this to a
//separate config file then call config.get('mongoUri')
const mongoURI =
  "mongodb+srv://admin:MongoTracker@tracker-cluster-wiqu8.mongodb.net/test?retryWrites=true&w=majority";

// connect to Mongo using mongoose.
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

// connection check: upon connection or error, this will run
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB instance...");
});
mongoose.connection.on("error", err => {
  console.error("Error connecting to Mongo", err);
});

// default route
// requireAuth: middleware to check if jwt is valid
// then access route handler
app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

// process.env.PORT is the enviroment varible
// used in deployment. If it's not available, run on 3000.
const PORT = process.env.PORT || 3000;
// .listen runs the web server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
