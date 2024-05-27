const fs = require("fs");
const router = require("express").Router();
const { User } = require("../models/user");
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

// Get user by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Update user by ID check this later,

router.put(
  "/:id",
  // upload.fields([
  //   { name: "photo", maxCount: 1 },
  //   { name: "cv", maxCount: 1 },
  // ]),
  // uploads,
  async (req, res) => {
    try {
      // const { isAdminApproved } = req.body;
      const { username, email } = req.body;
      const updateData = { username, email };

      // if (password) {
      //   const salt = await bcrypt.genSalt(Number(process.env.SALT));
      //   updateData.password = await bcrypt.hash(password, salt);
      // }

      // if (req.files.photo) {
      //   updateData.photo = {
      //     data: fs.readFileSync(
      //       path.join(__dirname, "../uploads/" + req.files.photo[0].filename)
      //     ),
      //     contentType: req.files.photo[0].mimetype,
      //   };
      // }

      // if (req.files.cv) {
      //   updateData.cv = {
      //     data: fs.readFileSync(
      //       path.join(__dirname, "../uploads/" + req.files.cv[0].filename)
      //     ),
      //     contentType: req.files.cv[0].mimetype,
      //   };
      // }

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      if (username) user.username = username;
      if (email) user.email = email;

      // Save the updated user data
      await user.save();

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
// router.put(
//   "/:id",
//   upload.fields([
//     { name: "photo", maxCount: 1 },
//     { name: "cv", maxCount: 1 },
//   ]),
//   uploads,
//   async (req, res) => {
//     try {
//       const { isAdminApproved } = req.body;
//       const { username, email, password, dob, captcha } = req.body;
//       const updateData = { username, email, dob, captcha, isAdminApproved };

//       if (password) {
//         const salt = await bcrypt.genSalt(Number(process.env.SALT));
//         updateData.password = await bcrypt.hash(password, salt);
//       }

//       if (req.files.photo) {
//         updateData.photo = {
//           data: fs.readFileSync(
//             path.join(__dirname, "../uploads/" + req.files.photo[0].filename)
//           ),
//           contentType: req.files.photo[0].mimetype,
//         };
//       }

//       if (req.files.cv) {
//         updateData.cv = {
//           data: fs.readFileSync(
//             path.join(__dirname, "../uploads/" + req.files.cv[0].filename)
//           ),
//           contentType: req.files.cv[0].mimetype,
//         };
//       }

//       const user = await User.findByIdAndUpdate(req.params.id, updateData, {
//         new: true,
//         runValidators: true,
//       });
//       if (!user) return res.status(404).json({ message: "User not found" });

//       res.json(user);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// );
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
