const { body } = require("express-validator/check");
const User = require("../models/User");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Write the trust email adress !")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("email is already avaible !");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Password must be minimum 6 charters !")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name is must be minimum 3 charters !")
    .trim(),
];


exports.houseValidators = [
    body 
]