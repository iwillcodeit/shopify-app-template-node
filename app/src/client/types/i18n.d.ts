// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import fr from "../locales/fr.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof fr;
    };
    // other
  }
}
