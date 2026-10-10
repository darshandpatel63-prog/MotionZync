#!/usr/bin/env python3
"""Prepare and validate the uploaded design pack, then import it add-only into DI."""
from __future__ import annotations
import collections, hashlib, json, os, re, shutil, subprocess, sys, tempfile, zipfile
from pathlib import Path, PurePosixPath

ROOT = Path.cwd()
ARCHIVE = ROOT / "zip-upload-folder" / "Kimi_Agent_Direct Zip Download.zip"
DEST_REL = Path("src/pages/DesignIntelligence/ui-design-bundle")
EXPECTED_OUTER_SHA256 = "8a272ca2f3614e9247030eefe667b905b64512e025ae68a263d3ac9a637b0e6b"
EXPECTED_INNER_SHA256 = "6361469e05954db6b7a8ad4f4f05ad11826e2d8127f7c7e1522ca51e500dd687"
BUNDLE_ROOT_NAME = "motionzync-premium-ultra-ui-design-bundle"
MAX_ARCHIVE_BYTES = 50 * 1024 * 1024
MAX_EXTRACTED_BYTES = 200 * 1024 * 1024
MAX_ENTRIES = 20000
MAX_SINGLE_FILE_BYTES = 40 * 1024 * 1024
MAX_RATIO = 500
MACROS = {"BENTO","ROWS5","CARDS2","CARDS4","FLOATINGNODES","PARAGRAPHS","TIMELINEITEMS","FORMFIELDS","CARDS6","TABLEROWS"}

