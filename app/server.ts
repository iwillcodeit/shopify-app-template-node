import { createServer as createViteServer } from "vite";
import initApp from "./src/app.js";
import express from "express";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

async function createServer(isProd = process.env.NODE_ENV === "production") {
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: isTest ? "error" : "info",
    root: isProd ? "dist" : "",
    optimizeDeps: { include: [] },
  });

  const app = express();
  await initApp(app, vite, {
    isProd,
    isTest,
  });

  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
}

createServer().catch((err) => {
  console.error(err);
  // process.exit(1);
});
