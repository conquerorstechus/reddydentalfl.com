import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { isAppLocale, LOCALE_COOKIE, routing } from "./routing";

export default getRequestConfig(async () => {
  const store = await cookies();
  const requested = store.get(LOCALE_COOKIE)?.value;
  const locale = isAppLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
