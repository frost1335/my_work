const { Router } = require("express");
const House = require("../models/House");
const router = Router();
const auth = require('../middleware/auth')

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "Add page",
    isAdd: true,
  });
});

router.post("/add", auth, async (req, res) => {
  const house = new House({
    adress: req.body.adress,
    price: req.body.price,
    room: req.body.room,
    floor: req.body.floor,
    img_1: req.body.img_1,
    img_2: req.body.img_2,
    img_3: req.body.img_3,
  });
  try {
    await house.save();
    res.redirect("/houses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
