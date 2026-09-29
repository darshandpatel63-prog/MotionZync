// MotionZync Design Intelligence — provenance-aware content pipeline helpers.
// Phase A foundation: prepare externally researched/curated batches without publishing them.
// This module does not fetch sources, invent content, or write to a database.

import {ALL_DI_RECORDS} from './catalog.js'
import {
  DI_DOMAINS,
  PUBLISHABLE_PROVENANCE_STATUS,
  validateRecordShape,
  PROVENANCE_STATUS,
  validatePublishableCatalog,
} from './schema.js'

const existingIds=new Set(ALL_DI_RECORDS.map(record=>record.id))

export function validateImportBatch(domain,records=[],{requirePublishable=false}={}){
  const errors=[]
  const warnings=[]
  if(!DI_DOMAINS.includes(domain))return{valid:false,domain,errors:['Unknown catalog domain: '+domain],warnings,records:[]}
  if(!Array.isArray(records))return{valid:false,domain,errors:['Import batch must be an array.'],warnings,records:[]}

  const seen=new Set()
  for(const record of records){
    const result=validateRecordShape(record,domain,{requireProvenance:true})
    errors.push(...result.errors)
    warnings.push(...result.warnings)
    if(record?.id){
      if(seen.has(record.id))errors.push('Duplicate ID inside import batch: '+record.id)
      seen.add(record.id)
      if(existingIds.has(record.id))errors.push('Import ID already exists in canonical catalog: '+record.id)
    }
    if(!PROVENANCE_STATUS.includes(record?.provenance?.status)){
      errors.push('Import record '+(record?.id||'<unknown>')+' has an invalid provenance status.')
    }
    if(requirePublishable){
      if(record?.provenance?.status!==PUBLISHABLE_PROVENANCE_STATUS){
        errors.push('Import record '+(record?.id||'<unknown>')+' is not publishable; provenance status must be '+PUBLISHABLE_PROVENANCE_STATUS+'.')
      }
      if(record?.provenance?.sourceType!=='original'&&!record?.provenance?.sourceUrl){
        errors.push('Publishable import record '+(record?.id||'<unknown>')+' requires sourceUrl for non-original provenance.')
      }
    }
  }

  return{valid:errors.length===0,domain,errors,warnings,records:records.slice()}
}

export function getPublishableRecords(records=[]){
  return Array.isArray(records)
    ?records.filter(record=>record?.provenance?.status===PUBLISHABLE_PROVENANCE_STATUS&&typeof record.provenance?.checkedAt==='string'&&record.provenance.checkedAt.trim())
    :[]
}

export function buildPublicationReport(catalogs){
  const report=validatePublishableCatalog(catalogs)
  return{
    ...report,
    publishableDomains:DI_DOMAINS.filter(domain=>{
      const records=Array.isArray(catalogs?.[domain])?catalogs[domain]:[]
      return records.length>0&&records.every(record=>record?.provenance?.status===PUBLISHABLE_PROVENANCE_STATUS&&typeof record.provenance?.checkedAt==='string'&&record.provenance.checkedAt.trim())
    }),
  }
}
