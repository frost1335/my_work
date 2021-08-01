const { Router } = require("express");
const Order = require("../models/Order");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );
    res.render("orders", {
      title: "Orders",
      isOrder: true,
      orders: orders.map((o) => {
        return {
          ...o._doc,
          price: o.houses.reduce((total, c) => {
            return (total += c.count * c.house.price);
          }, 0),
        };
      }),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.houseId").execPopulate();

    const houses = user.cart.items.map((c) => ({
      count: c.count,
      house: {
        ...c.houseId._doc,
      },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      houses: houses,
    });
    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
