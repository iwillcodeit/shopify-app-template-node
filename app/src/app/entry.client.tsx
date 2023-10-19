import React, { startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.js";
import { initI18n } from "./i18n.client.js";

async function hydrate() {
  await initI18n();

  startTransition(() => {
    const container = document.getElementById("root");

    const app = (
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );

    if (import.meta.hot || !container?.innerText) {
      const root = createRoot(container!);
      root.render(app);
    } else {
      hydrateRoot(container!, app);
    }
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
