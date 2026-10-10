#!/usr/bin/env python3
"""Read-only audit and safe scratch extraction for MotionZync's incoming UI bundle ZIP."""
from __future__ import annotations
import collections, hashlib, json, re, shutil, subprocess, sys, tempfile, zipfile
from pathlib import Path, PurePosixPath

ROOT = Path.cwd()
ARCHIVE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "zip-upload-folder" / "Kimi_Agent_Direct Zip Download.zip"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "bundle-audit-output"
MAX_ARCHIVE_BYTES, MAX_EXTRACTED_BYTES, MAX_ENTRIES = 50*1024*1024, 600*1024*1024, 30000
MAX_SINGLE_FILE_BYTES, MAX_COMPRESSION_RATIO = 40*1024*1024, 500

def sha256_file(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024*1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def tracked_paths():
    try:
        result = subprocess.run(["git","ls-files","-z"], cwd=ROOT, capture_output=True, check=True).stdout
        return {v.decode("utf-8","replace") for v in result.split(b"\0") if v}
    except Exception:
        return set()

def validate_member(info):
    issues, raw = [], info.filename
    normalized = raw.replace("\\","/")
    path = PurePosixPath(normalized)
    if not raw or "\x00" in raw: issues.append("empty name or NUL byte")
    if normalized.startswith("/") or re.match(r"^[A-Za-z]:", normalized): issues.append("absolute path")
    if any(p in (".","..") for p in normalized.split("/")): issues.append("dot/dot-dot path segment")
    mode = (info.external_attr >> 16) & 0xFFFF
    if (mode & 0o170000) == 0o120000: issues.append("symbolic link entry")
    if info.flag_bits & 0x1: issues.append("encrypted entry")
    if info.file_size > MAX_SINGLE_FILE_BYTES: issues.append("file exceeds configured size cap")
    if info.file_size and not info.compress_size: issues.append("non-empty entry has zero compressed size")
    if info.compress_size and info.file_size/info.compress_size > MAX_COMPRESSION_RATIO: issues.append("suspicious compression ratio")
    if len(str(path)) > 240: issues.append("path exceeds 240 characters")
    return issues

def manifest_lists(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if isinstance(child, list) and child and all(isinstance(i, dict) for i in child):
                if any(any(k in i for k in ("id","designId","design_id")) for i in child):
                    yield key, child
            yield from manifest_lists(child)
    elif isinstance(value, list):
        for child in value: yield from manifest_lists(child)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    lines = ["# MotionZync incoming design ZIP — read-only audit", "",
             "Archive: " + (ARCHIVE.relative_to(ROOT).as_posix() if ARCHIVE.is_relative_to(ROOT) else ARCHIVE.name),
             "Import/commit: NOT performed by this audit run"]
    inventory_file = OUT / "archive-file-inventory.txt"
    if not ARCHIVE.is_file():
        lines += ["", "RESULT: BLOCKED — ZIP was not found.", ""]
        (OUT/"report.md").write_text("\n".join(lines), encoding="utf-8")
        print("\n".join(lines)); return 2
    size, digest = ARCHIVE.stat().st_size, sha256_file(ARCHIVE)
    lines += [f"Compressed size: {size:,} bytes", f"SHA-256: {digest}"]
    if size > MAX_ARCHIVE_BYTES:
        lines += ["", f"RESULT: BLOCKED — compressed size exceeds {MAX_ARCHIVE_BYTES:,} bytes.", ""]
        (OUT/"report.md").write_text("\n".join(lines), encoding="utf-8")
        print("\n".join(lines)); return 2
    try: zf = zipfile.ZipFile(ARCHIVE)
    except Exception as exc:
        lines += ["", f"RESULT: BLOCKED — ZIP unreadable ({type(exc).__name__}).", ""]
        (OUT/"report.md").write_text("\n".join(lines), encoding="utf-8")
        print("\n".join(lines)); return 2

    with zf:
        infos = zf.infolist()
        issues, exact, folded = [], set(), {}
        total = 0
        for item in infos:
            for issue in validate_member(item): issues.append((item.filename, issue))
            normalized = item.filename.replace("\\","/").rstrip("/")
            if normalized in exact: issues.append((item.filename, "duplicate archive path"))
            exact.add(normalized)
            key = normalized.casefold()
            if key in folded and folded[key] != normalized:
                issues.append((item.filename, "case-insensitive collision with " + folded[key]))
            else: folded[key] = normalized
            total += item.file_size
        files = [i for i in infos if not i.is_dir()]
        top = sorted({i.filename.replace("\\","/").split("/",1)[0] for i in infos if i.filename})
        lines += ["", "## Archive structure", "", f"Entries: {len(infos):,}; files: {len(files):,}; folders: {len(infos)-len(files):,}",
                  f"Declared expanded size: {total:,} bytes", "", "Top-level entries:"]
        lines += ["- " + v for v in top[:100]] or ["- (empty)"]
        exts = collections.Counter(Path(i.filename).suffix.lower() or "(no extension)" for i in files)
        lines += ["", "## File types", "", "| Extension | Count |", "|---|---:|"]
        lines += [f"| {ext} | {count} |" for ext,count in exts.most_common(40)]
        candidate_names = {"readme.md","manifest.json","design-manifest.json","package.json","compatibility.md",
                           "validate-bundle.mjs","index.html","vite.config.js","vite.config.ts","catalog.json","designs.json"}
        candidates = sorted(i.filename for i in files if Path(i.filename).name.lower() in candidate_names
                            or "manifest" in Path(i.filename).name.lower())
        lines += ["", "## README / manifest / package files", ""]
        lines += ["- " + v for v in candidates[:150]] or ["- No common manifest/package filenames found."]
        if len(infos) > MAX_ENTRIES: issues.append(("<archive>", f"entry count exceeds {MAX_ENTRIES}"))
        if total > MAX_EXTRACTED_BYTES: issues.append(("<archive>", "declared extracted size exceeds configured cap"))
        if issues:
            lines += ["", "## Safety issues", ""]
            lines += [f"- {path} — {issue}" for path,issue in issues[:100]]
            if len(issues)>100: lines.append(f"- ... and {len(issues)-100} more")
            inventory_file.write_text("\n".join(sorted(i.filename for i in infos))+"\n", encoding="utf-8")
            lines += ["", "RESULT: BLOCKED — unsafe/ambiguous archive entries detected; nothing extracted.", ""]
            (OUT/"report.md").write_text("\n".join(lines), encoding="utf-8")
            print("\n".join(lines)); return 2

        scratch = Path(tempfile.mkdtemp(prefix="motionzync-di-zip-audit-"))
        extracted = scratch/"bundle"; extracted.mkdir(parents=True)
        try:
            for item in files:
                dest = extracted.joinpath(*PurePosixPath(item.filename.replace("\\","/")).parts)
                if not dest.resolve().is_relative_to(extracted.resolve()): raise ValueError("entry would escape extraction root")
                dest.parent.mkdir(parents=True, exist_ok=True)
                with zf.open(item) as src, dest.open("wb") as dst: shutil.copyfileobj(src,dst,1024*1024)
            inventory = sorted(p.relative_to(extracted).as_posix() for p in extracted.rglob("*") if p.is_file())
            inventory_file.write_text("\n".join(inventory)+"\n", encoding="utf-8")
            roots = collections.Counter(v.split("/",1)[0] for v in inventory if "/" in v)
            lines += ["", "## Bundle root candidate", ""]
            lines.append("- All nested files use top folder " + next(iter(roots)) + "; stripping it is a candidate only." if len(roots)==1 else "- Multiple roots/root-level files detected; an explicit mapping will be required.")
            summaries = []
            for path in extracted.rglob("*.json"):
                rel = path.relative_to(extracted).as_posix()
                name = path.name.lower()
                if "manifest" not in name and name not in {"package.json","catalog.json","designs.json"}: continue
                if path.stat().st_size > 10*1024*1024:
                    summaries.append(f"- {rel}: skipped JSON parse (>10 MiB)."); continue
                try: value = json.loads(path.read_text(encoding="utf-8-sig"))
                except Exception as exc:
                    summaries.append(f"- {rel}: INVALID JSON ({type(exc).__name__})."); continue
                if name == "package.json" and isinstance(value,dict):
                    deps,dev = value.get("dependencies",{}),value.get("devDependencies",{})
                    summaries.append(f"- {rel}: package={value.get('name','(unnamed)')}; scripts={len(value.get('scripts',{})) if isinstance(value.get('scripts',{}),dict) else 0}; dependencies={len(deps) if isinstance(deps,dict) else 0}; devDependencies={len(dev) if isinstance(dev,dict) else 0}.")
                collections_found = list(manifest_lists(value))
                if collections_found:
                    ids=[]
                    for _,collection in collections_found:
                        ids += [str(i.get("id") or i.get("designId") or i.get("design_id")) for i in collection
                                if i.get("id") or i.get("designId") or i.get("design_id")]
                    count=sum(len(v) for _,v in collections_found)
                    summaries.append(f"- {rel}: recognized design-like entries={count:,}; IDs={len(ids):,}; duplicate IDs in recognized lists={len(ids)-len(set(ids)):,}.")
                elif name != "package.json": summaries.append(f"- {rel}: valid JSON; no obvious design-entry list.")
            lines += ["", "## Manifest / package signals", ""] + (summaries[:100] or ["- No parseable manifest/catalog/package JSON detected."])
            tracked = tracked_paths()
            checks=[("all paths",inventory)]
            if len(roots)==1:
                prefix=next(iter(roots))+"/"
                checks.append(("strip one top folder", [v[len(prefix):] for v in inventory if v.startswith(prefix)]))
            lines += ["", "## Existing repository collision hints", ""]
            for label, paths in checks:
                collisions=[v for v in paths if v in tracked]
                lines.append(f"- {label}: {len(collisions)} exact path collision(s) among {len(paths)} candidate files.")
                lines += ["  - "+v for v in collisions[:15]]
                if len(collisions)>15: lines.append(f"  - ... and {len(collisions)-15} more")
            secret_patterns=[re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
                             re.compile(r"\bgithub_pat_[A-Za-z0-9_]{20,}\b|\bgh[pousr]_[A-Za-z0-9]{30,}\b"),
                             re.compile(r"\bAKIA[0-9A-Z]{16}\b")]
            exec_patterns=[re.compile(r"\beval\s*\("),re.compile(r"\bnew\s+Function\s*\("),
                           re.compile(r"dangerouslySetInnerHTML"),re.compile(r"<script[^>]+src\s*=\s*['\"]https?://",re.I)]
            risky_secret, risky_exec=set(),set()
            for p in extracted.rglob("*"):
                if not p.is_file() or p.stat().st_size>2*1024*1024 or p.suffix.lower() not in {".js",".jsx",".mjs",".cjs",".ts",".tsx",".json",".html",".md",".txt",".css"}: continue
                try: source=p.read_text(encoding="utf-8")
                except (UnicodeDecodeError,OSError): continue
                rel=p.relative_to(extracted).as_posix()
                if any(expr.search(source) for expr in secret_patterns): risky_secret.add(rel)
                if p.suffix.lower() in {".js",".jsx",".mjs",".cjs",".ts",".tsx",".html"} and any(expr.search(source) for expr in exec_patterns): risky_exec.add(rel)
            lines += ["", "## Heuristic source-risk scan", "",
                      f"- Files with private-key/token-like signatures: {len(risky_secret)}. Only paths are shown; matched values are never printed."]
            lines += ["  - "+v for v in sorted(risky_secret)[:25]]
            lines.append(f"- Files with dynamic-execution or remote-script patterns: {len(risky_exec)}. Review source before integration.")
            lines += ["  - "+v for v in sorted(risky_exec)[:25]]
            lines += ["", "## Import decision", "",
                      "NOT APPROVED FOR IMPORT YET. This was a safe scratch extraction and audit only. An explicit path map and conflict policy must be reviewed before copying anything into app paths. No app source files or database records were changed.", ""]
        except Exception as exc:
            lines += ["", f"RESULT: BLOCKED — scratch inspection failed safely ({type(exc).__name__}); no app files imported.", ""]
            (OUT/"report.md").write_text("\n".join(lines),encoding="utf-8"); print("\n".join(lines)); return 2
        finally: shutil.rmtree(scratch,ignore_errors=True)
    (OUT/"report.md").write_text("\n".join(lines),encoding="utf-8")
    print("\n".join(lines)); print("\nFull inventory saved as workflow artifact.")
    return 0

if __name__ == "__main__": raise SystemExit(main())
