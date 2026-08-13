// src/hooks/useSEO.js
// ============================================================
// MotionZync is a client-rendered SPA (Vite, no server-side rendering),
// so every route is served the same index.html and its generic meta
// tags. This hook overwrites document.title + the description/OG/
// Twitter tags once real data has loaded on a page like AnimationDetail,
// so:
//   1. Google's renderer (it does execute JS) sees a unique, relevant
//      title+description per animation instead of the homepage's.
//   2. Anyone sharing an animation link gets a proper link preview.
//
// This does NOT fully replace server-side rendering — crawlers that
// never execute JS at all still only see the generic homepage tags from
// index.html. middleware.js (project root) covers that gap for known
// bots specifically on /animation/:id routes.
// ============================================================

import { useEffect } from 'react'

function setMeta(attr, key, content) {
  if (!content) return
  let tag = document.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * @param {{title?:string, description?:string, url?:string}} seo
 * Call with real values once your data has loaded. While `title` is
 * falsy (still loading), this does nothing — it won't flash a half-set
 * state into the document head.
 */
export function useSEO({ title, description, url } = {}) {
  useEffect(() => {
    if (!title) return
    const prevTitle = document.title
    document.title = title

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    if (url) setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)

    // Restore the generic title on unmount (leaving stale meta tags behind
    // is harmless — the next page that cares will overwrite them too).
    return () => { document.title = prevTitle }
  }, [title, description, url])
}
