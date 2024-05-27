const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// const validate = (data) => {
//   const schema = Joi.object({
//     username: Joi.string().required().label("Username"),
//     password: Joi.string().required().label("Password"),
//     captcha: Joi.string().required().label("Captcha"),
//   });
//   return schema.validate(data);
// };

router.post("/", async (req, res) => {
  const { username, password, captcha } = req.body;
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).send({ message: "Invalid Username or Password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password" });

    if (!user.isAdminApproved)
      return res.status(403).send({ message: "User not approved by admin" });

    const photoBase64 = user.photo.data.toString("base64");
    const photo = {
      data: photoBase64,
      contentType: user.photo.contentType,
    };
    const cvBase64 = user.cv.data.toString("base64");
    const cv = {
      data: cvBase64,
      contentType: user.cv.contentType,
    };
    const userData = {
      userId: user._id,
      isAdmin: user.isAdmin,
      username: user.username,
      email: user.email,
      dob: user.dob,
      photo: photo,
      cv: cv,
    };

    const token = user.generateAuthToken();
    res.status(200).send({
      data: token,
      userData: userData,
      message: "logged in successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// const validate = (data) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required().label("Email"),
//     password: Joi.string().required().label("Password"),
//   });
//   return schema.validate(data);
// };

module.exports = router;
