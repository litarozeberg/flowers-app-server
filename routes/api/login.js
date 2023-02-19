const express = require("express");
const router = express.Router();

const multer = require("../../config/multerTypes");
const upload = multer.createMulter(
  "../toysland-client/public/uploads/",
  3000000,
  multer.allowedTypes.img
);

const loginValidation = require("../../validation/login.validation");
const usersModel = require("../../models/Users.model");
const auth = require('../../middlewares/auth');
const bcrypt = require("../../config/bcrypt");
const jwt = require("../../config/jwt");

router.post("/", async (req, res) => {
  try {
    const validatedValue = await loginValidation(req.body);
    const user = await usersModel.findUserByEmail(validatedValue.email);
    if (!user) {
      throw "Invalid email and/or password";
    }

    if (!user.isMailValid) {
      throw "Please validate the email first";
    }
    
    const hashResult = await bcrypt.cmpHash(
      validatedValue.password,
      user.password
    );

    if (!hashResult) {
      throw "Invalid email and/or password";
    }

    const token = await jwt.generateToken(
      {
        _id: user._id,
        email: user.email,
        img: user.img,
        isAdmin: user.isAdmin
      },
      process.env.JWT_KEY,
      { expiresIn: "4h" }
    );

    res.json({ token });
    
  } catch (err) {
    res.status(400).send(err); 
  }
});

module.exports = router;
