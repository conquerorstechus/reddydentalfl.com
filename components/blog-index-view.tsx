import Link from "next/link";
import { useTranslations } from "next-intl";
import type { BlogCategory, BlogPostSummary } from "@/lib/blog/types";
import { blogSiteConfig } from "@/lib/blog/config";
import { BlogPostList } from "@/components/blog-post-list";
import { BlogToolbar } from "@/components/blog-toolbar";
import styles from "@/app/blog/blog.module.css";

export function BlogIndexView({
  posts,
  categories,
}: {
  posts: BlogPostSummary[];
  categories: BlogCategory[];
}) {
  const t = useTranslations("blog");

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <BlogToolbar href="/" labelKey="backToHome" />
        <header className={styles.header}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </header>

        <BlogPostList posts={posts} />

        {categories.length > 0 ? (
          <section className={styles.categories}>
            <h2 className={styles.categoriesTitle}>{t("categories")}</h2>
            <ul className={styles.categoryList}>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`${blogSiteConfig.blogPrefix}/${blogSiteConfig.categoryPrefix}/${category.slug}/`}
                    className={styles.categoryLink}
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
