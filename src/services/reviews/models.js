import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: String, min: 0, max: 5, required: true },
    product: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

export default model("Review", reviewSchema);
