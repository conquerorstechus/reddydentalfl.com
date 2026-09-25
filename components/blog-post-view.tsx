import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { blogSiteConfig } from "@/lib/blog/config";
import { resolveStructuredData } from "@/lib/blog/structured-data";
import { BlogFaqSection } from "@/components/blog-faq";
import { BlogJsonLd } from "@/components/blog-json-ld";
import { PostContent } from "@/components/post-content";
import styles from "@/app/blog/blog.module.css";

export function BlogPostView({ post }: { post: BlogPost }) {
  const structuredData = resolveStructuredData(post);

  return (
    <main className={styles.page}>
      <BlogJsonLd data={structuredData} />
      <div className={styles.inner}>
        <Link href={blogSiteConfig.blogPrefix} className={styles.backLink}>
          ← Back to Blog
        </Link>
        <article className={styles.article}>
          {post.titleImage?.src ? (
            <figure className={styles.heroFigure}>
              <img
                src={post.titleImage.src}
                alt={post.titleImage.alt || post.title}
                title={post.titleImage.title || undefined}
                className={styles.heroImage}
              />
              {post.titleImage.caption ? (
                <figcaption className={styles.heroCaption}>
                  {post.titleImage.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            {post.description ? (
              <p className={styles.articleDescription}>{post.description}</p>
            ) : null}
          </header>
          <div className={styles.articleBody}>
            <PostContent content={post.content} imagesPrefix={blogSiteConfig.imagesPrefix} />
          </div>
          {post.faqs?.length ? <BlogFaqSection faqs={post.faqs} /> : null}
        </article>
      </div>
    </main>
  );
}