GENERATED_PARTS = r'''import React from "react";

const COPY = [
  { label: "Active workspace", value: "2,480", delta: "+12.8%", status: "On track" },
  { label: "Completion rate", value: "86.4%", delta: "+4.2%", status: "Improving" },
  { label: "Response time", value: "248 ms", delta: "−8.1%", status: "Healthy" },
  { label: "Open tasks", value: "124", delta: "−3.6%", status: "In progress" },
  { label: "Quality score", value: "94.8", delta: "+2.4%", status: "Strong" },
  { label: "New activity", value: "368", delta: "+9.7%", status: "Updated" },
];
const TASKS = [
  ["Review weekly activity", "Updated just now", "In review"],
  ["Confirm workspace access", "Updated 8 min ago", "Ready"],
  ["Resolve open requests", "Updated 18 min ago", "In progress"],
  ["Prepare quality summary", "Updated 32 min ago", "Queued"],
  ["Publish the next report", "Updated 1 hour ago", "Scheduled"],
];
const TIMELINE = [
  ["09:15", "Collection refreshed", "The latest sample records are available."],
  ["10:30", "Review completed", "Quality checks reached the target range."],
  ["11:45", "Team update", "Owners confirmed the next action."],
  ["13:20", "Snapshot captured", "The current view is ready for comparison."],
];
const FIELDS = [
  ["Workspace name", "Workspace Alpha"],
  ["Owner email", "owner@example.test"],
  ["Review notes", "Check the latest sample data"],
];
function seedIndex(seed = "motionzync") {
  let value = 0;
  for (const char of String(seed)) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}
function itemAt(items, seed, index) { return items[(seedIndex(seed) + index) % items.length]; }
function safeId(seed) { return String(seed || "sample").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 64); }
function Badge({ children, kind = "info" }) { return <span className={"mz-badge mz-badge--" + kind}>{children}</span>; }
function MetricCard({ seed, index = 0, wide = false }) {
  const item = itemAt(COPY, seed, index);
  return <article className={"mz-card" + (wide ? " mz-bento__cell--md" : "")}>
    <span className="mz-kicker">{item.label}</span>
    <strong className="mz-metric">{item.value}</strong>
    <p className="mz-note">{item.delta} against the previous sample period</p>
    <Badge kind={index % 3 === 0 ? "ok" : index % 3 === 1 ? "info" : "warn"}>{item.status}</Badge>
  </article>;
}
export function BENTO({ seed = "sample" }) {
  return <>
    <article className="mz-bento__cell mz-bento__cell--lg"><span className="mz-kicker">Performance overview</span><strong className="mz-metric">{itemAt(COPY, seed, 0).value}</strong><p className="mz-note">A focused view of the most important signals.</p><div className="mz-sparks" aria-label="Sample trend">{[42,65,52,84,71,92,76,98].map((height, i) => <span className="mz-spark" key={i} style={{ "--h": String(height) }} />)}</div></article>
    <article className="mz-bento__cell"><span className="mz-kicker">Completed</span><strong className="mz-metric">86.4%</strong><p className="mz-note">+4.2% this period</p></article>
    <article className="mz-bento__cell"><span className="mz-kicker">In progress</span><strong className="mz-metric">124</strong><p className="mz-note">Across active work</p></article>
    <article className="mz-bento__cell mz-bento__cell--md"><span className="mz-kicker">Next recommended step</span><h3>Review the latest change set</h3><p className="mz-note">Compare recent activity before publishing the next update.</p></article>
    <article className="mz-bento__cell"><span className="mz-kicker">Reliability</span><strong className="mz-metric">99.2%</strong><p className="mz-note">Within target range</p></article>
  </>;
}
export function ROWS5({ seed = "sample" }) {
  return <>{TASKS.map((task, i) => {
    const current = itemAt(TASKS, seed, i);
    return <div className="mz-row" key={String(seed) + "-row-" + i}><div><strong>{current[0]}</strong><p className="mz-note">{current[1]}</p></div><Badge kind={i % 3 === 0 ? "ok" : i % 3 === 1 ? "info" : "warn"}>{current[2]}</Badge></div>;
  })}</>;
}
export function CARDS2({ seed = "sample" }) { return <><MetricCard seed={seed} index={0} wide /><MetricCard seed={seed} index={1} /></>; }
export function CARDS4({ seed = "sample" }) { return <>{[0,1,2,3].map(i => <MetricCard key={String(seed) + "-card-" + i} seed={seed} index={i} />)}</>; }
export function CARDS6({ seed = "sample" }) { return <>{[0,1,2,3,4,5].map(i => <MetricCard key={String(seed) + "-card-" + i} seed={seed} index={i} />)}</>; }
export function FLOATINGNODES({ seed = "sample" }) {
  const nodes = [
    { x: 12, y: 18, title: "Input", detail: "Validated" },
    { x: 47, y: 12, title: "Process", detail: "Running" },
    { x: 30, y: 47, title: "Review", detail: "Needs attention" },
    { x: 66, y: 54, title: "Output", detail: "Ready" },
  ];
  const offset = seedIndex(seed) % 5;
  return <>{nodes.map((node, i) => <article className="mz-node" key={String(seed) + "-node-" + i} style={{ "--x": String((node.x + offset + i * 2) % 82), "--y": String((node.y + offset) % 76) }}><strong>{node.title}</strong><span>{node.detail}</span></article>)}</>;
}
export function PARAGRAPHS({ seed = "sample" }) {
  const first = itemAt(COPY, seed, 0);
  const second = itemAt(COPY, seed, 3);
  return <><p>The current snapshot tracks <strong>{first.label.toLowerCase()}</strong> at {first.value}. This sample narrative places the most relevant context close to the key result.</p><p>The latest comparison is {first.delta} for this period. Read it alongside {second.label.toLowerCase()} ({second.value}) instead of judging a single metric in isolation.</p><p className="mz-note">Sample guidance: confirm the underlying records and owners before turning this observation into an operational decision.</p></>;
}
export function TIMELINEITEMS({ seed = "sample" }) {
  return <>{TIMELINE.map((item, i) => <li className="mz-tl-item" key={String(seed) + "-timeline-" + i}><time dateTime={"2026-01-" + String(i + 5).padStart(2, "0") + "T" + item[0] + ":00"}>{item[0]}</time><strong>{item[1]}</strong><p className="mz-note">{item[2]}</p></li>)}</>;
}
export function FORMFIELDS({ seed = "sample" }) {
  const id = safeId(seed);
  return <>{FIELDS.map(([label, value], i) => {
    const fieldId = id + "-field-" + (i + 1);
    return <div className="mz-field" key={fieldId}><label htmlFor={fieldId}>{label}</label><input id={fieldId} className="mz-input" type={i === 1 ? "email" : "text"} defaultValue={value} autoComplete="off" /></div>;
  })}</>;
}
export function TABLEROWS({ seed = "sample" }) {
  return <>{TASKS.map((task, i) => {
    const item = itemAt(TASKS, seed, i);
    return <tr key={String(seed) + "-table-" + i}><th scope="row">{item[0]}</th><td>{item[2]}</td><td>{item[1]}</td></tr>;
  })}</>;
}
'''

