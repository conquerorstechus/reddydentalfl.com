import type { ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { AuthorPage, CategorySummary, FullPost, Post } from "@opinly/backend";
import { generateOpinlyMetadata, opinlyConfig } from "@opinly/next";
import type { SeoResolved } from "@opinly/shared";
import { PostContent } from "@/components/post-content";
import { opinly } from "@/lib/opinly";
import styles from "../blog.module.css";

export const revalidate = 3600;

const categoryPrefix = opinlyConfig.categoryPrefix ?? "category";
const authorPrefix = opinlyConfig.authorPrefix ?? "authors";
const blogPrefix = opinlyConfig.blogPrefix || "/blog";

type BlogPageProps = { params: Promise<{ slug?: string[] }> };

type AuthorData = Extract<AuthorPage, { type: "author" }>["data"];
type AuthorsData = Awaited<ReturnType<typeof opinly.authors>>["data"];

const loadRoute = async (slug: string[]) => {
  if (slug.length === 0) {
    const [posts, categories] = await Promise.all([
      opinly.posts({ limit: 12 }),
      opinly.categories(),
    ]);
    return {
      type: "home" as const,
      data: { posts: posts.data, categories },
    };
  }

  if (slug[0] === categoryPrefix && slug[1]) {
    const [categories, list] = await Promise.all([
      opinly.categories(),
      opinly.posts({ category: slug[1] }),
    ]);
    const meta = categories.find((c) => c.slug === slug[1]);
    if (!meta) return { type: "not-found" as const };
    return {
      type: "category" as const,
      data: { ...meta, name: meta.title, posts: list.data },
    };
  }

  if (slug[0] === authorPrefix) {
    const authorSlug = slug[1];
    if (!authorSlug) {
      return {
        type: "authors" as const,
        data: (await opinly.authors()).data,
      };
    }
    const author = await opinly.author(authorSlug);
    return author.type === "author"
      ? { type: "author" as const, data: author.data }
      : { type: "not-found" as const };
  }

  // Posts are flat: a single-segment slug. Anything deeper isn't a post route.
  if (slug.length !== 1) return { type: "not-found" as const };
  const post = await opinly.post(slug[0]);
  return post
    ? { type: "post" as const, data: post }
    : { type: "not-found" as const };
};

const toSeo = (
  route: Awaited<ReturnType<typeof loadRoute>>,
): SeoResolved => {
  switch (route.type) {
    case "post":
      return { type: "post", data: route.data };
    case "category":
      return { type: "category", data: route.data };
    case "author":
      return { type: "author", data: route.data };
    case "home":
    case "authors":
    case "not-found":
    default:
      return { type: "home" };
  }
};

export const generateMetadata = async (
  props: BlogPageProps,
  parent: ResolvingMetadata,
) => {
  const { slug } = await props.params;
  const route = await loadRoute(slug ?? []);
  if (route.type === "not-found") return {};

  // Opinly replaces openGraph wholesale and omits siteName / twitter /
  // fallback image — which is why checkers show og:site_name "Not Provided"
  // and WhatsApp falls back to generic preview chrome.
  const meta = await generateOpinlyMetadata(toSeo(route), parent);
  const title =
    typeof meta.title === "string" ? meta.title : "Reddy Dental Blog";
  const description =
    typeof meta.description === "string" ? meta.description : undefined;
  const ogImages = meta.openGraph?.images;
  const hasOgImage = Array.isArray(ogImages)
    ? ogImages.length > 0
    : Boolean(ogImages);
  const fallbackImage = {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: title,
  };
  const images = hasOgImage ? ogImages : [fallbackImage];

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      siteName: "Reddy Dental",
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),
      images: Array.isArray(images)
        ? images.map((image) =>
            typeof image === "string"
              ? image
              : image instanceof URL
                ? image.toString()
                : image.url,
          )
        : images,
    },
  };
};

function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className={styles.empty}>No posts yet.</p>;
  }

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`${blogPrefix}/${post.slug}/`}
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

function BlogIndex({
  data,
}: {
  data: { posts: Post[]; categories: CategorySummary[] };
}) {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Reddy Dental Blog</h1>
          <p className={styles.subtitle}>
            Discover dental health articles, tips, and practice updates.
          </p>
        </header>

        <PostList posts={data.posts} />

        {data.categories.length > 0 ? (
          <section className={styles.categories}>
            <h2 className={styles.categoriesTitle}>Categories</h2>
            <ul className={styles.categoryList}>
              {data.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`${blogPrefix}/${categoryPrefix}/${category.slug}/`}
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

function BlogPost({ post }: { post: FullPost }) {
  return (
    <main>
      <article>
        <h1>{post.title}</h1>
        {post.description ? <p>{post.description}</p> : null}
        <PostContent content={post.content} />
      </article>
    </main>
  );
}

function CategoryView({
  category,
}: {
  category: CategorySummary & { name: string; posts: Post[] };
}) {
  return (
    <main>
      <h1>{category.name}</h1>
      {category.description ? <p>{category.description}</p> : null}
      <PostList posts={category.posts} />
    </main>
  );
}

function AuthorView({ author }: { author: AuthorData }) {
  return (
    <main>
      <h1>{author.name}</h1>
      {author.bio ? <p>{author.bio}</p> : null}
      <PostList posts={author.posts} />
    </main>
  );
}

function AuthorsView({ authors }: { authors: AuthorsData }) {
  return (
    <main>
      <h1>Authors</h1>
      <ul>
        {authors.map((author) => (
          <li key={author.slug}>
            <Link href={`${blogPrefix}/${authorPrefix}/${author.slug}/`}>
              {author.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default async function BlogPage(props: BlogPageProps) {
  const { slug } = await props.params;
  const route = await loadRoute(slug ?? []);

  switch (route.type) {
    case "home":
      return <BlogIndex data={route.data} />;
    case "post":
      return <BlogPost post={route.data} />;
    case "category":
      return <CategoryView category={route.data} />;
    case "author":
      return <AuthorView author={route.data} />;
    case "authors":
      return <AuthorsView authors={route.data} />;
    default:
      notFound();
  }
}
