import type { BlogCategoryView } from "@/lib/blog/types";
import { blogSiteConfig } from "@/lib/blog/config";
import { BlogPostList } from "@/components/blog-post-list";
import { BlogToolbar } from "@/components/blog-toolbar";
import styles from "@/app/blog/blog.module.css";

export function BlogCategoryView({ category }: { category: BlogCategoryView }) {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <BlogToolbar href={blogSiteConfig.blogPrefix} labelKey="backToBlog" />
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
