import Link from "next/link";
import type { BlogCategory, BlogPostSummary } from "@/lib/blog/types";
import { blogSiteConfig } from "@/lib/blog/config";
import { BlogPostList } from "@/components/blog-post-list";
import styles from "@/app/blog/blog.module.css";

export function BlogIndexView({
  posts,
  categories,
}: {
  posts: BlogPostSummary[];
  categories: BlogCategory[];
}) {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <header className={styles.header}>
          <h1 className={styles.title}>Reddy Dental Blog</h1>
          <p className={styles.subtitle}>
            Discover dental health articles, tips, and practice updates.
          </p>
        </header>

        <BlogPostList posts={posts} />

        {categories.length > 0 ? (
          <section className={styles.categories}>
            <h2 className={styles.categoriesTitle}>Categories</h2>
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
