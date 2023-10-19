import { Request, Response } from "express";
import shopify from "../shopify.js";

export const getProducts = async (_req: Request, res: Response) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
};
