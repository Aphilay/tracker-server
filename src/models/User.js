// This file contains the model for type User
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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

// pre-save hook, this function will run
// before we attempt to save it into the DB
// function declaration instead of arrow func "()=>"
// b/c we want access to the user in context 'this'
// arrow function inherits 'this' from the context of the file (parent function)
userSchema.pre("save", function(next) {
  const user = this;
  // if user has not modified pw in anyway, don't try to salt anything
  if (!user.isModified("password")) {
    // continue on by calling next, similiar to middleware function
    return next();
  }

  // generate salt
  // 10: how complex we want the salt to be
  // salt: our plain text string
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // hash pw with salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      // overwrite plain-text pw with resulted hash & salted pw
      user.password = hash;
      next();
    });
  });
});

// automate pw comparison process
// keyword function again b/c we want to operate on the object(this), not the parent context
userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!ismatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

// this associates our userSchema with our mongoose library
mongoose.model("User", userSchema);
// test commit
