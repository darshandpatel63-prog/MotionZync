// MotionZync Design Intelligence — canonical schema helpers.
// Phase A foundation: structural validation only.
// This module does not fetch external sources, invent records, or store data.

export const DI_SCHEMA_VERSION='1.1'

export const DI_DOMAINS=Object.freeze([
  'styles',
  'palettes',
  'typography',
  'charts',
  'stacks',
  'recipes',
])

export const DI_TIERS=Object.freeze([
  'free',
  'premium',
  'ultra-premium',
])

export const PROVENANCE_STATUS=Object.freeze([
  'seed',
  'researched',
  'verified',
  'rejected',
  'deprecated',
])

const isObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)
const isString=value=>typeof value==='string'&&value.trim().length>0
const isStringArray=value=>Array.isArray(value)&&value.every(item=>typeof item==='string'&&item.trim().length>0)
const isHex=value=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value)

const DOMAIN_REQUIREMENTS=Object.freeze({
  styles:['id','name','tier','tags','description','suitedFor'],
  palettes:['id','name','tier','primary','secondary','accent','cta','background','surface','text','muted','semantic','mood','tags'],
  typography:['id','name','tier','heading','body','mood','tags'],
  charts:['id','name','tier','family','purpose','bestFor','avoidFor'],
  stacks:['id','name','tier','category','focus'],
  recipes:['id','name','tier','styleId','paletteId','typographyId','chartIds','stackIds','layout','navigation','ux'],
})

function validateProvenance(provenance){
  const errors=[]
  if(!isObject(provenance)){errors.push('Provenance must be an object.');return{valid:false,errors}}
  if(!isString(provenance.source))errors.push('Provenance source is required.')
  if(provenance.status!==undefined&&!PROVENANCE_STATUS.includes(provenance.status))errors.push('Unknown provenance status: '+provenance.status)
  if(provenance.sourceType!==undefined&&!isString(provenance.sourceType))errors.push('Provenance sourceType must be a non-empty string.')
  if(provenance.checkedAt!==undefined&&!isString(provenance.checkedAt))errors.push('Provenance checkedAt must be a non-empty string.')
  return{valid:errors.length===0,errors}
}

export function validateRecordShape(record,domain,{requireProvenance=false}={}){
  const errors=[]
  const warnings=[]
  if(!DI_DOMAINS.includes(domain))errors.push('Unknown catalog domain: '+domain)
  if(!isObject(record))return{valid:false,errors:['Record must be an object.'],warnings}
  for(const field of DOMAIN_REQUIREMENTS[domain]||[]){
    if(record[field]===undefined||record[field]===null)errors.push(domain+' record '+(record.id||'<unknown>')+' is missing '+field+'.')
  }
  if(!isString(record.id))errors.push(domain+' record id must be a non-empty string.')
  if(!isString(record.name))errors.push(domain+' record '+(record.id||'<unknown>')+' name must be a non-empty string.')
  if(!DI_TIERS.includes(record.tier))errors.push(domain+' record '+(record.id||'<unknown')+' has invalid tier: '+record.tier)
  if(record.tags!==undefined&&!isStringArray(record.tags))errors.push(domain+' record '+(record.id||'<unknown>')+' tags must be a string array.')
  if(record.description!==undefined&&!isString(record.description))errors.push(domain+' record '+(record.id||'<unknown>')+' description must be a string.')
  if(domain==='styles'&&record.suitedFor!==undefined&&!isStringArray(record.suitedFor))errors.push('Style '+record.id+' suitedFor must be a string array.')
  if(domain==='palettes'){
    for(const field of ['primary','secondary','accent','cta','background','surface','text','muted']){
      if(record[field]!==undefined&&!isHex(record[field]))errors.push('Palette '+record.id+' '+field+' must be a 6-digit hex color.')
    }
    if(record.semantic!==undefined&&!isObject(record.semantic))errors.push('Palette '+record.id+' semantic must be an object.')
    if(isObject(record.semantic)){
      for(const field of ['success','warning','error']){
        if(record.semantic[field]!==undefined&&!isHex(record.semantic[field]))errors.push('Palette '+record.id+' semantic.'+field+' must be a 6-digit hex color.')
      }
    }
  }
  if(domain==='typography'){
    for(const field of ['heading','body','mood'])if(record[field]!==undefined&&!isString(record[field]))errors.push('Typography '+record.id+' '+field+' must be a non-empty string.')
  }
  if(domain==='charts'){
    for(const field of ['family','purpose'])if(record[field]!==undefined&&!isString(record[field]))errors.push('Chart '+record.id+' '+field+' must be a non-empty string.')
    for(const field of ['bestFor','avoidFor'])if(record[field]!==undefined&&!isStringArray(record[field]))errors.push('Chart '+record.id+' '+field+' must be a string array.')
  }
  if(domain==='stacks'){
    if(record.category!==undefined&&!isString(record.category))errors.push('Stack '+record.id+' category must be a non-empty string.')
    if(record.focus!==undefined&&!isStringArray(record.focus))errors.push('Stack '+record.id+' focus must be a string array.')
  }
  if(domain==='recipes'){
    for(const field of ['styleId','paletteId','typographyId','layout','navigation'])if(record[field]!==undefined&&!isString(record[field]))errors.push('Recipe '+record.id+' '+field+' must be a non-empty string.')
    for(const field of ['chartIds','stackIds','ux'])if(record[field]!==undefined&&!isStringArray(record[field]))errors.push('Recipe '+record.id+' '+field+' must be a string array.')
  }
  if(record.provenance!==undefined){
    const provenance=validateProvenance(record.provenance)
    if(!provenance.valid)errors.push(...provenance.errors.map(error=>domain+' record '+(record.id||'<unknown>')+': '+error))
  }else if(requireProvenance){
    errors.push(domain+' record '+record.id+' is missing provenance metadata.')
  }else{
    warnings.push(domain+' record '+record.id+' has no provenance metadata yet.')
  }
  return{valid:errors.length===0,errors,warnings}
}

