const { Schema, model } = require("mongoose");

const house = new Schema({
  adress: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  room: {
    type: Number,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  img_1: {
    type: String,
  },
  img_2: {
    type: String,
  },
  img_3: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //   img_1: String,
  //   img_2: String,
  //   img_3: String,
});

module.exports = model("House", house);
