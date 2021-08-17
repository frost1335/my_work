const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        houseId: {
          type: Schema.Types.ObjectId,
          ref: "House",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (house) {
  const items = [...this.cart.items];
  const idx = items.findIndex((c) => {
    return c.houseId.toString() === house._id.toString();
  });
  if (idx >= 0) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      houseId: house._id,
      count: 1,
    });
  }

  this.cart = { items };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = {
    items: [],
  };
  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const idx = items.findIndex((c) => c.houseId.toString() === id.toString());

  if (items[idx].count === 1) {
    items = items.filter((c) => c.houseId.toString() !== id.toString());
  } else {
    items[idx].count--;
  }
  this.cart = {
    items,
  };
  return this.save();
};

module.exports = model("User", userSchema);
