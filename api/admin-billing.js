import { requireAdmin } from './_lib/firebase-admin.js'
import { getBillingAnalytics, grantEntitlementByEmail, getDesignIntelligenceAccessPolicy, getDesignIntelligenceAccessState, saveDesignIntelligenceAccessPolicy } from './_lib/billing.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control','private, no-store, max-age=0')
  res.setHeader('Pragma','no-cache')
  res.setHeader('Vary','Authorization')
  res.setHeader('X-Content-Type-Options','nosniff')
  if (!['GET','POST'].includes(req.method)) {
    return res.status(405).json({ error:'Method not allowed' })
  }

  let adminUser
  try {
    adminUser = await requireAdmin(req)
  } catch (error) {
    return res.status(error.status || 401).json({ error:error.message })
  }

  try {
    if (req.method === 'GET') {
      const [analytics, accessPolicy] = await Promise.all([
        getBillingAnalytics(),
        getDesignIntelligenceAccessPolicy(),
      ])
      return res.status(200).json({
        ...analytics,
        accessPolicy,
        accessPolicyState: getDesignIntelligenceAccessState(accessPolicy),
      })
    }

    const body = req.body || {}
    if (body.action === 'saveDesignIntelligenceAccessPolicy') {
      const accessPolicy = await saveDesignIntelligenceAccessPolicy(body.accessPolicy, {
        uid: adminUser.uid,
        email: adminUser.email,
      })
      return res.status(200).json({
        ok: true,
        accessPolicy,
        accessPolicyState: getDesignIntelligenceAccessState(accessPolicy),
      })
    }
    if (body.action !== 'grantEntitlement') {
      return res.status(400).json({ error:'Unknown billing admin action' })
    }

    const result = await grantEntitlementByEmail({
      email:body.email,
      tier:body.tier,
      grantedBy:{ uid:adminUser.uid, email:adminUser.email },
    })

    return res.status(200).json({ ok:true, result })
  } catch (error) {
    console.error('[admin-billing]', error)
    return res.status(error.status || 500).json({ error:error.message || 'Billing operation failed' })
  }
}
