"use client";

import { useLocale } from "next-intl";
import { LOCALE_COOKIE, type AppLocale } from "@/i18n/routing";
import styles from "./language-toggle.module.css";

type LanguageToggleProps = {
  appearance?: "plain" | "pill";
};

export function LanguageToggle({ appearance = "plain" }: LanguageToggleProps) {
  const locale = useLocale();

  function select(next: AppLocale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div
      className={appearance === "pill" ? styles.pill : styles.plain}
      role="group"
      aria-label={locale === "es" ? "Idioma" : "Language"}
    >
      <button type="button" aria-pressed={locale === "en"} onClick={() => select("en")}>
        EN
      </button>
      <span aria-hidden="true">|</span>
      <button type="button" aria-pressed={locale === "es"} onClick={() => select("es")}>
        ES
      </button>
    </div>
  );
}
