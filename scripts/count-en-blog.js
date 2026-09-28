const fs = require("fs");
function remaining(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const texts = [];
  function walk(node) {
    if (!node) return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (typeof node === "object") {
      if (typeof node.text === "string") texts.push(node.text);
      Object.values(node).forEach(walk);
    }
  }
  walk(data);
  const english = texts.filter((t) => {
    const s = t.trim();
    if (s.length < 8) return false;
    const letters = s.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ]/g, "");
    if (letters.length < 8) return false;
    const spanishHits = (s.match(/\b(que|para|con|los|las|una|del|por|como|este|esta|implantes|dentales|pacientes)\b/gi) || []).length;
    const englishHits = (s.match(/\b(the|and|you|your|this|that|with|from|will|are|for|patients)\b/gi) || []).length;
    return englishHits > spanishHits;
  });
  console.log(file, "english-like", english.length, "of", texts.length);
}
remaining("content/blog/posts/all-on-4-dental-implants/content.es.json");
remaining("content/blog/posts/dental-implants-cost-full-mouth/content.es.json");
