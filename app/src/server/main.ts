import ViteExpress from "vite-express";

import app from "./app";

const PORT = parseInt(process.env.PORT || "3000", 10);

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port ${PORT}...`)
);
