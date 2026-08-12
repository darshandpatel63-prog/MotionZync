// src/utils/exportAnimations.js — MotionZync Admin
// "Export All (ZIP)" feature: saves EVERY animation (title, category,
// description, tags, previewBg, cssCode, jsCode, timestamps, etc.) into
// one ZIP — organized by category, with a runnable preview.html per
// animation + a master JSON/CSV index at the root.
//
// JSZip is loaded with a dynamic import() so its ~95KB is fetched ONLY
// the moment an admin clicks "Export All" — it never touches the app's
// normal bundle size for visitors or even for the rest of the Admin page.

/** Turns a title/category into a filesystem-safe folder/file name. */
function slugify(str = '') {
  return (
    String(str)
      .trim()
      .replace(/[\\/:*?"<>|]+/g, '')   // strip Windows/Unix-illegal chars
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60) || 'untitled'
  )
}

/** Appends -2, -3... if two animations slugify to the same folder name. */
function uniqueSlug(base, used) {
  let slug = base
  let n = 2
  while (used.has(slug)) {
    slug = `${base}-${n}`
    n++
  }
  used.add(slug)
  return slug
}

function csvEscape(v) {
  const s = String(v ?? '').replace(/"/g, '""')
  return /[",\n]/.test(s) ? `"${s}"` : s
}

/** Firestore Timestamp | Date | string -> ISO string (safe on all three). */
function toISO(v) {
  if (!v) return ''
  if (typeof v === 'object' && typeof v.seconds === 'number') {
    return new Date(v.seconds * 1000).toISOString()
  }
  const d = new Date(v)
  return isNaN(d) ? '' : d.toISOString()
}

/** Standalone HTML so a downloaded animation can be opened directly in a browser. */
function buildPreviewHtml(a) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${(a.title || 'MotionZync Animation').replace(/</g, '&lt;')} — Preview</title>
<style>
html, body { margin:0; height:100%; overflow:hidden; background:${a.previewBg || '#0a0a0f'}; }
${a.cssCode || ''}
</style>
</head>
<body>
${a.jsCode ? `<script>\n${a.jsCode}\n<\/script>` : ''}
</body>
</html>
`
}

function buildReadme(count) {
  return `MotionZync — Full Animations Export
Generated: ${new Date().toLocaleString('en-IN')}
Total animations: ${count}

CONTENTS
────────────────────────────────────────────
all-animations.json   All animations, full data + code, in one file
all-animations.csv    Same data as a spreadsheet (Excel / Google Sheets)
animations/<Category>/<Animation-Title>/
  ├─ info.json         This animation's metadata (title, category, tags, dates...)
  ├─ style.css         CSS code
  ├─ script.js         JS code (only present if the animation uses JS)
  └─ preview.html      Double-click → opens in any browser, animation runs live
`
}

/**
 * Builds a ZIP of every animation passed in and triggers a browser download.
 * @param {Array} animations   Full animation objects (as returned by getAnimations()).
 * @param {Object} opts
 * @param {(percent:number)=>void} [opts.onProgress]  0–100 progress callback.
 * @returns {Promise<{filename:string, count:number, sizeBytes:number}>}
 */
export async function exportAnimationsAsZip(animations, { onProgress } = {}) {
  if (!animations || animations.length === 0) {
    throw new Error('Export karva mate koi animation nathi.')
  }

  const { default: JSZip } = await import('jszip')
  const zip  = new JSZip()
  const root = zip.folder('MotionZync-Animations')
  const used = new Set()

  // ── Master index: full JSON dump (every field, every animation) ──
  const fullData = animations.map(a => ({
    docId:       a.docId,
    title:       a.title || '',
    description: a.description || '',
    category:    a.category || '',
    previewBg:   a.previewBg || '',
    tags:        a.tags || [],
    views:       a.views || 0,
    cssCode:     a.cssCode || '',
    jsCode:      a.jsCode || '',
    createdAt:   toISO(a.createdAt),
    updatedAt:   toISO(a.updatedAt),
  }))
  root.file('all-animations.json', JSON.stringify(fullData, null, 2))

  // ── Master index: CSV (no code — quick spreadsheet scan) ──
  const csvHeader = ['Title', 'Category', 'Description', 'Tags', 'Views', 'CreatedAt', 'UpdatedAt', 'DocId']
  const csvRows = fullData.map(a =>
    [a.title, a.category, a.description, a.tags.join('|'), a.views, a.createdAt, a.updatedAt, a.docId]
      .map(csvEscape)
      .join(',')
  )
  root.file('all-animations.csv', [csvHeader.join(','), ...csvRows].join('\n'))
  root.file('README.txt', buildReadme(animations.length))

  // ── Per-animation folders, grouped by category ──
  const animFolder = root.folder('animations')
  animations.forEach((a, i) => {
    const catSlug  = slugify(a.category || 'Uncategorized')
    const baseSlug = slugify(a.title || `animation-${i + 1}`)
    const slug     = uniqueSlug(`${catSlug}/${baseSlug}`, used)
    const folder   = animFolder.folder(slug)

    folder.file('info.json', JSON.stringify(fullData[i], null, 2))
    folder.file('style.css', a.cssCode || '/* no CSS */')
    if (a.jsCode && a.jsCode.trim()) folder.file('script.js', a.jsCode)
    folder.file('preview.html', buildPreviewHtml(a))

    // Building the in-memory folder tree = 0–60% of progress
    onProgress?.(Math.round(((i + 1) / animations.length) * 60))
  })

  // Compressing + serializing = remaining 60–100%
  const blob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    meta => onProgress?.(60 + Math.round(meta.percent * 0.4))
  )

  const stamp    = new Date().toISOString().slice(0, 10)
  const filename = `MotionZync-Animations-${stamp}.zip`

  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 4000)

  return { filename, count: animations.length, sizeBytes: blob.size }
}
