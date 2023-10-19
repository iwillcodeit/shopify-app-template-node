import i18next from "i18next";
import { initReactI18next } from "react-i18next";
// @ts-expect-error
import ShopifyFormat from "@shopify/i18next-shopify";
import resourcesToBackend from "i18next-resources-to-backend";
import { match } from "@formatjs/intl-localematcher";
// @ts-ignore
import { shouldPolyfill as shouldPolyfillLocale } from "@formatjs/intl-locale/should-polyfill";
// @ts-ignore
import { shouldPolyfill as shouldPolyfillPluralRules } from "@formatjs/intl-pluralrules/should-polyfill";
import {
  DEFAULT_LOCALE as DEFAULT_POLARIS_LOCALE,
  SUPPORTED_LOCALES as SUPPORTED_POLARIS_LOCALES,
} from "@shopify/polaris";

let _polarisTranslations: any;

/**
 * The default locale for the app.
 */
export const DEFAULT_APP_LOCALE = "fr";

/**
 * The supported locales for the app.
 *
 * These should correspond with the JSON files in the `locales` folder.
 *
 * @example
 *   en.json
 *   fr.json
 * @see Available Shopify Admin languages in the Shopify Help Center:
 * https://help.shopify.com/en/manual/your-account/languages#available-languages
 */
export const SUPPORTED_APP_LOCALES = ["en", "fr"] as const;
export type Locale = (typeof SUPPORTED_APP_LOCALES)[number];

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
 * @private
 * @async
 * Asynchronously loads Intl polyfills for the default locale and user locale.
 */
export async function loadIntlPolyfills(locale: Locale) {
  if (shouldPolyfillLocale()) {
    // @ts-ignore
    await import("@formatjs/intl-locale/polyfill");
  }
  const promises = [];
  if (shouldPolyfillPluralRules(DEFAULT_APP_LOCALE)) {
    // @ts-ignore
    await import("@formatjs/intl-pluralrules/polyfill-force");
    promises.push(loadIntlPluralRulesLocaleData(DEFAULT_APP_LOCALE));
  }
  if (DEFAULT_APP_LOCALE !== locale && shouldPolyfillPluralRules(locale)) {
    promises.push(loadIntlPluralRulesLocaleData(locale));
  }
  await Promise.all(promises);
}

/**
 * A subset of the available plural rules locales
 *  that match available Shopify Admin languages
 * @see Available Shopify Admin languages in the Shopify Help Center:
 * https://help.shopify.com/en/manual/your-account/languages#available-languages
 */
const PLURAL_RULES_LOCALE_DATA = {
  // @ts-ignore
  cs: () => import("@formatjs/intl-pluralrules/locale-data/cs"),
  // @ts-ignore
  da: () => import("@formatjs/intl-pluralrules/locale-data/da"),
  // @ts-ignore
  de: () => import("@formatjs/intl-pluralrules/locale-data/de"),
  // @ts-ignore
  en: () => import("@formatjs/intl-pluralrules/locale-data/en"),
  // @ts-ignore
  es: () => import("@formatjs/intl-pluralrules/locale-data/es"),
  // @ts-ignore
  fi: () => import("@formatjs/intl-pluralrules/locale-data/fi"),
  // @ts-ignore
  fr: () => import("@formatjs/intl-pluralrules/locale-data/fr"),
  // @ts-ignore
  it: () => import("@formatjs/intl-pluralrules/locale-data/it"),
  // @ts-ignore
  ja: () => import("@formatjs/intl-pluralrules/locale-data/ja"),
  // @ts-ignore
  ko: () => import("@formatjs/intl-pluralrules/locale-data/ko"),
  // @ts-ignore
  nb: () => import("@formatjs/intl-pluralrules/locale-data/nb"),
  // @ts-ignore
  nl: () => import("@formatjs/intl-pluralrules/locale-data/nl"),
  // @ts-ignore
  pl: () => import("@formatjs/intl-pluralrules/locale-data/pl"),
  // @ts-ignore
  pt: () => import("@formatjs/intl-pluralrules/locale-data/pt"),
  // @ts-ignore
  "pt-PT": () => import("@formatjs/intl-pluralrules/locale-data/pt-PT"),
  // @ts-ignore
  sv: () => import("@formatjs/intl-pluralrules/locale-data/sv"),
  // @ts-ignore
  th: () => import("@formatjs/intl-pluralrules/locale-data/th"),
  // @ts-ignore
  tr: () => import("@formatjs/intl-pluralrules/locale-data/tr"),
  // @ts-ignore
  vi: () => import("@formatjs/intl-pluralrules/locale-data/vi"),
  // @ts-ignore
  zh: () => import("@formatjs/intl-pluralrules/locale-data/zh"),
};

