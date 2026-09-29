import { requireAuthenticatedUser } from './_lib/firebase-admin.js'
import {
  getApiKeyStatusForUser,
  issueApiKeyForEntitlement,
  revokeApiKeysForUser,
  rotateApiKeyForEntitlement,
} from './_lib/billing.js'

function sendError(res, error, fallback = 'API key operation failed') {
  return res.status(error.status || 500).json({ error: error.message || fallback })
}

export default async function handler(req, res) {
  let user
  try {
    user = await requireAuthenticatedUser(req)
  } catch (error) {
    return sendError(res, error, 'Authentication failed')
  }

  try {
    if (req.method === 'GET') {
      const result = await getApiKeyStatusForUser(user.uid)
      return res.status(200).json({ ok: true, result })
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const action = String(req.body?.action || 'status').trim().toLowerCase()

    if (action === 'status') {
      const result = await getApiKeyStatusForUser(user.uid)
      return res.status(200).json({ ok: true, result })
    }

    if (action === 'issue') {
      const key = await issueApiKeyForEntitlement(user.uid)
      return res.status(201).json({
        ok: true,
        action: 'issued',
        warning: 'Save this API key now. The plaintext secret is not stored and cannot be shown again.',
        key: key.secret,
        metadata: {
          id: key.id,
          prefix: key.prefix,
          plan: key.plan,
          createdAt: key.createdAt,
        },
      })
    }

    if (action === 'rotate') {
      const key = await rotateApiKeyForEntitlement(user.uid)
      return res.status(201).json({
        ok: true,
        action: 'rotated',
        warning: 'Save this API key now. The previous active key was revoked and the new plaintext secret will not be shown again.',
        key: key.secret,
        metadata: {
          id: key.id,
          prefix: key.prefix,
          plan: key.plan,
          createdAt: key.createdAt,
          rotationOf: key.rotationOf,
        },
      })
    }

    if (action === 'revoke') {
      const result = await revokeApiKeysForUser(user.uid)
      return res.status(200).json({
        ok: true,
        action: 'revoked',
        result,
      })
    }

    return res.status(400).json({ error: 'Unknown API key action' })
  } catch (error) {
    return sendError(res, error)
  }
}
