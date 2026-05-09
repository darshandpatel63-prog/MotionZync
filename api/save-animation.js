/**
 * api/save-animation.js
 * Vercel Serverless Function
 * 
 * Secure server-side GitHub API call.
 * GITHUB_TOKEN, ADMIN_PASSWORD frontend ne kabhi nahi dikhta.
 * 
 * POST /api/save-animation
 * Body: { password, animation: { id, title, description, category, cssCode, jsCode, previewBg } }
 */

const GITHUB_API = 'https://api.github.com'
const FILE_PATH = 'src/animations/animationsData.json'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { password, animation, action, animationId } = req.body

    // ── 1. Password check ──
    const adminPass = process.env.ADMIN_PASSWORD
    if (!adminPass || password !== adminPass) {
      return res.status(401).json({ error: 'Wrong password' })
    }

    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_OWNER
    const repo  = process.env.GITHUB_REPO

    if (!token || !owner || !repo) {
      return res.status(500).json({ error: 'GitHub env variables not set in Vercel' })
    }

    // ── 2. Current file GitHub thi fetch karo ──
    const fileRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } }
    )

    if (!fileRes.ok) {
      return res.status(500).json({ error: `GitHub file fetch failed: ${fileRes.status}` })
    }

    const fileData = await fileRes.json()
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8')
    let animations = JSON.parse(currentContent)

    // ── 3. Action: add / delete ──
    if (action === 'delete') {
      if (!animationId) return res.status(400).json({ error: 'animationId required for delete' })
      animations = animations.filter(a => a.id !== animationId)
    } else {
      // Default: add/update
      if (!animation || !animation.id || !animation.title || !animation.cssCode) {
        return res.status(400).json({ error: 'animation fields missing (id, title, cssCode required)' })
      }
      // Duplicate id check - update if exists
      const existingIdx = animations.findIndex(a => a.id === animation.id)
      if (existingIdx >= 0) {
        animations[existingIdx] = animation
      } else {
        animations.push(animation)
      }
    }

    // ── 4. Updated JSON GitHub par commit karo ──
    const updatedContent = Buffer.from(
      JSON.stringify(animations, null, 2)
    ).toString('base64')

    const commitRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: action === 'delete'
            ? `🗑️ Remove animation: ${animationId}`
            : `✨ Add/update animation: ${animation.title}`,
          content: updatedContent,
          sha: fileData.sha
        })
      }
    )

    if (!commitRes.ok) {
      const errData = await commitRes.json()
      return res.status(500).json({ error: `GitHub commit failed: ${errData.message}` })
    }

    return res.status(200).json({
      success: true,
      message: action === 'delete' ? 'Animation deleted!' : 'Animation saved! Vercel deploying...',
      count: animations.length
    })

  } catch (err) {
    console.error('save-animation error:', err)
    return res.status(500).json({ error: err.message })
  }
      }
