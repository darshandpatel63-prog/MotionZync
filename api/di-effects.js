import { authenticateMotionZyncApiKey } from './_lib/billing.js'
import { createSpecialEffect, listSpecialEffects, SPECIAL_EFFECTS_API_VERSION } from './_lib/di-effects.js'

const setSecurityHeaders=(res)=>{
  res.setHeader('Cache-Control','private, no-store, max-age=0')
  res.setHeader('Pragma','no-cache')
  res.setHeader('Vary','Authorization, Origin')
  res.setHeader('X-Content-Type-Options','nosniff')
  res.setHeader('X-Frame-Options','DENY')
}

const allowedOrigins=()=>{
  const raw=String(process.env.MOTIONZYNC_API_ALLOWED_ORIGINS||'')
  return new Set(raw.split(',').map(value=>value.trim()).filter(Boolean))
}

const applyCors=(req,res)=>{
  const origin=String(req.headers.origin||'')
  if(!origin)return true
  const allowed=allowedOrigins()
  if(!allowed.has(origin)){
    res.status(403).json({error:'Origin is not authorized for the MotionZync developer API'})
    return false
  }
  res.setHeader('Access-Control-Allow-Origin',origin)
  res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type')
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS')
  return true
}

const readBody=(body)=>{
  if(body&&typeof body==='object'&&!Array.isArray(body))return body
  return {}
}

export default async function handler(req,res){
  setSecurityHeaders(res)
  if(!applyCors(req,res))return

  if(req.method==='OPTIONS')return res.status(204).end()
  if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'})

  const bearer=String(req.headers.authorization||req.headers.Authorization||'')
  if(!bearer.startsWith('Bearer ')){
    return res.status(401).json({error:'A server-issued MotionZync Ultra Premium+ API key is required'})
  }
  const secret=bearer.slice(7).trim()

  try{
    const apiAccess=await authenticateMotionZyncApiKey(secret)
    if(apiAccess.plan!=='ultra-premium'){
      return res.status(403).json({error:'Ultra Premium+ entitlement is required'})
    }

    if(req.method==='GET'){
      return res.status(200).json({
        ok:true,
        apiVersion:SPECIAL_EFFECTS_API_VERSION,
        capability:'special-animation-effects',
        authenticated:true,
        entitlement:'ultra-premium',
        effects:listSpecialEffects(),
      })
    }

    const body=readBody(req.body)
    const effect=createSpecialEffect(body.effectId,body.options)
    return res.status(200).json({
      ok:true,
      capability:'special-animation-effects',
      authenticated:true,
      entitlement:'ultra-premium',
      ...effect,
    })
  }catch(error){
    return res.status(error.status||401).json({error:error.message||'Special-effects API request failed'})
  }
}
