import { promises as fs } from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function listSitePages(): Promise<string[][]> {
  const pages: string[][] = [];

  async function walk(dir: string, segments: string[]) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const hasIndex = entries.some(
      (entry) => entry.isFile() && entry.name === "index.html",
    );

    if (hasIndex) {
      pages.push(segments);
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await walk(path.join(dir, entry.name), [...segments, entry.name]);
      }
    }
  }

  await walk(CONTENT_DIR, []);
  return pages;
}

export async function readSiteHtml(slug: string[] = []): Promise<string | null> {
  const filePath = path.join(CONTENT_DIR, ...slug, "index.html");

  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}
