/**
 * api/verify-password.js
 * Server-side password check - ADMIN_PASSWORD frontend ma kabhi nahi jaata
 * POST /api/verify-password
 * Body: { password }
 * Returns: { success: true/false }
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { password } = req.body || {}
  if (!password) return res.status(400).json({ success: false })

  const correct = process.env.ADMIN_PASSWORD
  if (!correct) return res.status(500).json({ error: 'ADMIN_PASSWORD env variable not set' })

  if (password === correct) {
    return res.status(200).json({ success: true })
  }
  return res.status(401).json({ success: false })
}

