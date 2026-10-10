#!/usr/bin/env node
/* Builds a static gallery index from manifest metadata with HTML escaping. */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
const root = resolve(new URL("..", import.meta.url).pathname);
const m = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
const cells = (d) => [d.id, d.category, d.tier, d.name, (d.themes ?? []).join(", "), d.entry].map((v) => "<td>" + escapeHtml(v) + "</td>").join("");
const rows = m.designs.map((d) => "<tr>" + cells(d) + "</tr>").join("\n");
const count = escapeHtml(m.totals?.designs ?? m.designs.length);
const html = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>MotionZync Design Bundle Index</title></head><body><h1>Design bundle index (" + count + " designs)</h1><table><thead><tr><th>ID</th><th>Category</th><th>Tier</th><th>Name</th><th>Themes</th><th>Entry</th></tr></thead><tbody>" + rows + "</tbody></table></body></html>";
writeFileSync(join(root, "preview-index.html"), html);
console.log("preview-index.html written safely");
