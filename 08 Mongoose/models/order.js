const mongoose = require("mongoose");
const product = require("./product");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  //   items: [
  //     {
  //       productId: {
  //         type: Schema.Types.ObjectId,
  //         ref: "Product",
  //         required: true,
  //       },
  //       quantity: { type: Number, required: true },
  //     },
  //   ],
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
