const fs = require("fs").promises;

const uploads = async (req, res, next) => {
  try {
    if (req.fileValidationError) {
      return res
        .status(400)
        .json({ ok: false, message: req.fileValidationError });
    }

    if (req.files && req.files["photo"]) {
      const photoData = req.files["photo"][0];
      const photoBuffer = await fs.readFile(photoData.path);
      const photoMimetype = photoData.mimetype; // Corrected property name
      req.body.photo = {
        data: photoBuffer,
        contentType: photoMimetype,
      };
      await fs.unlink(photoData.path);
    }

    if (req.files && req.files["cv"]) {
      const cvData = req.files["cv"][0];
      const cvBuffer = await fs.readFile(cvData.path);
      const cvMimetype = cvData.mimetype; // Corrected property name
      req.body.cv = {
        data: cvBuffer,
        contentType: cvMimetype,
      };
      await fs.unlink(cvData.path);
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server Error" });
  }
};

module.exports = { uploads };
