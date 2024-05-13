const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
  },
  rP: {
    type: Number,
    required: false,
  },
  rW: {
    type: Number,
    required: false,
  },
  rL: {
    type: Number,
    required: false,
  },
  WPL: {
    type: Number,
    required: false,
  },
});

userSchema.methods.done = function () {
  const greeting = `User ${this.login} has been successfully registered`;
  console.log(greeting);
};

const User = mongoose.model("User", userSchema);

module.exports = User;