import i18next from "i18next";
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
  localResourcesToBackend,
} from "./i18n.js";

let _userLocale: Locale;

/**
 * Retrieves the user's locale from the `locale` request parameter and matches it to supported app locales.
 *
 * Returns the default app locale if the user locale is not supported.
 *
 * @see https://shopify.dev/docs/apps/best-practices/internationalization/getting-started#step-2-get-access-to-the-users-locale
 *
 * @returns User locale
 */
function getUserLocale(): Locale {
  if (_userLocale) {
    return _userLocale;
  }
  const url = new URL(window.location.href);
  const locale = url.searchParams.get("locale") || DEFAULT_APP_LOCALE;
  _userLocale = match(
    [locale],
    SUPPORTED_APP_LOCALES as any,
    DEFAULT_APP_LOCALE
  ) as Locale;
  return _userLocale;
}

/**
 * @async
 * Asynchronously initializes i18next and loads Polaris translations.
 *
 * Intended to be called before rendering the app to ensure translations are present.
 */
export async function initI18n() {
  const locale = getUserLocale();
  await loadIntlPolyfills(locale);
  await Promise.all([initI18next(locale), fetchPolarisTranslations(locale)]);
}

/**
 * @private
 * @async
 * Asynchronously initializes i18next.
 * @see https://www.i18next.com/overview/configuration-options
 * @returns Promise of initialized i18next instance
 */
async function initI18next(locale: Locale) {
  return await i18next
    .use(initReactI18next)
    .use(ShopifyFormat)
    .use(localResourcesToBackend())
    .init({
      ...i18n,
      lng: locale,
    });
}
