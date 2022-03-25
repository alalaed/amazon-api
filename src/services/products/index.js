import express from "express";
import createError from "http-errors";
import productModel from "./models.js";
import q2m from "query-to-mongo";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new productModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
    console.log(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await productModel.countDocuments(mongoQuery.criteria);
    const products = await productModel
      .find(mongoQuery.criteria, mongoQuery.options.fields)
      .sort(mongoQuery.options.sort) //Mongo will ALWAYS do SORT, SKIP, LIMIT no matter what!
      .skip(mongoQuery.options.skip, 0)
      .limit(mongoQuery.options.limit, 20)
      .populate({ path: "author" });
    res.send({
      links: mongoQuery.links(`http://localhost:3001/blogs`, total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      products,
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (product) {
      res.send(product);
    } else
      next(
        createError(404),
        `Product with the ID ${req.params.productId} is not found.`
      );
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) res.send(updatedProduct);
    else
      next(
        createError(404),
        `Product with the ID ${req.params.productId} is not found.`
      );
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/productId", async (req, res, next) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedProduct) res.status(204).send();
    else
      next(
        createError(404),
        `Product with the ID ${req.params.productId} is not found.`
      );
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
