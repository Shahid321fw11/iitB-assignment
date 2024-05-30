const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { username, email, password, dob, captcha, photo, cv } = req.body;
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given username already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPassword,
      captcha: captcha,
      dob: dob,
      photo: photo,
      cv: cv,
    });

    await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.log("err", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all non-admin users
router.get("/", async (req, res) => {
  try {
    // Find users where isAdmin is false
    const users = await User.find({ isAdmin: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { username, email, cv, photo, dob } = req.body;
    const updateData = { username, email };

    console.log("backend", req.body);

    // Check if CV, photo, and DOB are provided and update the updateData object accordingly
    if (cv) updateData.cv = cv;
    if (photo) updateData.photo = photo;
    if (dob) updateData.dob = dob;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // If username, email, and DOB are provided in the request body, update them
    if (username) user.username = username;
    if (email) user.email = email;
    if (dob) user.dob = dob;

    // Save the updated user data
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define route for handling user approval
router.put("/approve/:id", async (req, res) => {
  try {
    // Extract user ID and isAdminApproved flag from request body
    const { id } = req.params;
    const { isAdminApproved } = req.body;

    // Find user by ID and update isAdminApproved field
    const user = await User.findByIdAndUpdate(
      id,
      { isAdminApproved },
      { new: true }
    );

    // Check if user is found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send updated user object in response
    res.json(user);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
