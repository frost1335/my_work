const { Router } = require("express");
const router = Router();
const House = require("../models/House");
const User = require("../models/User");
const auth = require('../middleware/auth')

function mapCartItems(cart) {
  return cart.items.map((c) => ({
    ...c.houseId._doc,
    id: c.houseId.id,
    count: c.count,
    tPrice: c.houseId.price * c.count,
  }));
}

function computePrice(houses) {
  return houses.reduce((total, house) => {
    return (total += house.price * house.count);
  }, 0);
}

router.get("/", auth, async (req, res) => {
  const user = await req.user.populate("cart.items.houseId").execPopulate();
  const houses = mapCartItems(user.cart);
  res.render("card", {
    title: "Card page",
    isCard: true,
    houses: houses,
    price: computePrice(houses),
  });
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user.populate("cart.items.houseId").execPopulate();
  const houses = mapCartItems(user.cart);
  const cart = {
    price: computePrice(houses),
    houses,
  };

  res.status(200).json(cart);
});

router.post("/add", auth, async (req, res) => {
  const house = await House.findById(req.body.id);
  await req.user.addToCart(house);
  res.redirect("/card");
});

module.exports = router;
