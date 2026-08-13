// scripts/migrate-animations.mjs
// ============================================================
// ONE-TIME migration: converts a Firestore export (all-animations.json,
// the same shape MotionZync's old export tool produces) into the new
// GitHub-native structure:
//
//   public/animations/<Category>/<slug>.json   — one file per animation
//   public/animations/manifest.json            — full list, site fetches this
//   public/animations/categories.json          — category names + order
//   public/sitemap-new.xml                     — regenerated with all animation URLs
//
// Usage:
//   node scripts/migrate-animations.mjs <path-to-all-animations.json>
//
// Safe to re-run: it fully regenerates the animations/ folder each time
// from the given source file, so it never leaves stale/duplicate files
// behind. Only ever run this once against your real Firestore export —
// after that, all new animations go through the Admin panel instead.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { slugify, folderify, uniqueSlug } from '../api/_lib/slug.js'
import { buildSitemapXML } from '../api/_lib/sitemap.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const srcPath = process.argv[2]
if (!srcPath) {
  console.error('Usage: node scripts/migrate-animations.mjs <path-to-all-animations.json>')
  process.exit(1)
}

// Known data-quality fix from the original export (comma got mangled in place of "&")
const CATEGORY_NAME_FIXES = {
  'Form , Security': 'Form & Security',
}

function cleanCategoryName(raw) {
  return CATEGORY_NAME_FIXES[raw] || raw
}

const raw = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
console.log(`Loaded ${raw.length} animations from ${srcPath}`)

// ── Build category list (alphabetical order by default; reorder anytime
//    later from the Admin panel — this only sets the starting order) ──
const categoryNames = [...new Set(raw.map(a => cleanCategoryName(a.category || 'General')))].sort()
const categories = categoryNames.map((name, i) => ({
  docId: slugify(name),
  name,
  folder: folderify(name),
  order: i,
}))
const folderByName = Object.fromEntries(categories.map(c => [c.name, c.folder]))

// ── Convert each animation, guaranteeing a unique slug per category folder ──
const usedSlugsByFolder = {}
const animationsOutDir = path.join(ROOT, 'public', 'animations')

// wipe + recreate so re-runs never leave stale files
fs.rmSync(animationsOutDir, { recursive: true, force: true })
fs.mkdirSync(animationsOutDir, { recursive: true })

const manifest = []

for (const a of raw) {
  const category = cleanCategoryName(a.category || 'General')
  const folder = folderByName[category]
  usedSlugsByFolder[folder] = usedSlugsByFolder[folder] || new Set()
  const slug = uniqueSlug(slugify(a.title), usedSlugsByFolder[folder])

  const entry = {
    docId: a.docId,
    slug,
    title: a.title || 'Untitled',
    description: a.description || '',
    category,
    previewBg: a.previewBg || '#0a0a0a',
    tags: Array.isArray(a.tags) ? a.tags : [],
    cssCode: a.cssCode || '',
    jsCode: a.jsCode || '',
    createdAt: a.createdAt || new Date().toISOString(),
    updatedAt: a.updatedAt || a.createdAt || new Date().toISOString(),
  }

  const folderDir = path.join(animationsOutDir, folder)
  fs.mkdirSync(folderDir, { recursive: true })
  fs.writeFileSync(path.join(folderDir, `${slug}.json`), JSON.stringify(entry, null, 2))

  manifest.push(entry)
}

// newest first, matches the site's default "Newest" sort
manifest.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

fs.writeFileSync(path.join(animationsOutDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
fs.writeFileSync(path.join(animationsOutDir, 'categories.json'), JSON.stringify(categories, null, 2))

// ── Sitemap ──
const today = new Date().toISOString().slice(0, 10)
const sitemapXML = buildSitemapXML(manifest, today)
fs.writeFileSync(path.join(ROOT, 'public', 'sitemap-new.xml'), sitemapXML)

// ── Summary ──
console.log('\nDone.')
console.log(`  Categories : ${categories.length}`)
for (const c of categories) {
  const count = manifest.filter(m => m.category === c.name).length
  console.log(`    - ${c.name} (${c.folder}/) : ${count}`)
}
console.log(`  Animations : ${manifest.length}`)
console.log(`  Manifest   : public/animations/manifest.json`)
console.log(`  Sitemap    : public/sitemap-new.xml (${manifest.length + 20} urls)`)

