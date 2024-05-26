const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  dob: { type: Date, required: true }, // Adding date of birth field
  photo: { type: String, required: true }, // Store path to user's photo
  cv: { type: String, required: true }, // Store path to user's CV
  isAdminApproved: { type: Boolean, default: false }, // Flag for admin approval
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
    password: passwordComplexity().required().label("Password"),
    dob: Joi.date().required().label("Date of Birth"),
    photo: Joi.string().required().label("Photo"),
    cv: Joi.string().required().label("CV"),
    email: Joi.string().email().label("Email").allow("", null), // Allowing empty or null value
  });
  return schema.validate(data);
};

module.exports = { User, validate };
