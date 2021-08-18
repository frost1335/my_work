const { body } = require("express-validator");
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
  body("adress")
    .isLength({ min: 3 })
    .withMessage("Adress must be minimum 5 charters")
    .trim(),
  body("price").isNumeric().withMessage("Write the trust price !"),
  body("room").isNumeric().withMessage("Write the trust room !"),
  body("floor").isNumeric().withMessage("Write the trust floor !"),
  body("img_1", "Write the trust URL image !").isURL(),
];
