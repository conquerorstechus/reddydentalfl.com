import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/language-toggle";
import styles from "@/app/blog/blog.module.css";

export function BlogToolbar({
  href,
  labelKey,
}: {
  href: string;
  labelKey: "backToHome" | "backToBlog" | "backToAuthors";
}) {
  const t = useTranslations("blog");

  return (
    <div className={styles.toolbar}>
      <a href={href} className={styles.backLink}>
        {t(labelKey)}
      </a>
      <LanguageToggle />
    </div>
  );
}
