import ViteExpress from "vite-express";
import express from "express";
import shopify from "./shopify";
import apiRouter from "./routes";
import webhookHandlers from "./webhooks";

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers })
);

app.use("/api", apiRouter);

app.use(shopify.cspHeaders());

app.use(function (req, res, next) {
  if (req.path === "/") {
    shopify.ensureInstalledOnShop()(req, res, next);
  } else {
    next();
  }
});

app.use(ViteExpress.static());

export default app;
