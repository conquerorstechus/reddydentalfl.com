const fs = require("fs");
function texts(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const out = [];
  function walk(node, path="") {
    if (!node) return;
    if (Array.isArray(node)) return node.forEach((n,i)=>walk(n, path+"."+i));
    if (typeof node === "object") {
      if (typeof node.text === "string") out.push(node.text);
      for (const [k,v] of Object.entries(node)) if (k !== "text") walk(v, path+"."+k);
    }
  }
  walk(data);
  return out;
}
const en = texts("content/blog/posts/all-on-4-dental-implants/content.json");
const es = texts("content/blog/posts/all-on-4-dental-implants/content.es.json");
console.log("all-on-4", en.length, es.length, "same", en.length===es.length);
const en2 = texts("content/blog/posts/dental-implants-cost-full-mouth/content.json");
const es2 = texts("content/blog/posts/dental-implants-cost-full-mouth/content.es.json");
console.log("full-mouth", en2.length, es2.length, "same", en2.length===es2.length);
