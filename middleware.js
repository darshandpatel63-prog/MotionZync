// middleware.js  (Vercel Routing Middleware — https://vercel.com/docs/routing-middleware)
// ============================================================
// Runs ONLY for /animation/:id requests (see `matcher` below).
//
// Why this exists: MotionZync is a client-rendered SPA. useSEO.js
// (src/hooks/useSEO.js) sets a unique <title>/description per animation,
// but only AFTER React has loaded and run — fine for Googlebot (it does
// execute JS), not fine for bots that never run JS at all: some AdSense
// crawling, link-preview bots (WhatsApp, Slack, Discord, Telegram...),
// and some SEO tools. Those would otherwise only ever see index.html's
// generic homepage title for every single animation page.
//
// This intercepts ONLY requests whose User-Agent matches a known bot and
// returns a small, fast HTML snippet with the correct per-animation
// meta tags — the same "bot fallback content" idea already used in
// index.html, just made per-animation instead of generic. Everyone else
// (real visitors) is untouched — next() sends them straight to the
// normal React app, unchanged.
//
// Safety: anything unexpected in here (bad data, a network hiccup
// reading the manifest, etc.) falls back to next(), so this can only
// ever ADD bot visibility — it can't break a real visitor's page.
//
// To verify after deploy:
//   curl -A "Googlebot" https://motion-zync.vercel.app/animation/<some-docId>
// You should see the animation's own <title> in the response HTML.
// ============================================================

import { next } from '@vercel/functions'

export const config = { matcher: '/animation/:id' }

const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|linkedinbot|slackbot|discordbot|embedly|quora|pinterest|redditbot|applebot|bingpreview|adsbot-google/i

function escapeHTML(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))
}

export default async function middleware(request) {
  try {
    const ua = request.headers.get('user-agent') || ''
    if (!BOT_UA.test(ua)) return next()

    const url = new URL(request.url)
    const id = url.pathname.split('/').filter(Boolean).pop()
    if (!id) return next()

    const manifestRes = await fetch(new URL('/animations/manifest.json', url.origin))
    if (!manifestRes.ok) return next()
    const manifest = await manifestRes.json()
    const anim = manifest.find(a => a.docId === id)
    if (!anim) return next() // unknown id — let the normal app show its "not found" state

    const title = `${anim.title} — Free ${anim.category} CSS/JS Animation | MotionZync`
    const description = anim.description?.trim()
      || `${anim.title} — a free, copy-paste ready ${anim.category} animation from MotionZync. Live preview with full CSS & JS source included.`
    const pageUrl = `${url.origin}/animation/${anim.docId}`

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description)}"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${escapeHTML(title)}"/>
<meta property="og:description" content="${escapeHTML(description)}"/>
<meta property="og:url" content="${escapeHTML(pageUrl)}"/>
<meta property="og:site_name" content="MotionZync"/>
<meta name="twitter:card" content="summary"/>
<meta name="twitter:title" content="${escapeHTML(title)}"/>
<meta name="twitter:description" content="${escapeHTML(description)}"/>
<link rel="canonical" href="${escapeHTML(pageUrl)}"/>
</head>
<body>
<h1>${escapeHTML(anim.title)}</h1>
<p>${escapeHTML(description)}</p>
<p>Category: ${escapeHTML(anim.category)}</p>
<p>Tags: ${escapeHTML((anim.tags || []).join(', '))}</p>
<p><a href="${escapeHTML(pageUrl)}">View the live animation on MotionZync</a></p>
</body>
</html>`

    return new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' },
    })
  } catch {
    return next() // never let a bug here affect a real request
  }
}
