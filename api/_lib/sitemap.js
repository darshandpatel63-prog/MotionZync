// api/_lib/sitemap.js
// ============================================================
// Builds public/sitemap-new.xml from scratch every time an animation is
// added / edited / deleted, so it always matches what's actually live.
//
// NOTE: the STATIC_PAGES block below is the site's fixed pages (home,
// gallery, legal pages, etc). If you ever add a brand-new static route
// to the app (not an animation), add one entry here too — this file is
// the single source of truth for the sitemap from now on.
// ============================================================

export const SITE_URL = 'https://motion-zync.vercel.app'

const STATIC_PAGES = [
  { path: '/',                 freq: 'weekly',  pri: '1.0' },
  { path: '/gallery',          freq: 'daily',   pri: '0.9' },
  { path: '/playground',       freq: 'weekly',  pri: '0.9' },
  { path: '/anim-creator',     freq: 'monthly', pri: '0.9' },
  { path: '/codespace',        freq: 'monthly', pri: '0.8' },
  { path: '/compare',          freq: 'weekly',  pri: '0.7' },
  { path: '/course',           freq: 'weekly',  pri: '0.8' },
  { path: '/how-to-use',       freq: 'monthly', pri: '0.8' },
  { path: '/tool-guide',       freq: 'monthly', pri: '0.7' },
  { path: '/why-features',     freq: 'monthly', pri: '0.6' },
  { path: '/wallpaper',        freq: 'weekly',  pri: '0.7' },
  { path: '/submit',           freq: 'monthly', pri: '0.6' },
  { path: '/favorites',        freq: 'weekly',  pri: '0.5' },
  { path: '/changelog',        freq: 'weekly',  pri: '0.6' },
  { path: '/tools',            freq: 'monthly', pri: '0.6' },
  { path: '/about.html',       freq: 'monthly', pri: '0.6' },
  { path: '/contact.html',     freq: 'monthly', pri: '0.6' },
  { path: '/privacy.html',     freq: 'yearly',  pri: '0.4' },
  { path: '/terms.html',       freq: 'yearly',  pri: '0.4' },
  { path: '/disclaimer.html',  freq: 'yearly',  pri: '0.4' },
]

function urlBlock(loc, lastmod, freq, pri) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`
}

/**
 * @param {Array} animations - full manifest array (each needs docId + updatedAt/createdAt)
 * @param {string} todayISO - e.g. "2026-08-12" used as lastmod for static pages
 */
export function buildSitemapXML(animations, todayISO) {
  const staticXML = STATIC_PAGES
    .map(p => urlBlock(`${SITE_URL}${p.path}`, todayISO, p.freq, p.pri))
    .join('\n\n')

  const animXML = animations
    .map(a => urlBlock(
      `${SITE_URL}/animation/${a.docId}`,
      String(a.updatedAt || a.createdAt || todayISO).slice(0, 10),
      'weekly',
      '0.7'
    ))
    .join('\n\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- ══════════════════════════════════════════
       CORE + TOOL + LEGAL PAGES
  ══════════════════════════════════════════ -->

${staticXML}

  <!-- ══════════════════════════════════════════
       ANIMATION PAGES — auto-generated on every Admin save.
       Do not edit this block by hand, it will be overwritten.
  ══════════════════════════════════════════ -->

${animXML}

</urlset>
`
}
