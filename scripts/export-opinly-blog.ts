/**
 * One-time Opinly blog content export.
 * Usage: npx tsx scripts/export-opinly-blog.ts
 *
 * Reads OPINLY_API_KEY from .env.local (never logged).
 * Writes to content-opinly-export/ without touching live blog routes.
 */

import { createOpinlyClient, type FullPost } from "@opinly/backend";
import {
  buildBlogPostingJsonLd,
  buildFaqJsonLd,
  type OpinlyNode,
} from "@opinly/shared";
import { promises as fs, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPORT_DIR = path.join(PROJECT_ROOT, "content-opinly-export");
const ENV_PATH = path.join(PROJECT_ROOT, ".env.local");

const CDN_NAMESPACE = "Xlz6qeNMFahM1LnqEBkJU";
const CDN_BASE = `https://cdn.opinly.ai/${CDN_NAMESPACE}`;

const OPINLY_CONFIG = {
  imagesPrefix: "/images",
  siteUrl: "https://www.reddydentalfl.com",
  blogPrefix: "/blog",
  siteName: "Reddy Dental",
};

type ImageRef = {
  fileKey: string;
  role: string;
  sourceUrl: string;
  localPath: string | null;
  error?: string;
};

type PostExportRecord = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string | null;
  metaDescription: string | null;
  firstPublishedAt: string;
  modifiedAt: string;
  category: FullPost["category"];
  author: FullPost["author"];
  tags: FullPost["tags"];
  faqCount: number;
  imageCount: number;
  folder: string;
  exportedAt: string;
  error?: string;
};

type ExportManifest = {
  exportedAt: string;
  source: "opinly";
  apiVersion: string;
  cdnNamespace: string;
  siteUrl: string;
  blogPath: string;
  summary: {
    postsFound: number;
    postsExported: number;
    postsFailed: number;
    imagesDownloaded: number;
    imagesFailed: number;
  };
  posts: PostExportRecord[];
  failedPosts: { slug: string; error: string }[];
  failedImages: { slug: string; fileKey: string; role: string; error: string }[];
};

