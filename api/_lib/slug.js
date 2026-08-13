// api/_lib/slug.js
// ============================================================
// Shared slug utilities. Used by:
//   - scripts/migrate-animations.mjs (one-time migration)
//   - api/admin-animations.js (every new animation/category from now on)
// Keeping this in one place guarantees a new animation created via the
// Admin panel ends up with a filename in exactly the same style as the
// 175 migrated ones.
// ============================================================

/** Turn "Cosmic Neon Orbit" -> "cosmic-neon-orbit" */
export function slugify(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')   // strip accents
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item'
}

/** Turn "Floating UI" -> "Floating-UI" (folder name keeps original casing, spaces -> hyphens) */
export function folderify(str) {
  return String(str || '')
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'General'
}

/**
 * Given a desired slug and a Set of slugs already used (within the same
 * category), return a guaranteed-unique slug by appending -2, -3, ... on
 * collision. Mutates `usedSet` by adding the returned slug.
 */
export function uniqueSlug(desired, usedSet) {
  let slug = desired
  let n = 2
  while (usedSet.has(slug)) {
    slug = `${desired}-${n}`
    n += 1
  }
  usedSet.add(slug)
  return slug
}
