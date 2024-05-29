const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).send({ message: "Invalid Username or Password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password" });

    if (!user.isAdminApproved)
      return res.status(403).send({ message: "User not approved by admin" });

    const userData = {
      userId: user._id,
      isAdmin: user.isAdmin,
      username: user.username,
      email: user.email,
      dob: user.dob,
      password: password,
      photo: user.photo,
      cv: user.cv,
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

module.exports = router;
