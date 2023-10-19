import { Request } from "express";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
// @ts-expect-error
import ShopifyFormat from "@shopify/i18next-shopify";
import { match } from "@formatjs/intl-localematcher";
import i18n, {
  DEFAULT_APP_LOCALE,
  Locale,
  SUPPORTED_APP_LOCALES,
  fetchPolarisTranslations,
  loadIntlPolyfills,
} from "./i18n.js";
import * as resources from "./locales/resources.js";

/**
 * Retrieves the user's locale from the `locale` request parameter and matches it to supported app locales.
 *
 * Returns the default app locale if the user locale is not supported.
 *
 * @see https://shopify.dev/docs/apps/best-practices/internationalization/getting-started#step-2-get-access-to-the-users-locale
 *
 * @returns User locale
 */
function getUserLocaleFromRequest(request: Request): Locale {
  const locale = request.params.locale || DEFAULT_APP_LOCALE;
  return match(
    [locale],
    SUPPORTED_APP_LOCALES as any,
    DEFAULT_APP_LOCALE
  ) as Locale;
}

/**
 * @async
 * Asynchronously initializes i18next and loads Polaris translations.
 *
 * Intended to be called before rendering the app to ensure translations are present.
 */
export async function initI18n(request: Request) {
  const locale = getUserLocaleFromRequest(request);
  // await loadIntlPolyfills(locale);
  // await fetchPolarisTranslations(locale);

  return initI18next(locale);
}

/**
 * @private
 * @async
 * Asynchronously initializes i18next.
 * @see https://www.i18next.com/overview/configuration-options
 * @returns Promise of initialized i18next instance
 */
async function initI18next(locale: Locale) {
  const instance = createInstance();

  await instance
    .use(initReactI18next)
    .use(ShopifyFormat)
    .init({
      ...i18n,
      lng: locale,
      resources: { ...resources },
    });

  return instance;
}
