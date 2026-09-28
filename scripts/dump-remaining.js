const fs = require("fs");
function walkTexts(node, acc = []) {
  if (!node) return acc;
  if (Array.isArray(node)) {
    node.forEach((n) => walkTexts(n, acc));
    return acc;
  }
  if (typeof node === "object") {
    if (typeof node.text === "string") acc.push(node.text);
    for (const [k, v] of Object.entries(node)) if (k !== "text") walkTexts(v, acc);
  }
  return acc;
}
function dump(slug) {
  const en = JSON.parse(fs.readFileSync(`content/blog/posts/${slug}/content.json`, "utf8"));
  const es = JSON.parse(fs.readFileSync(`content/blog/posts/${slug}/content.es.json`, "utf8"));
  const a = walkTexts(en);
  const b = walkTexts(es);
  const remaining = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i] || looksEnglish(b[i])) remaining.push({ i, text: b[i] });
  }
  fs.writeFileSync(`scripts/${slug}-remaining.json`, JSON.stringify(remaining, null, 2));
  console.log(slug, remaining.length);
}
function looksEnglish(s) {
  const englishHits = (s.match(/\b(the|and|you|your|this|that|with|from|will|are|for|patients|implant)\b/gi) || []).length;
  const spanishHits = (s.match(/\b(que|para|con|los|las|una|del|por|como|este|esta|implantes|dentales|pacientes)\b/gi) || []).length;
  return englishHits > spanishHits && s.trim().length > 12;
}
dump("all-on-4-dental-implants");
dump("dental-implants-cost-full-mouth");