SAFE_BUILD_PREVIEW = r'''#!/usr/bin/env node
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
'''

IMPORT_NOTE = """# Import preparation note

This asset pack is stored under src/pages/DesignIntelligence/ui-design-bundle/ so its README.md and package.json do not collide with MotionZync's repository-root files.

The original archive contained unresolved JSX references: BENTO, ROWS5, CARDS2, CARDS4, FLOATINGNODES, PARAGRAPHS, TIMELINEITEMS, FORMFIELDS, CARDS6, and TABLEROWS. Import preparation replaces those references with statically imported sample-data React parts in shared/parts/GeneratedParts.jsx. It also HTML-escapes manifest fields in the static-preview builder and strengthens validation against unresolved references.

This directory is an asset pack, not yet a live Design Intelligence route or catalog registration. Do not grant access based on these asset labels; continue to use the existing server-authoritative entitlement and API-key checks. Full human visual originality and real-device review remain UNVERIFIED.
"""

def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()

def validate_member(info: zipfile.ZipInfo):
    issues = []
    name = info.filename
    normalized = name.replace("\\", "/")
    if not name or "\x00" in name: issues.append("empty name or NUL byte")
    if normalized.startswith("/") or re.match(r"^[A-Za-z]:", normalized): issues.append("absolute path")
    if any(part in (".", "..") for part in normalized.split("/")): issues.append("path traversal segment")
    mode = (info.external_attr >> 16) & 0xFFFF
    if (mode & 0o170000) == 0o120000: issues.append("symlink entry")
    if info.flag_bits & 1: issues.append("encrypted entry")
    if info.file_size > MAX_SINGLE_FILE_BYTES: issues.append("single entry too large")
    if info.compress_size and info.file_size / info.compress_size > MAX_RATIO: issues.append("suspicious compression ratio")
    return issues

def check_archive(archive: zipfile.ZipFile):
    infos = archive.infolist()
    if len(infos) > MAX_ENTRIES: raise ValueError("ZIP exceeds entry-count cap")
    total = 0
    seen, folded = set(), {}
    for info in infos:
        for issue in validate_member(info): raise ValueError("unsafe ZIP member " + info.filename + ": " + issue)
        normalized = info.filename.replace("\\", "/").rstrip("/")
        if normalized in seen: raise ValueError("duplicate ZIP path: " + normalized)
        seen.add(normalized)
        lowered = normalized.casefold()
        if lowered in folded and folded[lowered] != normalized:
            raise ValueError("case-insensitive ZIP path collision: " + normalized)
        folded[lowered] = normalized
        total += info.file_size
    if total > MAX_EXTRACTED_BYTES: raise ValueError("ZIP exceeds extracted-size cap")
    corrupt = archive.testzip()
    if corrupt: raise ValueError("ZIP CRC/integrity failure in " + corrupt)
    return infos, total

