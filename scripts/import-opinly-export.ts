/**
 * One-time migration: content-opinly-export/ → content/blog/posts/ + public/blog-images/
 * Usage: npx tsx scripts/import-opinly-export.ts
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPORT_DIR = path.join(PROJECT_ROOT, "content-opinly-export");
const BLOG_POSTS_DIR = path.join(PROJECT_ROOT, "content", "blog", "posts");
const PUBLIC_IMAGES_DIR = path.join(PROJECT_ROOT, "public", "blog-images");

const IMAGE_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png", ".gif"]);

type ExportedPost = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string | null;
  metaDescription: string | null;
  firstPublishedAt: string;
  modifiedAt: string;
  author: { slug: string } | string | null;
  category: { slug: string } | string | null;
  tags: { slug: string }[] | string[];
  titleFile?: {
    fileKey: string;
    altText?: string | null;
    title?: string | null;
    caption?: string | null;
  } | null;
  faqs: { question: string; answer: string }[] | null;
  content: unknown;
};

type ExportManifest = {
  posts: { slug: string }[];
};

function resolveSlugRef(
  value: { slug: string } | string | null | undefined,
): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.slug;
}

function resolveTags(tags: { slug: string }[] | string[] | undefined): string[] {
  if (!tags?.length) return [];
  return tags.map((tag) => (typeof tag === "string" ? tag : tag.slug));
}

async function listImageFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter(
        (entry) =>
          entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
      )
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

async function copyImage(
  sourcePath: string,
  destPath: string,
): Promise<void> {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.copyFile(sourcePath, destPath);
}

function pickHeroSourceFile(
  imageFiles: string[],
  titleFileKey?: string | null,
): string | null {
  if (imageFiles.length === 0) return null;
  if (titleFileKey) {
    const match = imageFiles.find((file) => file.includes(titleFileKey));
    if (match) return match;
    const baseName = path.basename(titleFileKey);
    const byBase = imageFiles.find((file) => file === baseName);
    if (byBase) return byBase;
  }
  return imageFiles[0];
}

async function importPost(slug: string): Promise<void> {
  const exportDir = path.join(EXPORT_DIR, slug);
  const postPath = path.join(exportDir, "post.json");
  const post = JSON.parse(await fs.readFile(postPath, "utf8")) as ExportedPost;

  const postDir = path.join(BLOG_POSTS_DIR, slug);
  const exportImagesDir = path.join(exportDir, "images");
  const publicPostImagesDir = path.join(PUBLIC_IMAGES_DIR, slug);

  await fs.mkdir(postDir, { recursive: true });

  const imageFiles = await listImageFiles(exportImagesDir);
  const heroSource = pickHeroSourceFile(imageFiles, post.titleFile?.fileKey);
  let titleImage: {
    src: string;
    alt?: string | null;
    title?: string | null;
    caption?: string | null;
  } | null = null;

  if (heroSource) {
    const heroDest = path.join(publicPostImagesDir, "hero.webp");
    await copyImage(path.join(exportImagesDir, heroSource), heroDest);
    titleImage = {
      src: `/blog-images/${slug}/hero.webp`,
      alt: post.titleFile?.altText ?? post.title,
      title: post.titleFile?.title ?? null,
      caption: post.titleFile?.caption ?? null,
    };

    for (const file of imageFiles) {
      if (file === heroSource) continue;
      const safeName = file.replace(/\s+/g, "-").toLowerCase();
      await copyImage(
        path.join(exportImagesDir, file),
        path.join(publicPostImagesDir, safeName),
      );
    }
  }

  const meta = {
    slug: post.slug,
    title: post.title,
    description: post.description,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    firstPublishedAt: post.firstPublishedAt,
    modifiedAt: post.modifiedAt,
    draft: false,
    author: resolveSlugRef(post.author),
    category: resolveSlugRef(post.category),
    tags: resolveTags(post.tags),
    titleImage,
    faqs: post.faqs ?? [],
  };

  await fs.writeFile(
    path.join(postDir, "meta.json"),
    JSON.stringify(meta, null, 2),
    "utf8",
  );
  await fs.writeFile(
    path.join(postDir, "content.json"),
    JSON.stringify(post.content, null, 2),
    "utf8",
  );

  const structuredPath = path.join(exportDir, "structured-data.json");
  try {
    const structured = JSON.parse(await fs.readFile(structuredPath, "utf8")) as {
      blogPosting?: Record<string, unknown>;
      faq?: Record<string, unknown>;
    };

    if (structured.blogPosting && titleImage?.src) {
      structured.blogPosting.image = titleImage.src;
    }

    await fs.writeFile(
      path.join(postDir, "structured-data.json"),
      JSON.stringify(structured, null, 2),
      "utf8",
    );
  } catch {
    // structured-data.json is optional; generated at render time if missing.
  }

  console.log(`Imported: ${slug}${titleImage ? "" : " (no images found)"}`);
}

async function main(): Promise<void> {
  const manifestPath = path.join(EXPORT_DIR, "manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8")) as ExportManifest;

  await fs.mkdir(BLOG_POSTS_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_IMAGES_DIR, { recursive: true });

  console.log(`Migrating ${manifest.posts.length} post(s)...`);

  for (const entry of manifest.posts) {
    await importPost(entry.slug);
  }

  console.log("\nMigration complete.");
  console.log(`Posts:  ${BLOG_POSTS_DIR}`);
  console.log(`Images: ${PUBLIC_IMAGES_DIR}`);
  console.log("\nTo preview locally with GitHub blog source:");
  console.log("  Set BLOG_SOURCE=github in .env.local, then run npm run dev");
}

main().catch((error) => {
  console.error("Import failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