export function validateCatalog(catalogs,{requireProvenance=false}={}){
  const errors=[]
  const warnings=[]
  const counts={}
  const ids=new Map()
  for(const domain of DI_DOMAINS){
    const records=Array.isArray(catalogs?.[domain])?catalogs[domain]:[]
    counts[domain]=records.length
    if(!Array.isArray(catalogs?.[domain]))errors.push('Catalog domain '+domain+' must be an array.')
    for(const record of records){
      const result=validateRecordShape(record,domain,{requireProvenance})
      errors.push(...result.errors)
      warnings.push(...result.warnings)
      if(isString(record?.id)){
        const prior=ids.get(record.id)
        if(prior)errors.push('Duplicate canonical ID '+record.id+' in '+prior+' and '+domain+'.')
        else ids.set(record.id,domain)
      }
    }
  }
  return{
    valid:errors.length===0,
    errors,
    warnings,
    counts,
    totalRecords:Object.values(counts).reduce((sum,count)=>sum+count,0),
    schemaVersion:DI_SCHEMA_VERSION,
  }
}

export function validateRecipeShape(recipe){
  const errors=[]
  const warnings=[]
  if(!isObject(recipe))return{valid:false,errors:['Recipe must be an object.'],warnings}
  if(!isObject(recipe.request))errors.push('Recipe request must be an object.')
  if(isObject(recipe.request)){
    for(const field of ['raw','product','industry','platform','mode','mood']){
      if(!isString(recipe.request[field]))errors.push('Recipe request '+field+' must be a non-empty string.')
    }
    if(!isStringArray(recipe.request.tokens))errors.push('Recipe request tokens must be a string array.')
  }
  for(const field of ['style','palette','typography','stack']){
    if(!isObject(recipe[field]))errors.push('Recipe '+field+' record is required.')
    else if(!isString(recipe[field].id))errors.push('Recipe '+field+' must contain a canonical id.')
  }
  if(recipe.chart!==null&&recipe.chart!==undefined&&!isObject(recipe.chart))errors.push('Recipe chart must be an object or null.')
  if(recipe.chart&&!isString(recipe.chart.id))errors.push('Recipe chart must contain a canonical id.')
  for(const field of ['layout','navigation','compositionFamily']){
    if(!isString(recipe[field]))errors.push('Recipe '+field+' must be a non-empty string.')
  }
  if(!isStringArray(recipe.ux))errors.push('Recipe ux must be a string array.')
  if(recipe.tier!==undefined&&!DI_TIERS.includes(recipe.tier))errors.push('Recipe has invalid tier: '+recipe.tier)
  return{valid:errors.length===0,errors,warnings}
}

export function createCatalogManifest(catalogs,{requireProvenance=false}={}){
  const report=validateCatalog(catalogs,{requireProvenance})
  return{
    schemaVersion:DI_SCHEMA_VERSION,
    valid:report.valid,
    totalRecords:report.totalRecords,
    counts:report.counts,
    requiresProvenance:requireProvenance,
  }
}
