#!/usr/bin/env node
/* MotionZync design bundle validator. Fails non-zero unless every gate passes. */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { createHash } from "node:crypto";

const root = resolve(process.argv[2] ?? new URL("..", import.meta.url).pathname);
const errors = [];
const warn = [];
const ok = (m) => console.log("  PASS " + m);
const fail = (m) => { errors.push(m); console.log("  FAIL " + m); };

console.log("== 1. Required files ==");
for (const f of ["README.md","COMPATIBILITY.md","ACCESSIBILITY.md","THEME_SYSTEM.md","LICENSES_AND_ATTRIBUTION.md","manifest.json","shared/tokens.css","shared/preview-shell/PreviewShell.jsx","shared/parts/GeneratedParts.jsx","themes/light.json","themes/dark.json","themes/colorful.json","themes/high-contrast.json","package.json"])
  (existsSync(join(root,f)) ? ok : fail)(f);

console.log("== 2. Manifest parses & schema ==");
let manifest;
try { manifest = JSON.parse(readFileSync(join(root,"manifest.json"),"utf8")); ok("manifest.json parses"); }
catch (e) { fail("manifest.json: " + e.message); process.exit(1); }
for (const k of ["schemaVersion","bundleVersion","themeIds","categories","designs"]) (manifest[k] !== undefined ? ok : fail)("schema key: " + k);

console.log("== 3/4. Counts, unique IDs, naming ==");
const byCat = {};
const ids = new Set();
const idre = /^(premium|ultra)-[a-z0-9-]+-\d{3}$/;
for (const d of manifest.designs) {
  byCat[d.category] ??= { premium: 0, "ultra-premium": 0 };
  byCat[d.category][d.tier]++;
  if (ids.has(d.id)) fail("duplicate id " + d.id); else ids.add(d.id);
  if (!idre.test(d.id)) fail("bad id format " + d.id);
}
if (ids.size === manifest.designs.length) ok(ids.size + " unique IDs");
for (const c of manifest.categories) {
  const got = byCat[c.id] ?? { premium: 0, "ultra-premium": 0 };
  (got.premium >= 100 && got["ultra-premium"] >= 100 ? ok : fail)(`${c.id}: premium=${got.premium} ultra=${got["ultra-premium"]}`);
}

console.log("== 5/6. Paths resolve inside root; themes ==");
for (const d of manifest.designs) {
  for (const p of [d.entry, ...(d.styles ?? []), d.notes].filter(Boolean)) {
    const abs = resolve(root, p);
    if (!abs.startsWith(root + sep)) fail("path traversal: " + d.id);
    else if (!existsSync(abs)) fail("missing file: " + p);
  }
  const t = new Set(d.themes);
  if (!["light","dark","colorful"].every((x) => t.has(x))) fail("themes missing on " + d.id);
}
ok("path & theme scan complete");

console.log("== 7/8. Content meaning, placeholders, near-duplicates ==");
const fingerprints = new Map();
let placeholderHits = 0, tinyFiles = 0;
function walk(dir) { return readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; }); }
const jsxFiles = walk(join(root, "designs")).filter((p) => p.endsWith(".jsx"));
for (const p of jsxFiles) {
  const src = readFileSync(p, "utf8");
  const codeOnly = src.replace(/placeholder="[^"]*"/g, "");
  const executableSource = codeOnly.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*import\s*\{[^}]+\}\s*from[^\n]*$/gm, "");
  if (/\{\s*(BENTO|ROWS5|CARDS2|CARDS4|FLOATINGNODES|PARAGRAPHS|TIMELINEITEMS|FORMFIELDS|CARDS6|TABLEROWS)\s*\}/.test(executableSource)) fail("unresolved generated macro in " + p);
  if (/TODO|FIXME|LOREM IPSUM/i.test(codeOnly)) { placeholderHits++; fail("placeholder/TODO content in " + p); }
  if (src.length < 400) { tinyFiles++; fail("suspiciously small component " + p); }
  // structural fingerprint: element-type histogram + text-token set
  const tags = [...src.matchAll(/<([a-zA-Z]+)/g)].map((m) => m[1]).sort().join(",");
  const texts = [...src.matchAll(/>([^<{}]{4,})</g)].map((m) => m[1].trim()).sort().join("|");
  const fp = createHash("sha256").update(tags + "::" + texts).digest("hex");
  if (fingerprints.has(fp)) fail(`near-duplicate structure: ${p} == ${fingerprints.get(fp)}`);
  else fingerprints.set(fp, p);
}
if (!placeholderHits) ok("no placeholder/TODO content");
if (!tinyFiles) ok("no empty/tiny components");
ok(fingerprints.size + " unique structural fingerprints across " + jsxFiles.length + " components");
warn.push("Fingerprint check flags structural duplicates only; final visual originality requires human review (see human-review checklist in README).");

console.log("== 9. Secrets scan ==");
const secretRe = /(api[_-]?key|secret|password|private[_-]?key|BEGIN [A-Z ]*PRIVATE KEY|sk_live|AKIA[0-9A-Z]{16})/i;
for (const p of walk(root).filter((p) => /\.(jsx|css|json)$/.test(p))) {
  const s = readFileSync(p, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  if (secretRe.test(s)) fail("possible secret in " + p);
}
ok("secrets scan complete (context-aware)");

console.log("== 10. Unsafe patterns in preview shell & components ==");
for (const p of jsxFiles.concat([join(root, "shared/preview-shell/PreviewShell.jsx"),join(root, "shared/parts/GeneratedParts.jsx")])) {
  const raw = readFileSync(p, "utf8");
  const s = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  for (const bad of ["eval(", "new Function(", "dangerouslySetInnerHTML", "<script src=\"http", "fetch(\"http"])
    if (s.includes(bad)) fail(`unsafe pattern "${bad}" in ` + p);
}
ok("no eval/new Function/dangerouslySetInnerHTML/remote injection");

console.log("== 11. Syntax sanity ==");
let badJsx = 0;
for (const p of jsxFiles) { const s = readFileSync(p, "utf8"); const open = (s.match(/</g) || []).length, close = (s.match(/>/g) || []).length; if (open !== close) { badJsx++; fail("unbalanced tags in " + p); } }
if (!badJsx) ok("JSX tag balance across all components");

console.log("== 12. A11y & responsive coverage ==");
const cssFiles = walk(join(root, "designs")).filter((p) => p.endsWith(".css"));
let focus = 0, rm = 0, mq = 0;
for (const p of cssFiles) { const s = readFileSync(p, "utf8"); if (s.includes("focus-visible")) focus++; if (s.includes("prefers-reduced-motion")) rm++; if (s.includes("@media")) mq++; }
(focus === cssFiles.length ? ok : fail)(`focus-visible in ${focus}/${cssFiles.length}`);
(rm === cssFiles.length ? ok : fail)(`prefers-reduced-motion in ${rm}/${cssFiles.length}`);
(mq === cssFiles.length ? ok : fail)(`responsive @media in ${mq}/${cssFiles.length}`);

console.log("== 14. Summary ==");
for (const c of manifest.categories) { const g = byCat[c.id]; console.log(`  ${c.id}: premium=${g.premium} ultra-premium=${g["ultra-premium"]} themes=light,dark,colorful`); }
console.log("  TOTAL designs: " + manifest.designs.length);
for (const w of warn) console.log("  NOTE " + w);
if (errors.length) { console.log(`\n${errors.length} gate(s) FAILED`); process.exit(1); }
console.log("\nALL GATES PASSED");
