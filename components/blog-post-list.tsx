import Link from "next/link";
import { useTranslations } from "next-intl";
import type { BlogPostSummary } from "@/lib/blog/types";
import { blogSiteConfig } from "@/lib/blog/config";
import styles from "@/app/blog/blog.module.css";

export function BlogPostList({ posts }: { posts: BlogPostSummary[] }) {
  const t = useTranslations("blog");

  if (posts.length === 0) {
    return <p className={styles.empty}>{t("empty")}</p>;
  }

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`${blogSiteConfig.blogPrefix}/${post.slug}/`}
            className={styles.card}
          >
            <h2 className={styles.cardTitle}>{post.title}</h2>
            {post.description ? (
              <p className={styles.cardDescription}>{post.description}</p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
