import Link from "next/link";
import type { BlogAuthor, BlogAuthorView } from "@/lib/blog/types";
import { blogSiteConfig } from "@/lib/blog/config";
import { BlogPostList } from "@/components/blog-post-list";
import styles from "@/app/blog/blog.module.css";

export function BlogAuthorView({ author }: { author: BlogAuthorView }) {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href={`${blogSiteConfig.blogPrefix}/${blogSiteConfig.authorPrefix}/`} className={styles.backLink}>
          ← Back to Authors
        </Link>
        <header className={styles.header}>
          {author.image ? (
            <img
              src={author.image}
              alt={author.name}
              className={styles.authorImage}
            />
          ) : null}
          <h1 className={styles.title}>{author.name}</h1>
          {author.bio ? <p className={styles.subtitle}>{author.bio}</p> : null}
        </header>
        <BlogPostList posts={author.posts} />
      </div>
    </main>
  );
}

export function BlogAuthorsView({ authors }: { authors: BlogAuthor[] }) {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href={blogSiteConfig.blogPrefix} className={styles.backLink}>
          ← Back to Blog
        </Link>
        <header className={styles.header}>
          <h1 className={styles.title}>Authors</h1>
        </header>
        <ul className={styles.authorList}>
          {authors.map((author) => (
            <li key={author.slug}>
              <Link
                href={`${blogSiteConfig.blogPrefix}/${blogSiteConfig.authorPrefix}/${author.slug}/`}
                className={styles.categoryLink}
              >
                {author.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
