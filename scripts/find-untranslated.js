const fs = require("fs");
const path = require("path");
const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));
const copy = Object.values(en.copy).map((v) =>
  String(v).replaceAll("''", "'").replace(/\s+/g, " ").trim(),
);
const copySet = new Set(copy);
const extras = [
  ...Object.values(en.nav),
  en.footer.contactInfo,
  en.footer.officeHours,
  en.footer.quickLinks,
  en.footer.requestAppointment,
  en.footer.dentalBlog,
  en.footer.newPatientForms,
  en.footer.onlinePayment,
  ...en.footer.hours.map((h) => h.day),
];
for (const v of extras) copySet.add(String(v).replace(/\s+/g, " ").trim());

const files = [
  "content/technologies/3d-imaging/index.html",
  "content/technologies/cone-beam/index.html",
  "content/technologies/impressions/index.html",
  "content/technologies/digital-x-rays/index.html",
  "content/technologies/intraoral-cameras/index.html",
  "content/technologies/panoramic-x-rays/index.html",
  "content/technologies/ultrasonic-scaler/index.html",
  "content/services/oral-cancer-screenings/index.html",
  "content/patient-resources/index.html",
  "content/patient-resources/smile-savings-plan/index.html",
  "content/contact/index.html",
];

function extractMain(html) {
  const start = html.indexOf("<main");
  const end = html.indexOf("</main>");
  return start >= 0 && end > start ? html.slice(start, end) : html;
}

const missing = [];
for (const file of files) {
  const html = extractMain(fs.readFileSync(file, "utf8"));
  const texts = [...html.matchAll(/>([^<]+)</g)]
    .map((m) => m[1].replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 2 && /[A-Za-z]/.test(t) && !/^[\d$»←•.\-()]+$/.test(t));
  const unique = [...new Set(texts)];
  const unmatched = unique.filter((t) => !copySet.has(t) && !copy.some((c) => c === t));
  missing.push({ file, unmatched });
}

for (const row of missing) {
  console.log("\n====", row.file);
  for (const t of row.unmatched) console.log(" -", t);
}
