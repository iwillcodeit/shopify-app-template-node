import { useTranslation } from "react-i18next";

import Routes, { Pages } from "./Routes";

import { PolarisProvider } from "./context/PolarisProvider";
import { AppBridgeProvider } from "./context/AppBridgeProvider";
import { QueryProvider } from "./context/QueryProvider";
import { NavigationMenu } from "@shopify/app-bridge-react";
import { BrowserRouter } from "react-router-dom";

export function App() {
  const { t } = useTranslation();

  const pagesContext = require.context(
    "./pages",
    true,
    /^\.\/.*\/(?!.*\.test\.[jt]sx).*\.([jt]sx)$/
  );

  const pages = pagesContext.keys().reduce((acc, key) => {
    acc[key] = pagesContext(key);
    return acc;
  }, {});

  return (
    <BrowserRouter>
      <PolarisProvider>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: t("NavigationMenu.pageName"),
                  destination: "/pagename",
                },
                {
                  label: "RSC",
                  destination: "/server",
                },
              ]}
            />
            <Routes pages={pages as Pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </PolarisProvider>
    </BrowserRouter>
  );
}

export default App;
