const router = require("express").Router();
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
router.post("/register", async (req, resp, next) => {
  if (req.body.password !== req.body.confirmPass) {
    resp.status(403).json("Confirm Password & Password does not match");
  } else {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS
      ).toString(),
    });
    try {
      const savedUser = await newUser.save();
      resp.status(200).json(savedUser);
    } catch (err) {
      console.log(err);
      resp.status(500).json(err);
    }
  }
});

router.post("/login", async (req, resp) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && resp.status(500).json("Wrong Credentials");
    const originalpass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS
    ).toString(CryptoJS.enc.Utf8);
    const inputpass = req.body.password;
    originalpass !== inputpass && resp.status(500).json("Wrond Credentials");

    const accesstoken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_PASS,
      { expiresIn: "3d" }
    );
    const { password, ...others } = user._doc;
    resp.status(200).json({ ...others, accesstoken });
  } catch (err) {
    resp.status(500).json(err);
  }
});
module.exports = router;
