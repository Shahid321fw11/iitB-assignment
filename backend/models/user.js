const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  captcha: { type: String, required: true },
  dob: { type: Date, required: true }, // Adding date of birth field
  photo: { type: String, required: true }, // Store path to user's photo
  cv: { type: String, required: true }, // Store path to user's CV
  isAdmin: { type: Boolean, required: false, default: false },
  isAdminApproved: { type: Boolean, required: false, default: false }, // Flag for admin approval
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = { User };
