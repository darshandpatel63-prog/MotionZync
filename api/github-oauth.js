// api/github-oauth.js
// ============================================================
// Vercel Serverless Function (Phase 2 / Step 1).
// The ONLY job of this endpoint: exchange a GitHub OAuth `code` for an
// access_token. This must happen server-side because it requires
// GITHUB_CLIENT_SECRET, which must never be shipped to the browser.
//
// Same-origin: the frontend calls this as a relative path (/api/github-oauth),
// so no CORS headers are needed — see vercel.json, which was updated so its
// catch-all SPA rewrite no longer swallows /api/* requests.
//
// Required environment variables (set in Vercel dashboard → Project →
// Settings → Environment Variables, NOT in the repo):
//   GITHUB_CLIENT_ID      (also fine to expose to the frontend as VITE_GITHUB_CLIENT_ID)
//   GITHUB_CLIENT_SECRET  (server-side only — never prefix this with VITE_)
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code } = req.body || {}
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing OAuth code' })
  }

  const clientId     = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Server is missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET' })
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    })
    const data = await tokenRes.json()

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error })
    }
    if (!data.access_token) {
      return res.status(400).json({ error: 'GitHub did not return an access token' })
    }

    // Only ever return the token itself — never log it, never store it here.
    return res.status(200).json({
      access_token: data.access_token,
      scope: data.scope,
      token_type: data.token_type,
    })
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach GitHub' })
  }
}
