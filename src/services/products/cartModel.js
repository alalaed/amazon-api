import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CartSchema = new Schema(
  {
    // ownerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        _id: false,
      },
    ],
    status: { type: String, required: true, enum: ["active", "paid"] },
  },
  { timestamps: true }
);

export default model("Cart", CartSchema);
