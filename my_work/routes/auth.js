const { Router } = require("express");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");
const crypto = require("crypto");
const router = Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { registerValidators } = require("../utils/validators");

router.get("/", async (req, res) => {
  res.render("auth/login", {
    title: "Authentication",
    isLogin: true,
    errorLogin: req.flash("errorLogin"),
    errorRegister: req.flash("errorRegister"),
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({
      email,
    });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("errorLogin", "invalid password");
        res.redirect("/auth#login");
      }
    } else {
      req.flash("errorLogin", "this email is not defind");
      res.redirect("/auth#login");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errorRegister", errors.array()[0].msg);
      return res.status(422).redirect("/auth#register");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: {
        items: [],
      },
    });
    await user.save();
    res.redirect("/auth#login");
    // transporter.sendMail();
  } catch (e) {
    console.log(e);
  }
});

router.get("/reset", (req, res) => {
  res.render("auth/reset", {
    title: "Forgot password",
    error: req.flash("error"),
  });
});

router.post("reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "something went wrong please try again !");
        return res.redirect("/auth/reset");
      }
      const token = buffer.toString("hex");

      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
      } else {
        req.flash("error", "this email is not defined !");
        res.redirect("auth/reset");
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
