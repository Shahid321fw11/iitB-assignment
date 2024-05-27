const fs = require("fs");
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { uploads } = require("../middleware/upload.middleware");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// console.log("1");
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
// console.log("11");

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images (JPEG/PNG) and PDFs only!");
    }
  },
});

router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  uploads,
  async (req, res) => {
    const { username, email, password, dob, captcha, photo, cv } = req.body;
    // console.log("1111", username, email, password, dob, captcha);
    try {
      // const { error } = validate(req.body);
      // console.log("error", error);
      // if (error)
      //   return res.status(400).send({ message: error.details[0].message });

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
  }
);

module.exports = router;
