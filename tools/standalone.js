/*
  Génère une version « tout-en-un » du site : leos-standalone.html
  Toutes les images sont intégrées en base64 → le fichier fonctionne
  sans serveur et sans dossier assets/ (double-clic, e-mail, clé USB…).

  Usage : node tools/standalone.js [chemin de sortie]
*/
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = process.argv[2] || path.join(ROOT, "leos-standalone.html");

const MIME = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif"
};

let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* Recense toutes les références "assets/..." puis les remplace par des data URI */
const refs = new Set();
html.replace(/assets\/[A-Za-z0-9._-]+\.(?:jpg|jpeg|png|webp|svg|gif)/g, match => {
  refs.add(match);
  return match;
});

let total = 0;
let replaced = 0;
refs.forEach(ref => {
  const file = path.join(ROOT, ref);
  if (!fs.existsSync(file)) {
    console.warn("⚠ image manquante, ignorée :", ref);
    return;
  }
  const buffer = fs.readFileSync(file);
  const mime = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
  const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;
  total += buffer.length;
  html = html.split(ref).join(dataUri);
  replaced += 1;
});

/* Petites retouches propres à la version hors ligne */
html = html.replace(
  '<meta property="og:image" content="data:',
  '<meta property="og:image" content="data:'
);
html = html.replace(
  /<link rel="preload" as="image" href="data:[^"]*"[^>]*>/,
  ""
);

fs.writeFileSync(OUTPUT, html, "utf8");

const kb = n => (n / 1024).toFixed(0) + " Ko";
console.log(`✔ ${path.relative(ROOT, OUTPUT)} généré`);
console.log(`  ${replaced} image(s) intégrée(s) · ${kb(total)} d'images → ${kb(Buffer.byteLength(html))} de fichier`);
console.log("  Ouvre-le d'un double-clic : aucun serveur nécessaire.");
