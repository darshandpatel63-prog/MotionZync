// MotionZync Design Intelligence — canonical relationship layer.
// Phase A foundation: relationships are derived only from explicit recipe references.
// No synthetic/filler compatibility records are created here.

import {
  DI_RECIPES,
  DI_STYLES,
  DI_PALETTES,
  DI_TYPOGRAPHY,
  DI_CHARTS,
  DI_STACKS,
} from './catalog.js'

export const RELATIONSHIP_SCHEMA_VERSION='1.1'

export const RELATIONSHIP_TYPES=Object.freeze({
  uses:'uses',
  coOccursWith:'co-occurs-with',
})

const DOMAIN_RECORDS=Object.freeze({
  recipes:DI_RECIPES,
  styles:DI_STYLES,
  palettes:DI_PALETTES,
  typography:DI_TYPOGRAPHY,
  charts:DI_CHARTS,
  stacks:DI_STACKS,
})

const makeEndpoint=(domain,id)=>({domain,id})

const explicitRelations=[]
for(const recipe of DI_RECIPES){
  const components=[
    ['styles',recipe.styleId],
    ['palettes',recipe.paletteId],
    ['typography',recipe.typographyId],
    ...recipe.chartIds.map(id=>['charts',id]),
    ...recipe.stackIds.map(id=>['stacks',id]),
  ].filter(([,id])=>Boolean(id))

  for(const [domain,id] of components){
    explicitRelations.push({
      id:recipe.id+'--uses--'+domain+'--'+id,
      source:makeEndpoint('recipes',recipe.id),
      type:RELATIONSHIP_TYPES.uses,
      target:makeEndpoint(domain,id),
      provenance:'explicit recipe reference',
      confidence:'explicit',
    })
  }

  for(let i=0;i<components.length;i++){
    for(let j=i+1;j<components.length;j++){
      const [leftDomain,leftId]=components[i]
      const [rightDomain,rightId]=components[j]
      explicitRelations.push({
        id:recipe.id+'--co-occurs--'+leftDomain+'--'+leftId+'--'+rightDomain+'--'+rightId,
        source:makeEndpoint(leftDomain,leftId),
        type:RELATIONSHIP_TYPES.coOccursWith,
        target:makeEndpoint(rightDomain,rightId),
        provenance:'explicit recipe co-occurrence',
        confidence:'explicit',
        recipeId:recipe.id,
      })
    }
  }
}

const dedupe=new Map()
for(const relation of explicitRelations){
  const key=[
    relation.type,
    relation.source.domain,
    relation.source.id,
    relation.target.domain,
    relation.target.id,
  ].join('|')
  if(!dedupe.has(key))dedupe.set(key,relation)
}

export const DI_RELATIONSHIPS=Object.freeze([...dedupe.values()])

const addToIndex=(map,key,value)=>{
  const current=map.get(key)
  if(current)current.push(value)
  else map.set(key,[value])
}

const relationKey=(domain,id)=>domain+'|'+id
const byRecord=new Map()
const coOccurrenceNeighbors=new Map()
const coOccurrenceByRecordId=new Map()

for(const relation of DI_RELATIONSHIPS){
  const sourceKey=relationKey(relation.source.domain,relation.source.id)
  const targetKey=relationKey(relation.target.domain,relation.target.id)
  addToIndex(byRecord,sourceKey,relation)
  addToIndex(byRecord,targetKey,relation)
  if(relation.type===RELATIONSHIP_TYPES.coOccursWith){
    addToIndex(coOccurrenceNeighbors,sourceKey,relation.target.id)
    addToIndex(coOccurrenceNeighbors,targetKey,relation.source.id)
    addToIndex(coOccurrenceByRecordId,relation.source.id,relation.target.id)
    addToIndex(coOccurrenceByRecordId,relation.target.id,relation.source.id)
  }
}

export const RELATIONSHIP_INDEX=Object.freeze({
  byRecord,
  coOccurrenceNeighbors,
  coOccurrenceByRecordId,
  relationshipCount:DI_RELATIONSHIPS.length,
})

export function getDomainRecords(domain){
  return DOMAIN_RECORDS[domain]||[]
}

export function getRelationshipIntegrity(){
  const errors=[]
  for(const relation of DI_RELATIONSHIPS){
    if(!Object.values(RELATIONSHIP_TYPES).includes(relation.type)){
      errors.push('Unknown relationship type: '+relation.type)
      continue
    }
    const sourceExists=getDomainRecords(relation.source.domain).some(record=>record.id===relation.source.id)
    const targetExists=getDomainRecords(relation.target.domain).some(record=>record.id===relation.target.id)
    if(!sourceExists)errors.push('Unknown relationship source: '+relation.source.domain+'/'+relation.source.id)
    if(!targetExists)errors.push('Unknown relationship target: '+relation.target.domain+'/'+relation.target.id)
  }
  return{valid:errors.length===0,errors}
}

export function getRelationsForRecord(domain,id,type=null){
  const relations=RELATIONSHIP_INDEX.byRecord.get(relationKey(domain,id))||[]
  return type?relations.filter(relation=>relation.type===type):relations
}

export function hasRelationship(sourceId,targetId,type=RELATIONSHIP_TYPES.coOccursWith){
  return DI_RELATIONSHIPS.some(relation=>
    relation.type===type &&
    relation.source.id===sourceId &&
    relation.target.id===targetId
  )
}

export function relationshipScore(recordId,anchorIds=[]){
  const anchors=new Set((Array.isArray(anchorIds)?anchorIds:[]).filter(Boolean))
  if(!recordId||!anchors.size)return 0
  const neighbors=RELATIONSHIP_INDEX.coOccurrenceByRecordId.get(recordId)||[]
  let score=0
  for(const anchorId of anchors)if(neighbors.includes(anchorId))score++
  return score
}
