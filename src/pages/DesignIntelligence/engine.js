import {DI_RECIPES,DI_STYLES,DI_PALETTES,DI_TYPOGRAPHY,DI_CHARTS,DI_STACKS} from './catalog.js'
import {relationshipScore,getRelationshipIntegrity} from './relationships.js'
import {validateRecipeShape} from './schema.js'

export const ENTITLEMENT_LEVELS={free:0,premium:1,'ultra-premium':2}
const words=value=>String(value||'').toLowerCase().split(/[^a-z0-9+#.-]+/).filter(Boolean)
const levelOf=tier=>ENTITLEMENT_LEVELS[tier||'free']??0
const scoreRecord=(record,tokens)=>{
  const haystack=[record.name,record.description,record.mood,record.category,...(record.tags||[]),...(record.suitedFor||[]),...(record.focus||[]),record.layout,record.navigation,...(record.ux||[])].join(' ').toLowerCase()
  return tokens.reduce((score,token)=>score+(haystack.includes(token)?1:0),0)
}
const best=(records,tokens,entitlementTier='free',fallback=0,anchorIds=[])=>{
  const max=levelOf(entitlementTier)
  const allowed=records.filter(record=>levelOf(record.tier)<=max)
  const pool=allowed.length?allowed:records.filter(record=>record.tier==='free')
  const ranked=pool.map(record=>({record,score:scoreRecord(record,tokens),relationshipScore:relationshipScore(record.id,anchorIds)})).sort((a,b)=>b.score-a.score||b.relationshipScore-a.relationshipScore)
  return (ranked[0]?.score||0)>fallback?ranked[0].record:pool[0]
}

export const isAccessible=(record,entitlementTier='free')=>!!record&&levelOf(record.tier)<=levelOf(entitlementTier)
export const getAccessibleRecord=(records,id,entitlementTier='free')=>{
  const record=records.find(item=>item.id===id)
  return isAccessible(record,entitlementTier)?record:null
}
function hexToRgb(value){
  const hex=String(value||'').replace('#','')
  if(!/^[0-9a-f]{6}$/i.test(hex))return null
  return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255)
}
function linearize(channel){return channel<=0.03928?channel/12.92:((channel+0.055)/1.055)**2.4}
function luminance(hex){
  const rgb=hexToRgb(hex)
  if(!rgb)return null
  const [r,g,b]=rgb.map(linearize)
  return 0.2126*r+0.7152*g+0.0722*b
}
function contrastRatio(foreground,background){
  const a=luminance(foreground),b=luminance(background)
  if(a===null||b===null)return null
  const light=Math.max(a,b),dark=Math.min(a,b)
  return (light+0.05)/(dark+0.05)
}

export function validateRecipe(recipe,entitlementTier='free'){
  const errors=[]
  const warnings=[]
  const structure=validateRecipeShape(recipe)
  errors.push(...structure.errors)
  warnings.push(...structure.warnings)
  const graph=getRelationshipIntegrity()
  if(!graph.valid)errors.push(...graph.errors.slice(0,10))
  const refs=[
    ['style',recipe?.style,DI_STYLES],
    ['palette',recipe?.palette,DI_PALETTES],
    ['typography',recipe?.typography,DI_TYPOGRAPHY],
    ['stack',recipe?.stack,DI_STACKS],
    ...(recipe?.chart?[['chart',recipe.chart,DI_CHARTS]]:[]),
  ]
  for(const [name,record,records] of refs){
    if(!record?.id){errors.push('Missing '+name+' record.');continue}
    const canonical=records.find(item=>item.id===record.id)
    if(!canonical){errors.push('Unknown '+name+' record: '+record.id);continue}
    if(!isAccessible(canonical,entitlementTier))errors.push(canonical.name+' requires '+canonical.tier+' entitlement.')
  }
  const ratio=contrastRatio(recipe?.palette?.text,recipe?.palette?.background)
  if(ratio!==null&&ratio<4.5)warnings.push('Text/background contrast needs review; the current ratio is below 4.5:1.')
  const ctaRatio=contrastRatio(recipe?.palette?.text,recipe?.palette?.cta)
  if(ctaRatio!==null&&ctaRatio<4.5)warnings.push('CTA text contrast needs review; the current ratio is below 4.5:1.')
  const platform=recipe?.request?.platform
  const category=recipe?.stack?.category
  if(platform==='mobile'&&category!=='cross-platform-mobile')warnings.push('Mobile target should use a cross-platform or native-mobile stack.')
  if(platform==='ios'&&category!=='native-ios'&&category!=='cross-platform-mobile')warnings.push('iOS target should use SwiftUI or a verified cross-platform mobile stack.')
  if(platform==='android'&&category!=='cross-platform-mobile')warnings.push('Android target should use a verified cross-platform mobile stack; native Android knowledge is not yet in the seed catalog.')
  if(recipe?.style?.id==='style-glassmorphism'&&ratio!==null&&ratio<4.5)warnings.push('Translucent layered styles can amplify contrast problems; test surfaces at real opacity values.')
  if(recipe?.chart?.family==='donut'&&((recipe?.request?.tokens||[]).includes('many')))warnings.push('Donut charts are not ideal for many categories; prefer a comparison-oriented chart.')
  return{valid:errors.length===0,errors,warnings}
}

export function interpretRequest(prompt=''){
  const text=String(prompt).trim()
  const tokens=words(text)
  const pick=(...values)=>values.find(value=>tokens.includes(value))
  return{
    raw:text,
    tokens,
    product:pick('dashboard','saas','landing','ecommerce','commerce','portfolio','mobile','app','analytics','admin','healthcare','education','fintech')||'product',
    industry:pick('healthcare','education','fintech','saas','ecommerce','commerce','developer','developers','ai','portfolio','enterprise')||'general',
    platform:pick('mobile','ios','android','web')||'web',
    mode:tokens.includes('dark')?'dark':(tokens.includes('light')?'light':'adaptive'),
    mood:pick('premium','luxury','playful','friendly','technical','professional','minimal','bold','editorial')||'modern'
  }
}

export function buildRecipe(prompt='',entitlementTier='free'){
  const request=interpretRequest(prompt)
  const tokens=request.tokens
  const style=best(DI_STYLES,tokens,entitlementTier)
  const palette=best(DI_PALETTES,[...tokens,request.industry],entitlementTier,0,[style.id])
  const typography=best(DI_TYPOGRAPHY,[...tokens,request.industry],entitlementTier,0,[style.id,palette.id])
  const chart=(request.product==='dashboard'||request.product==='analytics')?best(DI_CHARTS,tokens,entitlementTier,0,[style.id,palette.id,typography.id]):null
  const stack=request.platform==='mobile'
    ?(tokens.includes('flutter')?DI_STACKS.find(r=>r.id==='stack-flutter'):DI_STACKS.find(r=>r.id==='stack-react-native'))
    :(request.platform==='ios'
      ?(DI_STACKS.find(r=>r.id==='stack-swiftui')||best(DI_STACKS,tokens,entitlementTier,0,[style.id,palette.id,typography.id,chart?.id]))
      :best(DI_STACKS,tokens,entitlementTier,0,[style.id,palette.id,typography.id,chart?.id]))
  const recipeMatch=best(DI_RECIPES,[...tokens,request.industry,style.id],entitlementTier,0,[style.id,palette.id,typography.id,chart?.id,stack?.id])
  const compositionFamily=request.product==='dashboard'||request.product==='analytics'?'dashboard':request.product==='ecommerce'||request.product==='commerce'?'commerce':request.product==='landing'||request.product==='portfolio'?'editorial':request.product==='mobile'||request.product==='app'?'mobile':request.product==='healthcare'||request.product==='education'||request.product==='admin'?'workspace':'product'
  const candidate={
    request,
    style,
    palette,
    typography,
    chart,
    stack,
    layout:recipeMatch.layout,
    navigation:recipeMatch.navigation,
    ux:recipeMatch.ux,
    compositionFamily,
    tier:[style,palette,typography,chart,stack,recipeMatch].filter(Boolean).reduce((tier,record)=>levelOf(record.tier)>levelOf(tier)?record.tier:tier,'free'),
  }
  const warnings=[]
  if(request.mode==='dark'&&palette.background==='#FFFBEB')warnings.push('The selected palette is light-first; review contrast before forcing dark mode.')
  const validation=validateRecipe(candidate,entitlementTier)
  warnings.push(...validation.warnings)
  return{...candidate,warnings,deterministic:true,aiRequired:false,valid:validation.valid,errors:validation.errors}
}

export function searchCatalog(query='',domain='all',entitlementTier='free'){
  const tokens=words(query)
  const source=domain==='all'
    ?[...DI_STYLES,...DI_PALETTES,...DI_TYPOGRAPHY,...DI_CHARTS,...DI_STACKS,...DI_RECIPES]
    :{styles:DI_STYLES,palettes:DI_PALETTES,typography:DI_TYPOGRAPHY,charts:DI_CHARTS,stacks:DI_STACKS,recipes:DI_RECIPES}[domain]||[]
  const max=levelOf(entitlementTier)
  return source.filter(record=>levelOf(record.tier)<=max).map(record=>({record,score:scoreRecord(record,tokens)})).filter(item=>!tokens.length||item.score>0).sort((a,b)=>b.score-a.score).map(item=>item.record)
}

export function recipeToTokens(recipe){
  const color=recipe.palette
  return{'--mz-primary':color.primary,'--mz-secondary':color.secondary,'--mz-accent':color.accent,'--mz-cta':color.cta,'--mz-background':color.background,'--mz-surface':color.surface,'--mz-text':color.text,'--mz-muted':color.muted,'--mz-radius':'16px','--mz-spacing':'8px','--mz-font-heading':recipe.typography.heading,'--mz-font-body':recipe.typography.body}
}


export function recipeToExport(recipe){
  if(!recipe||typeof recipe!=='object')return null
  return{
    schemaVersion:'1.0',
    type:'motionzync-design-recipe',
    recipe:{
      request:recipe.request,
      styleId:recipe.style?.id||null,
      paletteId:recipe.palette?.id||null,
      typographyId:recipe.typography?.id||null,
      chartId:recipe.chart?.id||null,
      stackId:recipe.stack?.id||null,
      layout:recipe.layout||'',
      navigation:recipe.navigation||'',
      ux:Array.isArray(recipe.ux)?recipe.ux:[],
      compositionFamily:recipe.compositionFamily||'product',
      tier:recipe.tier||'free',
      deterministic:recipe.deterministic!==false,
      aiAssisted:recipe.aiAssisted===true,
      warnings:Array.isArray(recipe.warnings)?recipe.warnings:[],
    },
  }
}

export function recipeToCSSVariables(recipe){
  if(!recipe?.palette||!recipe?.typography)return ''
  const tokens=recipeToTokens(recipe)
  return Object.entries(tokens).map(([name,value])=>'  '+name+': '+value+';').join('\n').concat('\n')
}
