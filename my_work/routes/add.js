const { Router } = require("express");
const House = require("../models/House");
const router = Router();
const { validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { houseValidators } = require("../utils/validators");

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "Add page",
    isAdd: true,
  });
});

router.post("/add", auth, houseValidators, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("add", {
      title: "Add house",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        adress: req.body.adress,
        price: req.body.price,
        room: req.body.room,
        floor: req.body.floor,
        img_1: req.body.img_1,
        img_2: req.body.img_2,
        img_3: req.body.img_3,
      },
    });
  }

  const house = new House({
    adress: req.body.adress,
    price: req.body.price,
    room: req.body.room,
    floor: req.body.floor,
    img_1: req.body.img_1,
    img_2: req.body.img_2,
    img_3: req.body.img_3,
    userId: req.user,
  });
  try {
    await house.save();
    res.redirect("/houses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
