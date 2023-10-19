import { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import Root from "./App.js";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "./i18n.server.js";
import { StaticRouter } from "react-router-dom/server.js";

export async function render(request: Request) {
  const instance = await initI18n(request);

  return renderToString(
    <I18nextProvider i18n={instance}>
      <StaticRouter location={request.url}>
        <Root />
      </StaticRouter>
    </I18nextProvider>
  );
}
