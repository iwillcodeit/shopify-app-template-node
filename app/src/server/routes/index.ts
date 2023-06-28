import express from "express";
import morgan from "morgan";

import shopify from "../shopify";
import { getProducts } from "../controllers/products";

const router = express.Router();

router.use(morgan("combined"));

router.use(shopify.validateAuthenticatedSession());

router.use(express.json());

router.get("/products/count", getProducts);

export default router;
