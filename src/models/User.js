// This file contains the model for type User
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// email object configurations
// this schema tells mongoose about the structure
// every data object should have
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// this associates our userSchema with our mongoose library
mongoose.model("User", userSchema);
