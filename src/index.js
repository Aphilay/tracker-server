// this file creates a simple server using express and connects to MongoDB
// did not assign this require to anything because we only want this code
// mongoose.model("User", userSchema); to be "modeled" once
require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const app = express();

// BodyParser is used to handle request as json
// because express does not recognize json by default
// Bodyparser middleware is included in express
app.use(express.json());
// our router object inside authRoutes
// now has access to app object
app.use(authRoutes);

// mongoUri TODO: export this to a
//separate config file then call config.get('mongoUri')
const mongoURI = "<ENTER YOUR OWN MONGODB URI HERE>";

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

// get request no param
app.get("/", (req, res) => {
  res.send("Hi There!");
});

// process.env.PORT is the enviroment varible
// used in deployment. If it's not available, run on 3000.
const PORT = process.env.PORT || 3000;
// .listen runs the web server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
