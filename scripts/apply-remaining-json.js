const fs = require("fs");
const path = require("path");
const { apply } = require("./apply-blog-es");

const slug = process.argv[2];
if (!slug) {
  console.error("usage: node apply-remaining-json.js <slug>");
  process.exit(1);
}
const file = path.join(__dirname, `${slug}-es-translations.json`);
const arr = JSON.parse(fs.readFileSync(file, "utf8"));
if (!Array.isArray(arr)) {
  throw new Error("translations file must be a JSON array of strings");
}
apply(slug, arr);
