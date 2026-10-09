import {DI_RECIPES,DI_STYLES,DI_PALETTES,DI_TYPOGRAPHY,DI_CHARTS,DI_STACKS} from './catalog.js'
import {relationshipScore,getRelationshipIntegrity} from './relationships.js'
import {validateRecipeShape} from './schema.js'
import {buildSearchIndex,searchIndex,scoreSearchRecord} from './searchIndex.js'

export const ENTITLEMENT_LEVELS={free:0,premium:1,'ultra-premium':2}
const words=value=>String(value||'').toLowerCase().split(/[^a-z0-9+#.-]+/).filter(Boolean)
const levelOf=tier=>ENTITLEMENT_LEVELS[tier||'free']??0
const CATALOG_BY_DOMAIN=Object.freeze({
  styles:DI_STYLES,
  palettes:DI_PALETTES,
  typography:DI_TYPOGRAPHY,
  charts:DI_CHARTS,
  stacks:DI_STACKS,
  recipes:DI_RECIPES,
})
const SEARCH_INDEXES=Object.freeze(
  Object.fromEntries(Object.entries(CATALOG_BY_DOMAIN).map(([domain,records])=>[domain,buildSearchIndex(records)]))
)

const catalogMap=(catalogs=CATALOG_BY_DOMAIN)=>({
  styles:Array.isArray(catalogs?.styles)?catalogs.styles:DI_STYLES,
  palettes:Array.isArray(catalogs?.palettes)?catalogs.palettes:DI_PALETTES,
  typography:Array.isArray(catalogs?.typography)?catalogs.typography:DI_TYPOGRAPHY,
  charts:Array.isArray(catalogs?.charts)?catalogs.charts:DI_CHARTS,
  stacks:Array.isArray(catalogs?.stacks)?catalogs.stacks:DI_STACKS,
  recipes:Array.isArray(catalogs?.recipes)?catalogs.recipes:DI_RECIPES,
})
const scoreRecord=(record,tokens)=>{
  const haystack=[record.name,record.description,record.mood,record.category,...(record.tags||[]),...(record.suitedFor||[]),...(record.focus||[]),record.layout,record.navigation,...(record.ux||[])].join(' ').toLowerCase()
  return tokens.reduce((score,token)=>score+(haystack.includes(token)?1:0),0)
}
const best=(records,tokens,entitlementTier='free',fallback=0,anchorIds=[])=>{
  const allowed=records.filter(record=>isAccessible(record,entitlementTier))
  const pool=allowed.length?allowed:records.filter(record=>record.tier==='free')
  const ranked=pool.map(record=>({record,score:scoreRecord(record,tokens),relationshipScore:relationshipScore(record.id,anchorIds)})).sort((a,b)=>b.score-a.score||b.relationshipScore-a.relationshipScore)
  return (ranked[0]?.score||0)>fallback?ranked[0].record:pool[0]
}

export const isAccessible=(record,entitlementTier='free')=>{
  const recordLevel=ENTITLEMENT_LEVELS[record?.tier]
  return !!record&&recordLevel!==undefined&&recordLevel<=levelOf(entitlementTier)
}
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

export function evaluateCompatibility(recipe){
  const issues=[]
  const platform=recipe?.request?.platform
  const category=recipe?.stack?.category
  const tokens=recipe?.request?.tokens||[]
  const ratio=contrastRatio(recipe?.palette?.text,recipe?.palette?.background)
  const industryAliases={
    developer:'developer tools',
    developers:'developer tools',
    'developer-tools':'developer tools',
    ai:'ai products',
    'ai-product':'ai products',
    'ai-products':'ai products',
    ecommerce:'commerce',
    commerce:'commerce',
    healthcare:'healthcare',
    health:'healthcare',
  }
  const rawIndustry=String(recipe?.request?.industry||'').toLowerCase().trim()
  const industry=industryAliases[rawIndustry]||rawIndustry
  const suited=Array.isArray(recipe?.style?.suitedFor)
    ?recipe.style.suitedFor.map(value=>String(value).toLowerCase().trim()).map(value=>industryAliases[value]||value)
    :[]

  if(platform==='ios'&&category!=='native-ios'&&category!=='cross-platform-mobile'){
    issues.push({severity:'incompatible',code:'ios-stack-mismatch',message:'iOS targets require SwiftUI or a verified cross-platform mobile stack.'})
  }
  if(platform==='android'&&category==='native-ios'){
    issues.push({severity:'incompatible',code:'android-ios-stack-mismatch',message:'Android targets cannot use a native iOS-only stack.'})
  }else if(platform==='android'&&category!=='cross-platform-mobile'){
    issues.push({severity:'questionable',code:'android-stack-gap',message:'Android target is using a stack not classified as cross-platform mobile in the current catalog.'})
  }
  if(platform==='mobile'&&category!=='cross-platform-mobile'){
    issues.push({severity:'incompatible',code:'mobile-stack-mismatch',message:'Mobile targets require a cross-platform mobile stack in the current catalog.'})
  }
  if(platform==='web'&&(category==='native-ios'||category==='cross-platform-mobile')){
    issues.push({severity:'incompatible',code:'web-native-stack-mismatch',message:'The selected stack is not classified for the requested web target.'})
  }
  if(industry&&industry!=='general'&&suited.length&&!suited.includes(industry)){
    issues.push({severity:'acceptable',code:'style-industry-mismatch',message:'The selected style is not explicitly classified for the requested industry; review the composition.'})
  }
  if(ratio!==null&&ratio<4.5){
    issues.push({severity:'questionable',code:'text-background-contrast',message:'Text/background contrast is below 4.5:1 and needs review.'})
  }
  const ctaRatio=contrastRatio(recipe?.palette?.text,recipe?.palette?.cta)
  if(ctaRatio!==null&&ctaRatio<4.5){
    issues.push({severity:'questionable',code:'cta-contrast',message:'CTA text contrast is below 4.5:1 and needs review.'})
  }
  if(recipe?.style?.id==='style-glassmorphism'&&ratio!==null&&ratio<4.5){
    issues.push({severity:'questionable',code:'glass-opacity-contrast',message:'Translucent layered styles can reduce real-world contrast at runtime opacity values.'})
  }
  if(recipe?.chart?.family==='donut'&&tokens.includes('many')){
    issues.push({severity:'questionable',code:'donut-many-categories',message:'Donut charts are not ideal for many categories; consider a comparison-oriented chart.'})
  }
  if(recipe?.chart){
    const chartNeeds=['time-series','performance','growth','categorical','comparison','composition','category-comparison','part-to-whole','correlation','distribution','matrix','time-by-category']
    const requestedNeeds=tokens.filter(token=>chartNeeds.includes(token))
    for(const need of requestedNeeds){
      if(Array.isArray(recipe.chart.avoidFor)&&recipe.chart.avoidFor.includes(need)){
        issues.push({severity:'questionable',code:'chart-avoids-requested-need',message:'The selected chart is explicitly marked to avoid the requested data/purpose signal: '+need+'.'})
      }else if(Array.isArray(recipe.chart.bestFor)&&recipe.chart.bestFor.length&&!recipe.chart.bestFor.includes(need)){
        issues.push({severity:'questionable',code:'chart-needs-review',message:'The selected chart is not explicitly classified for requested data/purpose signal: '+need+'.'})
      }
    }
  }

  if(recipe?.request?.mode==='dark'&&recipe?.palette?.background==='#FFFBEB'){
    issues.push({severity:'questionable',code:'dark-light-palette-mismatch',message:'The selected palette is light-first while the request asks for dark mode.'})
  }

  const hasIncompatible=issues.some(issue=>issue.severity==='incompatible')
  const hasQuestionable=issues.some(issue=>issue.severity==='questionable')
  const hasAcceptable=issues.some(issue=>issue.severity==='acceptable')
  return{
    status:hasIncompatible?'incompatible':hasQuestionable?'questionable':hasAcceptable?'acceptable':'compatible',
    issues,
  }
}

export function validateRecipe(recipe,entitlementTier='free',catalogs=CATALOG_BY_DOMAIN){
  const errors=[]
  const warnings=[]
  const structure=validateRecipeShape(recipe)
  errors.push(...structure.errors)
  warnings.push(...structure.warnings)

  const graph=getRelationshipIntegrity()
  if(!graph.valid)errors.push(...graph.errors.slice(0,10))

  const catalog=catalogMap(catalogs)
  const refs=[
    ['style',recipe?.style,catalog.styles],
    ['palette',recipe?.palette,catalog.palettes],
    ['typography',recipe?.typography,catalog.typography],
    ['stack',recipe?.stack,catalog.stacks],
    ...(recipe?.chart?[['chart',recipe.chart,catalog.charts]]:[]),
  ]
  for(const [name,record,records] of refs){
    if(!record?.id){errors.push('Missing '+name+' record.');continue}
    const canonical=records.find(item=>item.id===record.id)
    if(!canonical){errors.push('Unknown '+name+' record: '+record.id);continue}
    if(!isAccessible(canonical,entitlementTier))errors.push(canonical.name+' requires '+canonical.tier+' entitlement.')
  }

  const compatibility=evaluateCompatibility(recipe)
  for(const issue of compatibility.issues){
    if(issue.severity==='incompatible')errors.push(issue.message)
    else warnings.push(issue.message)
  }

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

export function buildRecipe(prompt='',entitlementTier='free',catalogs=CATALOG_BY_DOMAIN){
  const catalog=catalogMap(catalogs)
  const request=interpretRequest(prompt)
  const tokens=request.tokens
  const style=best(catalog.styles,tokens,entitlementTier)
  const palette=best(catalog.palettes,[...tokens,request.industry],entitlementTier,0,[style.id])
  const typography=best(catalog.typography,[...tokens,request.industry],entitlementTier,0,[style.id,palette.id])
  const chart=(request.product==='dashboard'||request.product==='analytics')?best(catalog.charts,tokens,entitlementTier,0,[style.id,palette.id,typography.id]):null
  const preferredStackId=request.platform==='mobile'||request.platform==='android'
    ?(tokens.includes('flutter')?'stack-flutter':'stack-react-native')
    :request.platform==='ios'?'stack-swiftui':null
  const stack=(preferredStackId?getAccessibleRecord(catalog.stacks,preferredStackId,entitlementTier):null)
    ||best(catalog.stacks,tokens,entitlementTier,0,[style.id,palette.id,typography.id,chart?.id])
  const recipeMatch=best(catalog.recipes,[...tokens,request.industry,style.id],entitlementTier,0,[style.id,palette.id,typography.id,chart?.id,stack?.id])
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
  const compatibility=evaluateCompatibility(candidate)
  candidate.compatibility=compatibility
  const warnings=[]
  if(request.mode==='dark'&&palette.background==='#FFFBEB')warnings.push('The selected palette is light-first; review contrast before forcing dark mode.')
  const validation=validateRecipe(candidate,entitlementTier,catalog)
  warnings.push(...validation.warnings)
  return{...candidate,warnings,deterministic:true,aiRequired:false,valid:validation.valid,errors:validation.errors}
}

export function searchCatalog(query='',domain='all',entitlementTier='free',catalogs=CATALOG_BY_DOMAIN){
  const catalog=catalogMap(catalogs)
  const domains=domain==='all'?Object.keys(catalog):[domain]
  const results=[]
  for(const currentDomain of domains){
    const records=catalog[currentDomain]
    const index=catalogs===CATALOG_BY_DOMAIN?SEARCH_INDEXES[currentDomain]:buildSearchIndex(records)
    if(!records||!index)continue
    for(const record of searchIndex(index,query)){
      if(!isAccessible(record,entitlementTier))continue
      const score=scoreSearchRecord(record,query)
      if(!query||score>0)results.push({record,score})
    }
  }
  return results.sort((a,b)=>b.score-a.score||a.record.name.localeCompare(b.record.name)).map(item=>item.record)
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
      compatibility:recipe.compatibility||evaluateCompatibility(recipe),
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
