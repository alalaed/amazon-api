import express from "express";
import createError from "http-errors";
import productModel from "../products/models.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (product) {
      const review = req.body;
      const newReview = {
        ...review,
        reviewDate: new Date(),
      };
      const modifiedProduct = await productModel.findByIdAndDelete(
        req.params.productId,
        { $push: { reviews: newReview } },
        { new: true }
      );
      if (modifiedProduct) res.send(modifiedProduct);
      else {
        next(
          createError(
            404,
            `Product with id ${req.body.productId} has no comments!`
          )
        );
      }
    } else {
      next(
        createError(
          404,
          `Product with id ${req.body.productId} has no reviews!`
        )
      );
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (product) res.send(product.reviews);
    else {
      next(
        createError(404, `Product with id ${req.body.bookId} has no reviews!`)
      );
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

reviewsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (product) {
      const oneReview = review.reviews.find(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (oneReview) {
        res.send(oneReview);
      } else {
        next(
          createError(404, `Review with id ${req.body.reviewId} is not found`)
        );
      }
    } else {
      next(
        createError(404, `Product with id ${req.body.productId} is not found`)
      );
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

reviewsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (product) {
      const index = product.reviews.findIndex(
        (review) => review._id.toString() === req.params.reviewId
      );

      if (index !== -1) {
        product.reviews[index] = {
          ...product.reviews[index].toObject(),
          ...req.body,
        };
        await product.save();

        res.send(product);
      } else {
        createError(404, `review with id ${req.body.reviewId} is not found`);
      }
    } else {
      next(
        createError(404, `Product with id ${req.body.productId} is not found`)
      );
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

reviewsRouter.delete("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.productId,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );
    if (product) {
      res.send(product);
    } else {
      next(createError(404, `Product with id ${req.body.bookId} is not found`));
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
});

export default reviewsRouter;
