const fs = require("fs");
const path = require("path");

function apply(slug, spanishByRemainingOrder) {
  const remaining = JSON.parse(
    fs.readFileSync(path.join(__dirname, `${slug}-remaining.json`), "utf8"),
  );
  if (spanishByRemainingOrder.length !== remaining.length) {
    throw new Error(
      `${slug}: expected ${remaining.length} translations, got ${spanishByRemainingOrder.length}`,
    );
  }
  const file = path.join(__dirname, "..", "content", "blog", "posts", slug, "content.es.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const byIndex = Object.fromEntries(
    remaining.map((item, n) => [item.i, spanishByRemainingOrder[n]]),
  );
  let i = 0;
  function walk(node) {
    if (!node) return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (typeof node === "object") {
      if (typeof node.text === "string") {
        if (Object.prototype.hasOwnProperty.call(byIndex, i)) node.text = byIndex[i];
        i += 1;
        return;
      }
      Object.values(node).forEach(walk);
    }
  }
  walk(data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log("patched", slug, remaining.length);
}

module.exports = { apply };
