import { ViteDevServer } from "vite";
import express, { Express } from "express";
import serveStatic from "serve-static";
import compression from "compression";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

import shopify from "./shopify.js";
import apiRouter from "./routes/index.js";
import webhookHandlers from "./webhooks.js";
import { readdir, readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolve = (p: string) => path.resolve(__dirname, p);
const join = (p: string) => path.join(__dirname, p);

async function getStyleSheets(clientPath: string) {
  try {
    const assetsPath = path.join(clientPath, "./assets");

    const files = await readdir(assetsPath);
    const cssAssets = files.filter((l) => l.endsWith(".css"));
    const allContent = [];
    for (const asset of cssAssets) {
      const content = await readFile(path.join(assetsPath, asset), "utf-8");
      allContent.push(`<style type="text/css">${content}</style>`);
    }
    return allContent.join("\n");
  } catch {
    return "";
  }
}

export default async function (
  app: Express,
  vite: ViteDevServer,
  config: { isProd?: boolean; isTest?: boolean }
) {
  const { isProd, isTest } = config;
  const assetsPath = isProd ? resolve("../client") : resolve("../public");

  app.use(vite.middlewares);

  if (isProd) {
    app.use(compression());
    app.use(
      serveStatic(assetsPath, {
        index: false,
      })
    );
  } else {
    app.use(express.static(assetsPath));
  }

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
  app.all("/api", (_req, res) => {
    res.status(404).json({
      message: "Endpoint not found.",
    });
  });

  app.use(shopify.cspHeaders());

  app.use(function (req, res, next) {
    if (req.path === "/") {
      shopify.ensureInstalledOnShop()(req, res, next);
    } else {
      next();
    }
  });

  const stylesheets = getStyleSheets(assetsPath);

  const baseTemplate = await readFile(
    isProd ? resolve("../client/index.html") : resolve("../index.html"),
    "utf-8"
  );
  const productionBuildPath = join("../server/entry.server.js");
  const devBuildPath = join("./app/entry.server.tsx");
  const buildModule = isProd ? productionBuildPath : devBuildPath;
  const { render } = await vite.ssrLoadModule(buildModule);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const template = await vite.transformIndexHtml(url, baseTemplate);

      const appHtml = await render(req);
      const cssAssets = await stylesheets;

      const html = template
        .replace(`<!--root-->`, appHtml)
        .replace(`<!--head-->`, cssAssets);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