function loadEnvLocal(): void {
  try {
    const raw = readFileSync(ENV_PATH, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local may be absent; caller checks OPINLY_API_KEY below.
  }
}

function sanitizeFileKey(fileKey: string): string {
  return fileKey.replace(/^\/+/, "").replace(/[/\\]/g, "__");
}

function cdnUrl(fileKey: string): string {
  const key = fileKey.replace(/^\/+/, "");
  return `${CDN_BASE}/${key}`;
}

function collectContentImageKeys(node: OpinlyNode | undefined): string[] {
  if (!node) return [];
  const keys: string[] = [];
  if (node.type === "image") {
    const fileKey = node.attrs?.fileKey;
    if (typeof fileKey === "string" && fileKey.trim()) keys.push(fileKey);
  }
  for (const child of node.content ?? []) {
    keys.push(...collectContentImageKeys(child));
  }
  return keys;
}

function collectImageRefs(post: FullPost): { fileKey: string; role: string }[] {
  const refs: { fileKey: string; role: string }[] = [];
  const seen = new Set<string>();

  const add = (fileKey: string | null | undefined, role: string) => {
    if (!fileKey?.trim() || seen.has(fileKey)) return;
    seen.add(fileKey);
    refs.push({ fileKey, role });
  };

  add(post.titleFile?.fileKey, "title");
  for (const img of post.images ?? []) add(img.fileKey, "gallery");
  add(post.author?.fileKey, "author");
  for (const fileKey of collectContentImageKeys(post.content as OpinlyNode)) {
    add(fileKey, "inline");
  }

  return refs;
}

async function downloadImage(
  fileKey: string,
  destDir: string,
): Promise<{ localPath: string }> {
  const url = cdnUrl(fileKey);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = sanitizeFileKey(fileKey);
  const localPath = path.join(destDir, filename);
  await fs.writeFile(localPath, buffer);
  return { localPath: path.relative(PROJECT_ROOT, localPath).replace(/\\/g, "/") };
}

async function fetchAllPostSlugs(
  opinly: ReturnType<typeof createOpinlyClient>,
): Promise<string[]> {
  const slugs: string[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const page = await opinly.posts({ limit: 100, cursor, sort: "newest" });
    for (const post of page.data) slugs.push(post.slug);
    hasMore = page.has_more;
    cursor = page.next_cursor ?? undefined;
    if (hasMore && !cursor) break;
  }

  return slugs;
}

async function exportPost(
  opinly: ReturnType<typeof createOpinlyClient>,
  slug: string,
): Promise<{
  record: PostExportRecord;
  imageRefs: ImageRef[];
  failedImages: ExportManifest["failedImages"];
}> {
  const postDir = path.join(EXPORT_DIR, slug);
  const imagesDir = path.join(postDir, "images");
  await fs.mkdir(imagesDir, { recursive: true });

  const post = await opinly.post(slug);
  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  const structuredData: Record<string, unknown> = {
    blogPosting: buildBlogPostingJsonLd(
      {
        title: post.title,
        description: post.description,
        content: post.content as OpinlyNode,
        firstPublishedAt: post.firstPublishedAt,
        modifiedAt: post.modifiedAt,
        author: post.author ? { name: post.author.name } : null,
        imageFileKey: post.titleFile?.fileKey,
      },
      OPINLY_CONFIG,
    ),
  };

  if (post.faqs?.length) {
    structuredData.faq = buildFaqJsonLd(post.faqs);
  }

  await fs.writeFile(
    path.join(postDir, "post.json"),
    JSON.stringify(post, null, 2),
    "utf8",
  );
  await fs.writeFile(
    path.join(postDir, "structured-data.json"),
    JSON.stringify(structuredData, null, 2),
    "utf8",
  );

  const refs = collectImageRefs(post);
  const imageRefs: ImageRef[] = [];
  const failedImages: ExportManifest["failedImages"] = [];

  for (const ref of refs) {
    const entry: ImageRef = {
      fileKey: ref.fileKey,
      role: ref.role,
      sourceUrl: cdnUrl(ref.fileKey),
      localPath: null,
    };
    try {
      const { localPath } = await downloadImage(ref.fileKey, imagesDir);
      entry.localPath = localPath;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      entry.error = message;
      failedImages.push({ slug, fileKey: ref.fileKey, role: ref.role, error: message });
    }
    imageRefs.push(entry);
  }

  await fs.writeFile(
    path.join(postDir, "images.json"),
    JSON.stringify(imageRefs, null, 2),
    "utf8",
  );

  const exportedAt = new Date().toISOString();
  const record: PostExportRecord = {
    slug: post.slug,
    title: post.title,
    description: post.description,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    firstPublishedAt: post.firstPublishedAt,
    modifiedAt: post.modifiedAt,
    category: post.category,
    author: post.author,
    tags: post.tags,
    faqCount: post.faqs?.length ?? 0,
    imageCount: imageRefs.filter((i) => i.localPath).length,
    folder: path.relative(PROJECT_ROOT, postDir).replace(/\\/g, "/"),
    exportedAt,
  };

  return { record, imageRefs, failedImages };
}

async function main(): Promise<void> {
  loadEnvLocal();

  const apiKey = process.env.OPINLY_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "ERROR: OPINLY_API_KEY is not set. Add it to .env.local in the project root.",
    );
    process.exit(1);
  }

  const opinly = createOpinlyClient({ apiKey });

  await fs.mkdir(EXPORT_DIR, { recursive: true });

  console.log("Fetching post list from Opinly...");
  const slugs = await fetchAllPostSlugs(opinly);
  console.log(`Found ${slugs.length} post(s) in Opinly.`);

  const manifest: ExportManifest = {
    exportedAt: new Date().toISOString(),
    source: "opinly",
    apiVersion: "1.4.0",
    cdnNamespace: CDN_NAMESPACE,
    siteUrl: OPINLY_CONFIG.siteUrl,
    blogPath: OPINLY_CONFIG.blogPrefix,
    summary: {
      postsFound: slugs.length,
      postsExported: 0,
      postsFailed: 0,
      imagesDownloaded: 0,
      imagesFailed: 0,
    },
    posts: [],
    failedPosts: [],
    failedImages: [],
  };

  for (const slug of slugs) {
    process.stdout.write(`Exporting: ${slug}... `);
    try {
      const { record, failedImages } = await exportPost(opinly, slug);
      manifest.posts.push(record);
      manifest.failedImages.push(...failedImages);
      manifest.summary.postsExported += 1;
      manifest.summary.imagesDownloaded += record.imageCount;
      manifest.summary.imagesFailed += failedImages.length;
      console.log("OK");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      manifest.failedPosts.push({ slug, error: message });
      manifest.summary.postsFailed += 1;
      console.log(`FAILED (${message})`);
    }
  }

  await fs.writeFile(
    path.join(EXPORT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  console.log("\n--- Export complete ---");
  console.log(`Posts found:        ${manifest.summary.postsFound}`);
  console.log(`Posts exported:     ${manifest.summary.postsExported}`);
  console.log(`Posts failed:       ${manifest.summary.postsFailed}`);
  console.log(`Images downloaded:  ${manifest.summary.imagesDownloaded}`);
  console.log(`Images failed:      ${manifest.summary.imagesFailed}`);
  console.log(`Export folder:      ${EXPORT_DIR}`);

  if (manifest.summary.postsFailed > 0 || manifest.summary.imagesFailed > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Export failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
