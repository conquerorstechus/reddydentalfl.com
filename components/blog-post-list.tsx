import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { BlogPostSummary } from "@/lib/blog/types";
import { blogSiteConfig } from "@/lib/blog/config";
import { formatBlogDate } from "@/lib/blog/format-date";
import styles from "@/app/blog/blog.module.css";

export function BlogPostList({ posts }: { posts: BlogPostSummary[] }) {
  const t = useTranslations("blog");
  const locale = useLocale();

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
            {post.titleImage?.src ? (
              <img
                src={post.titleImage.src}
                alt={post.titleImage.alt || post.title}
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                className={styles.cardMedia}
              />
            ) : null}
            <time className={styles.cardDate} dateTime={post.firstPublishedAt}>
              {formatBlogDate(post.firstPublishedAt, locale)}
            </time>
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
