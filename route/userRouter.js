const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { register, login } = require("../controller/userController");
const User = require("../model/user");
router.post(
  "/register",
  body("email")
    .notEmpty()
    .isEmail()
    .custom((value) => {
      return User.findOne({
        attributes: ["email"],
        where: { email: value },
      }).then((user) => {
        if (user) {
          return Promise.reject("Email Sudah Terpakai");
        }
      });
    }),
  body("password").notEmpty().isLength({ min: 5 }),
  body("nama").notEmpty().isLength({ max: 64 }),
  register
);
router.post(
  "/login",
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isLength({ min: 5 }),
  login
);
module.exports = router;
