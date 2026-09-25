import Link from "next/link";
import type { BlogCategoryView } from "@/lib/blog/types";
import { blogSiteConfig } from "@/lib/blog/config";
import { BlogPostList } from "@/components/blog-post-list";
import styles from "@/app/blog/blog.module.css";

export function BlogCategoryView({ category }: { category: BlogCategoryView }) {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href={blogSiteConfig.blogPrefix} className={styles.backLink}>
          ← Back to Blog
        </Link>
        <header className={styles.header}>
          <h1 className={styles.title}>{category.name}</h1>
          {category.description ? (
            <p className={styles.subtitle}>{category.description}</p>
          ) : null}
        </header>
        <BlogPostList posts={category.posts} />
      </div>
    </main>
  );
}