def verify_bundle(bundle: Path):
    manifest = json.loads((bundle / "manifest.json").read_text(encoding="utf-8-sig"))
    designs, categories = manifest.get("designs"), manifest.get("categories")
    if not isinstance(designs, list) or len(designs) != 3600: raise ValueError("manifest must contain exactly 3,600 design entries")
    if not isinstance(categories, list) or len(categories) != 18: raise ValueError("manifest must contain 18 categories")
    ids = [d.get("id") for d in designs]
    if any(not isinstance(v, str) or not v for v in ids) or len(set(ids)) != len(ids): raise ValueError("manifest design IDs are missing or duplicated")
    counts = collections.defaultdict(collections.Counter)
    for d in designs:
        category, tier = d.get("category"), d.get("tier")
        if not isinstance(category, str) or tier not in ("premium", "ultra-premium"): raise ValueError("design has unknown category/tier")
        counts[category][tier] += 1
        for field in ("entry", "notes"):
            raw = d.get(field)
            if not isinstance(raw, str): raise ValueError("design missing " + field)
            p = PurePosixPath(raw)
            if p.is_absolute() or ".." in p.parts: raise ValueError("manifest path traversal: " + raw)
            target = (bundle / Path(*p.parts)).resolve()
            if not target.is_relative_to(bundle.resolve()) or not target.is_file(): raise ValueError("manifest path missing/outside bundle: " + raw)
        styles = d.get("styles")
        if not isinstance(styles, list) or not styles: raise ValueError("design has no styles")
        for raw in styles:
            p = PurePosixPath(raw)
            target = (bundle / Path(*p.parts)).resolve()
            if p.is_absolute() or ".." in p.parts or not target.is_relative_to(bundle.resolve()) or not target.is_file(): raise ValueError("missing/outside style path: " + raw)
        if not {"light", "dark", "colorful"}.issubset(set(d.get("themes", []))): raise ValueError("theme coverage missing for " + d["id"])
    category_ids = {c.get("id") for c in categories}
    if category_ids != set(counts): raise ValueError("manifest category IDs do not match the design entries")
    for c in categories:
        got = counts[c["id"]]
        if got["premium"] < 100 or got["ultra-premium"] < 100: raise ValueError("category/tier count below 100 for " + str(c["id"]))
    if manifest.get("totals", {}).get("designs") != 3600: raise ValueError("manifest totals.designs does not equal 3,600")
    return manifest, counts

def prepare(bundle: Path):
    manifest, counts = verify_bundle(bundle)
    helper = bundle / "shared" / "parts" / "GeneratedParts.jsx"
    helper.parent.mkdir(parents=True, exist_ok=True)
    helper.write_text(GENERATED_PARTS, encoding="utf-8")
    expression_pattern = re.compile(r"\{\s*([A-Z][A-Z0-9_]*)\s*\}")
    entries = {d["entry"]: d["id"] for d in manifest["designs"]}
    patched_components = 0
    for relative, design_id in entries.items():
        path = bundle / Path(*PurePosixPath(relative).parts)
        source = path.read_text(encoding="utf-8")
        used = sorted({m.group(1) for m in expression_pattern.finditer(source) if m.group(1) in MACROS})
        if not used: continue
        source = expression_pattern.sub(lambda m: "<" + m.group(1) + ' seed="' + design_id + '" />' if m.group(1) in MACROS else m.group(0), source)
        marker = 'import "./design.css";'
        if marker not in source: raise ValueError("missing component stylesheet import in " + relative)
        imported = "import {" + ", ".join(used) + '} from "../../../../shared/parts/GeneratedParts.jsx";'
        source = source.replace(marker, marker + "\n" + imported, 1)
        path.write_text(source, encoding="utf-8")
        patched_components += 1
    unresolved = []
    for path in (bundle / "designs").rglob("Design.jsx"):
        source = re.sub(r"/\*[\s\S]*?\*/|//[^\n]*", "", path.read_text(encoding="utf-8"))
        source = re.sub(r"^\s*import\s*\{[^}]+\}\s*from[^\n]*$", "", source, flags=re.M)
        for match in expression_pattern.finditer(source):
            if match.group(1) in MACROS: unresolved.append((str(path.relative_to(bundle)), match.group(1)))
    if unresolved: raise ValueError("unresolved JSX macro references remain: " + repr(unresolved[:5]))
    validator_path = bundle / "scripts" / "validate-bundle.mjs"
    validator = validator_path.read_text(encoding="utf-8")
    required_marker = '"shared/preview-shell/PreviewShell.jsx"'
    if '"shared/parts/GeneratedParts.jsx"' not in validator:
        if required_marker not in validator: raise ValueError("validator required-file list changed; refusing to patch")
        validator = validator.replace(required_marker, required_marker + ',"shared/parts/GeneratedParts.jsx"')
    old_code = '  const codeOnly = src.replace(/placeholder="[^"]*"/g, "");'
    new_code = old_code + '\n  const executableSource = codeOnly.replace(/\\/\\*[\\s\\S]*?\\*\\//g, "").replace(/^\\s*import\\s*\\{[^}]+\\}\\s*from[^\\n]*$/gm, "");\n  if (/\\{\\s*(BENTO|ROWS5|CARDS2|CARDS4|FLOATINGNODES|PARAGRAPHS|TIMELINEITEMS|FORMFIELDS|CARDS6|TABLEROWS)\\s*\\}/.test(executableSource)) fail("unresolved generated macro in " + p);'
    if "unresolved generated macro in " not in validator:
        if old_code not in validator: raise ValueError("validator source shape changed; refusing to patch")
        validator = validator.replace(old_code, new_code, 1)
    validator_path.write_text(validator, encoding="utf-8")
    (bundle / "scripts" / "build-preview.mjs").write_text(SAFE_BUILD_PREVIEW, encoding="utf-8")
    (bundle / "IMPORT_REVIEW.md").write_text(IMPORT_NOTE, encoding="utf-8")
    readme = bundle / "README.md"
    readme_text = readme.read_text(encoding="utf-8")
    addition = "## MotionZync repository location\n\nThis source pack lives under src/pages/DesignIntelligence/ui-design-bundle/. It is an asset pack only; Explorer/Generator catalog wiring is a separate controlled integration step.\n\n"
    if "## MotionZync repository location" not in readme_text and "## Contents" in readme_text:
        readme.write_text(readme_text.replace("## Contents", addition + "## Contents", 1), encoding="utf-8")
    for path in (bundle / "designs").rglob("Design.jsx"):
        source = path.read_text(encoding="utf-8")
        if 'from "../../../../shared/parts/GeneratedParts.jsx"' in source:
            resolved = (path.parent / "../../../../shared/parts/GeneratedParts.jsx").resolve()
            if resolved != helper.resolve(): raise ValueError("shared-part import path mismatch in " + str(path.relative_to(bundle)))
    return patched_components, counts

