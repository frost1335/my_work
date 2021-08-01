const { Router } = require("express");
const router = Router();
const House = require("../models/House");

router.get("/", async (req, res) => {
  const houses = await House.find();
  res.render("houses", {
    title: "Houses page",
    isHouses: true,
    houses,
  });
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
  const house = await House.findById(req.params.id);
  res.render("house-edit", {
    title: "Edit house",
    house,
  });
});

router.post("/remove", async (req, res) => {
  await House.findByIdAndRemove(req.body.id, req.body);
  res.redirect("/houses");
});

router.post("/edit", async (req, res) => {
  await House.findByIdAndUpdate(req.body.id, req.body);
  res.redirect("/houses");
});

module.exports = router;
