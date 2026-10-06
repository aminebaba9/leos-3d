#!/usr/bin/env node
/*
  Assemble index.html à partir des sources de /build.
  Usage : node build/build.js
*/
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(__dirname, file), "utf8");

const css = [read("01-css-base.css"), read("02-css-ui.css")].join("\n\n");
const head = read("03-head.html").replace("/*__LEOS_CSS__*/", () => css);
const main = read("04-main.html");
const tail = read("05-tail.html");
const js = [
  "/* Leo's — build " + new Date().toISOString().slice(0, 10) + " */",
  read("06-script-data.js"),
  read("07-script-render.js"),
  read("08-script-i18n.js"),
  read("09-script-app.js")
].join("\n\n");

const html = [
  head,
  "",
  main,
  "",
  tail,
  "",
  "<script>",
  js,
  "</script>",
  "</body>",
  "</html>",
  ""
].join("\n");

fs.writeFileSync(path.join(root, "index.html"), html, "utf8");

const stats = {
  "index.html": Buffer.byteLength(html),
  "css": Buffer.byteLength(css),
  "js": Buffer.byteLength(js),
  "lines": html.split("\n").length
};
console.log("Build OK :", JSON.stringify(stats, null, 2));

/* Contrôles rapides */
const problems = [];
const openTags = (html.match(/<script/g) || []).length;
const closeTags = (html.match(/<\/script>/g) || []).length;
if (openTags !== closeTags) problems.push(`balises <script> déséquilibrées (${openTags}/${closeTags})`);
if (/__LEOS_CSS__/.test(html)) problems.push("placeholder CSS non remplacé");
if (/(Leviraison|discreet)/.test(html)) problems.push("coquille détectée dans le contenu");
const braces = (js.match(/{/g) || []).length - (js.match(/}/g) || []).length;
if (braces !== 0) problems.push(`accolades JS déséquilibrées (${braces})`);
console.log(problems.length ? "⚠ " + problems.join(" | ") : "✔ Contrôles de structure passés");
