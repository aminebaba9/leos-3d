/*
  Serveur local pour prévisualiser la boutique Leo's.
  Usage : node tools/serve.js [port] [dossier]
*/
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.argv[2] || 8080);
const ROOT = path.resolve(process.argv[3] || path.join(__dirname, ".."));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  let pathname = "/index.html";
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname) || "/";
  } catch (err) {
    pathname = (req.url || "/").split("?")[0];
  }
  if (pathname === "/") pathname = "/index.html";

  const target = path.join(ROOT, path.normalize(pathname).replace(/^(\.\.[/\\])+/, ""));

  fs.stat(target, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 — fichier introuvable : " + pathname);
      console.log("404 " + pathname);
      return;
    }
    const headers = {
      "Content-Type": TYPES[path.extname(target).toLowerCase()] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    };
    res.writeHead(200, headers);
    if (req.method === "HEAD") { res.end(); return; }
    fs.createReadStream(target).on("error", () => res.end()).pipe(res);
    console.log(`200 ${req.method} ${pathname} · host=${req.headers.host || "-"}`);
  });
});

server.on("error", err => {
  console.error("Erreur serveur :", err.message);
  process.exit(1);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Leo's → http://0.0.0.0:${PORT}  (racine : ${ROOT})`);
  console.log("Pages : /  ·  /?product=hoodie-onyx  ·  /?lang=ar  ·  /?admin=1");
});