type PolarisPluralLocale = keyof typeof PLURAL_RULES_LOCALE_DATA;

async function loadIntlPluralRulesLocaleData(locale: PolarisPluralLocale) {
  return (await PLURAL_RULES_LOCALE_DATA[locale]()).default;
}

export function localResourcesToBackend() {
  return resourcesToBackend(async (locale: any, _namespace: any) => {
    return (await import(`./locales/${locale}.json`)).default;
  });
}

/**
 * Returns Polaris translations that correspond to the user locale.
 *
 * Returns Polaris translations for the default locale if the user locale is not supported.
 *
 * @see https://polaris.shopify.com/components/utilities/app-provider#using-translations
 *
 * @returns Polaris translations
 */
export function getPolarisTranslations() {
  return _polarisTranslations;
}

/**
 * @private
 * @async
 * Asynchronously loads Polaris translations that correspond to the user locale.
 *
 * Loads Polaris translations for the default locale if the user locale is not supported.
 * @returns Promise of Polaris translations
 */
export async function fetchPolarisTranslations(locale: Locale): Promise<any> {
  if (_polarisTranslations) {
    return _polarisTranslations;
  }
  // Get the closest matching default locale supported by Polaris
  const defaultPolarisLocale = match(
    [DEFAULT_APP_LOCALE],
    SUPPORTED_POLARIS_LOCALES,
    DEFAULT_POLARIS_LOCALE
  );
  // Get the closest matching user locale supported by Polaris
  const polarisLocale = match(
    [locale],
    SUPPORTED_POLARIS_LOCALES,
    defaultPolarisLocale
  ) as PolarisLocale;
  _polarisTranslations = await loadPolarisTranslations(polarisLocale);
  return _polarisTranslations;
}

/**
 * Polaris imports are declared explicitly because
 * dynamic imports with variables are only supported
 * for files with relative paths, not packages.
 * @see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
 */
const POLARIS_LOCALE_DATA = {
  cs: () => import("@shopify/polaris/locales/cs.json"),
  da: () => import("@shopify/polaris/locales/da.json"),
  de: () => import("@shopify/polaris/locales/de.json"),
  en: () => import("@shopify/polaris/locales/en.json"),
  es: () => import("@shopify/polaris/locales/es.json"),
  fi: () => import("@shopify/polaris/locales/fi.json"),
  fr: () => import("@shopify/polaris/locales/fr.json"),
  it: () => import("@shopify/polaris/locales/it.json"),
  ja: () => import("@shopify/polaris/locales/ja.json"),
  ko: () => import("@shopify/polaris/locales/ko.json"),
  nb: () => import("@shopify/polaris/locales/nb.json"),
  nl: () => import("@shopify/polaris/locales/nl.json"),
  pl: () => import("@shopify/polaris/locales/pl.json"),
  "pt-BR": () => import("@shopify/polaris/locales/pt-BR.json"),
  "pt-PT": () => import("@shopify/polaris/locales/pt-PT.json"),
  sv: () => import("@shopify/polaris/locales/sv.json"),
  th: () => import("@shopify/polaris/locales/th.json"),
  tr: () => import("@shopify/polaris/locales/tr.json"),
  vi: () => import("@shopify/polaris/locales/vi.json"),
  "zh-CN": () => import("@shopify/polaris/locales/zh-CN.json"),
  "zh-TW": () => import("@shopify/polaris/locales/zh-TW.json"),
} as const;

type PolarisLocale = keyof typeof POLARIS_LOCALE_DATA;

async function loadPolarisTranslations(locale: PolarisLocale) {
  return (await POLARIS_LOCALE_DATA[locale]()).default;
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
  // @ts-ignore
  return await i18next
    .use(initReactI18next)
    .use(ShopifyFormat)
    .use(localResourcesToBackend())
    .init({
      // @ts-ignore
      debug: process?.env?.NODE_ENV === "development",
      // debug: process.env.NODE_ENV === "development",
      fallbackLng: DEFAULT_APP_LOCALE,
      supportedLngs: SUPPORTED_APP_LOCALES,
      interpolation: {
        // React escapes values by default
        escapeValue: false,
      },
      react: {
        // Wait for the locales to be loaded before rendering the app
        // instead of using a Suspense component
        useSuspense: false,
      },
      lng: locale,
    });
}