def syntax_check_jsx(bundle: Path):
    js = r'''import { transform } from "esbuild";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
const root = resolve(process.argv[1]);
function walk(dir) { return readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; }); }
const files = walk(join(root, "designs")).filter((p) => p.endsWith(".jsx"));
files.push(join(root, "shared/parts/GeneratedParts.jsx"), join(root, "shared/preview-shell/PreviewShell.jsx"));
for (const file of files) await transform(readFileSync(file, "utf8"), { loader: "jsx", target: "es2020", sourcefile: file });
console.log("JSX_PARSE_PASS files=" + files.length);
'''
    subprocess.run(["node", "--input-type=module", "-e", js, str(bundle)], cwd=ROOT, check=True)

def import_safe():
    if not ARCHIVE.is_file(): raise ValueError("expected upload ZIP not found: " + str(ARCHIVE.relative_to(ROOT)))
    raw_outer = ARCHIVE.read_bytes()
    if len(raw_outer) > MAX_ARCHIVE_BYTES: raise ValueError("outer ZIP exceeds size cap")
    if sha256_bytes(raw_outer) != EXPECTED_OUTER_SHA256: raise ValueError("outer ZIP SHA-256 differs from reviewed archive; stop and re-audit")
    with tempfile.TemporaryDirectory(prefix="motionzync-di-bundle-import-") as tmp:
        temp = Path(tmp)
        outer_path = temp / "outer.zip"
        outer_path.write_bytes(raw_outer)
        with zipfile.ZipFile(outer_path) as outer:
            outer_infos, _ = check_archive(outer)
            outer_files = [i for i in outer_infos if not i.is_dir()]
            if len(outer_files) != 1 or outer_files[0].filename != "motionzync-premium-ultra-ui-design-bundle.zip":
                raise ValueError("outer ZIP structure changed; expected exactly one known inner ZIP")
            inner_bytes = outer.read(outer_files[0])
        if sha256_bytes(inner_bytes) != EXPECTED_INNER_SHA256: raise ValueError("inner ZIP SHA-256 differs from reviewed archive; stop and re-audit")
        inner_path = temp / "inner.zip"
        inner_path.write_bytes(inner_bytes)
        with zipfile.ZipFile(inner_path) as inner:
            infos, _ = check_archive(inner)
            files = [i for i in infos if not i.is_dir()]
            roots = {PurePosixPath(i.filename.replace("\\", "/")).parts[0] for i in files}
            if roots != {BUNDLE_ROOT_NAME}: raise ValueError("inner ZIP root changed; explicit path mapping review required")
            bundle = temp / "prepared-pack"
            bundle.mkdir()
            for info in files:
                parts = PurePosixPath(info.filename.replace("\\", "/")).parts
                if len(parts) < 2 or parts[0] != BUNDLE_ROOT_NAME: raise ValueError("unexpected ZIP path: " + info.filename)
                rel = Path(*parts[1:])
                dest = (bundle / rel).resolve()
                if not dest.is_relative_to(bundle.resolve()): raise ValueError("ZIP entry escapes staging folder")
                dest.parent.mkdir(parents=True, exist_ok=True)
                with inner.open(info) as src, dest.open("wb") as dst: shutil.copyfileobj(src, dst, 1024 * 1024)
        patched, counts = prepare(bundle)
        subprocess.run(["node", str(bundle / "scripts" / "validate-bundle.mjs"), str(bundle)], cwd=ROOT, check=True)
        subprocess.run(["node", str(bundle / "scripts" / "build-preview.mjs")], cwd=ROOT, check=True, env={**os.environ, "MZ_BUNDLE_BUILD_ROOT": str(bundle)})
        # Run the safely inspected builder in its own directory so its relative output is confined to the staging pack.
        subprocess.run(["node", str(bundle / "scripts" / "build-preview.mjs")], cwd=bundle, check=True)
        syntax_check_jsx(bundle)
        manifest = json.loads((bundle / "manifest.json").read_text(encoding="utf-8"))
        for design in manifest["designs"]:
            for field in ("entry", "notes", "styles"):
                values = design[field] if field == "styles" else [design[field]]
                for raw in values:
                    p = (bundle / Path(*PurePosixPath(raw).parts)).resolve()
                    if not p.is_relative_to(bundle.resolve()) or not p.is_file(): raise ValueError("final manifest path check failed: " + raw)
        target = ROOT / DEST_REL
        staged_files = sorted(p.relative_to(bundle).as_posix() for p in bundle.rglob("*") if p.is_file())
        if target.exists():
            target_files = sorted(p.relative_to(target).as_posix() for p in target.rglob("*") if p.is_file())
            extras = sorted(set(target_files) - set(staged_files))
            if extras: raise ValueError("destination contains unexpected files; refusing deletion/overwrite: " + ", ".join(extras[:10]))
            for rel in sorted(set(target_files) & set(staged_files)):
                if sha256_bytes((target / rel).read_bytes()) != sha256_bytes((bundle / rel).read_bytes()):
                    raise ValueError("destination file differs; refusing overwrite: " + rel)
            for rel in sorted(set(staged_files) - set(target_files)):
                dest = target / rel
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(bundle / rel, dest)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copytree(bundle, target)
        print("BUNDLE_IMPORT_PREPARE_PASS")
        print("Verified exact outer/inner ZIP hashes and archive safety checks.")
        print("Manifest entries: " + str(len(manifest["designs"])) + " across " + str(len(manifest["categories"])) + " categories.")
        print("Components repaired with static shared parts: " + str(patched))
        print("Files prepared: " + str(len(staged_files)) + " at " + DEST_REL.as_posix())
        print("Human visual originality remains UNVERIFIED; bundle is not yet wired into Explorer/Generator.")

if __name__ == "__main__":
    try: import_safe()
    except Exception as exc:
        print("BUNDLE_IMPORT_BLOCKED: " + type(exc).__name__ + ": " + str(exc), file=sys.stderr)
        raise SystemExit(2)
