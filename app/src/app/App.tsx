import { useTranslation } from "react-i18next";

import Routes, { Pages } from "./Routes.js";

import { PolarisProvider } from "./context/PolarisProvider.js";
import { AppBridgeProvider } from "./context/AppBridgeProvider.js";
import { QueryProvider } from "./context/QueryProvider.js";
import React, { PropsWithChildren } from "react";
import { NavigationMenu } from "./AppBridge.js";

export function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });

  return (
    <PolarisProvider>
      <ClientAppBridge>
        <QueryProvider>
          <Routes pages={pages as Pages} />
        </QueryProvider>
      </ClientAppBridge>
    </PolarisProvider>
  );
}

function ClientAppBridge({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  if (import.meta.env.SSR) {
    return <>{children}</>;
  } else {
    return (
      <AppBridgeProvider>
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
        {children}
      </AppBridgeProvider>
    );
  }
}

export default App;
