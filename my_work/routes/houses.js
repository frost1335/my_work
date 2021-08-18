const { Router } = require("express");
const router = Router();
const House = require("../models/House");
const { validationResult } = require("express-validator");

const { houseValidators } = require("../utils/validators");

function isOwner(house, req) {
  return house.userId.toString() == req.user._id.toString();
}

router.get("/", async (req, res) => {
  try {
    const houses = await House.find()
      .populate("userId", "email name")
      .select("price adress img_1 img_2 img_3 room floor");
    res.render("houses", {
      title: "Houses page",
      isHouses: true,
      userId: req.user ? req.user._id.toString() : null,
      houses,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  const house = await House.findById(req.params.id);
  res.render("house", {
    layout: "empty",
    title: "House page",
    house,
  });
});

router.get("/:id/edit", async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!isOwner(house, req)) {
      return res.redirect("/houses");
    }
    res.render("house-edit", {
      title: "Edit house",
      house,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", async (req, res) => {
  await House.findByIdAndRemove(req.body.id, req.body);
  res.redirect("/houses");
});

router.post("/edit", houseValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/houses/${req.body.id}/edit`);
  }
  try {
    const house = await House.findById(req.body.id);
    if (!isOwner(house, req)) {
      return res.redirect("/houses");
    }
    Object.assign(house, req.body);
    await house.save();
    res.redirect("/houses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
