import { defineRouting } from "next-intl/routing";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "never",
  localeDetection: false,
  localeCookie: {
    name: LOCALE_COOKIE,
  },
});

export type AppLocale = (typeof routing.locales)[number];

export function isAppLocale(value: string | undefined): value is AppLocale {
  return value === "en" || value === "es";
}
