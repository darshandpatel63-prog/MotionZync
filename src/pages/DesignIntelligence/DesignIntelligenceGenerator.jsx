import {useEffect,useMemo,useState} from 'react'
import {useAI} from '../../ai/providers/AIProviderContext.jsx'
import {useAuth} from '../../context/AuthContext.jsx'
import {buildRecipe,evaluateCompatibility,getAccessibleRecord,recipeToTokens,recipeToExport,recipeToCSSVariables,validateRecipe} from './engine.js'
import {DI_STYLES,DI_PALETTES,DI_TYPOGRAPHY,DI_CHARTS,DI_STACKS,DI_RECIPES} from './catalog.js'
import {accessLabel,hasEntitlement} from './access.js'
import {fetchDesignIntelligenceKnowledge,mergeKnowledgeCatalog} from './knowledgeClient.js'
import './DesignIntelligence.css'

const EXAMPLES=['Build a dark analytics dashboard for developers with a technical, premium feel.','Create a friendly healthcare web product with clear forms and accessible charts.','Design a luxury ecommerce landing page with an editorial mood.']
const PUBLIC_CATALOG={styles:DI_STYLES,palettes:DI_PALETTES,typography:DI_TYPOGRAPHY,charts:DI_CHARTS,stacks:DI_STACKS,recipes:DI_RECIPES}
const extractJson=(text)=>{const raw=String(text||'').trim();const fenced=raw.match(/\`\`\`(?:json)?\s*([\s\S]*?)\s*\`\`\`/i);const candidate=fenced?.[1]||raw;try{return JSON.parse(candidate)}catch{return null}}
const downloadText=(filename,text,mime)=>{const blob=new Blob([text],{type:mime});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),0)}

function buildDIContext(prompt,recipe,catalogs,entitlementTier='free'){
  return JSON.stringify({
    system:'MotionZync Design Intelligence is the canonical design-knowledge and validation layer. It is not the visual authoring model.',
    rules:['Preserve usability, accessibility, responsive behavior and platform compatibility.','Do not invent catalog records, fonts, technologies or capabilities.','Avoid converging every interface to one recognizable AI/MotionZync template.','Use the provided catalog IDs when selecting known design knowledge.','Return only valid JSON; do not return executable HTML or JavaScript.'],
    request:prompt,
    deterministicRecipe:{styleId:recipe.style.id,paletteId:recipe.palette.id,typographyId:recipe.typography.id,stackId:recipe.stack?.id,layout:recipe.layout,navigation:recipe.navigation},
    allowed:{
      styleIds:catalogs.styles.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      paletteIds:catalogs.palettes.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      typographyIds:catalogs.typography.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      stackIds:catalogs.stacks.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      recipeIds:catalogs.recipes.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id)
    }
  })
}

const Preview=({recipe,style})=>{
  const baseProps={className:'di-preview',style}
  if(recipe.compositionFamily==='commerce')return <article {...baseProps}><div className="di-preview-editorial-nav"><span>MotionZync</span><span>Shop</span><span>Collections</span><span>Account</span></div><div className="di-preview-commerce"><div><small>NEW COLLECTION</small><h3>Designed for confident decisions</h3><p>Editorial product storytelling with a focused conversion path.</p><button className="di-preview-cta">Explore collection</button></div><div className="di-preview-product"><span>PRODUCT VIEW</span><strong>01</strong><small>Premium object / detail space</small></div></div></article>
  if(recipe.compositionFamily==='editorial')return <article {...baseProps}><div className="di-preview-editorial-nav"><span>MotionZync</span><span>Journal</span><span>Work</span><span>About</span></div><div className="di-preview-editorial"><small>FEATURED STORY</small><h3>Ideas deserve room to breathe.</h3><p>Typography-led composition with asymmetric content rhythm and deliberate negative space.</p><div className="di-preview-editorial-grid"><div>01 — Story</div><div>02 — Visual</div><div>03 — Detail</div></div></div></article>
  if(recipe.compositionFamily==='mobile')return <article {...baseProps}><div className="di-preview-phone"><div className="di-preview-phone-top"><span>9:41</span><span>•••</span></div><div className="di-preview-phone-content"><small>Overview</small><strong>84.7%</strong><div className="di-preview-phone-card"><span>Activity</span><div className="di-bars"><i/><i/><i/><i/><i/></div></div><div className="di-preview-phone-list"><span>Projects</span><b>12</b></div><div className="di-preview-phone-list"><span>Alerts</span><b>3</b></div></div></div></article>
  if(recipe.compositionFamily==='workspace')return <article {...baseProps}><div className="di-preview-workspace-head"><span>Workspace</span><span>● Live</span></div><div className="di-preview-workspace"><aside><b>Sections</b><span>Overview</span><span>Records</span><span>Forms</span><span>Insights</span></aside><div><div className="di-preview-form"><small>Current task</small><h3>Review submitted information</h3><p>Structured, accessible workflow with clear state feedback.</p><button className="di-preview-cta">Continue</button></div></div></div></article>
  return <article {...baseProps}><div className="di-preview-nav"><span>MotionZync</span><span>Dashboard</span><span>Analytics</span><span>Settings</span></div><div className="di-preview-body"><div className="di-preview-kpi"><span>Signal</span><strong>84.7%</strong><small>+12.4%</small></div><div className="di-preview-chart"><span>Activity trend</span><div className="di-bars"><i/><i/><i/><i/><i/><i/><i/></div></div><div className="di-preview-cards"><div>Team <b>14</b></div><div>Projects <b>32</b></div><div>Latency <b>128ms</b></div></div></div></article>
}

export default function DesignIntelligenceGenerator(){
  const {activeProvider,activeModel,getConfig,generateText,isLoading}=useAI()
  const {user}=useAuth()
  const [catalog,setCatalog]=useState(PUBLIC_CATALOG)
  const [entitlementTier,setEntitlementTier]=useState('free')
  const [knowledgeState,setKnowledgeState]=useState('Loading free knowledge…')
  const [prompt,setPrompt]=useState(EXAMPLES[0]);const [submitted,setSubmitted]=useState(EXAMPLES[0]);const [aiEnabled,setAiEnabled]=useState(false);const [aiStatus,setAiStatus]=useState('');const [aiOutput,setAiOutput]=useState(null)

  useEffect(()=>{
    let active=true
    fetchDesignIntelligenceKnowledge(user)
      .then(result=>{
        if(!active)return
        setCatalog(prev=>mergeKnowledgeCatalog(prev,result.catalogs))
        setEntitlementTier(result.entitlementTier||'free')
        setKnowledgeState(result.protectedIncluded?'Verified entitlement knowledge loaded.':'Free knowledge loaded.')
      })
      .catch(error=>{
        if(!active)return
        setKnowledgeState(error?.message||'Free knowledge remains available.')
      })
    return()=>{active=false}
  },[user])

  const deterministicRecipe=useMemo(()=>buildRecipe(submitted,entitlementTier,catalog),[submitted,entitlementTier,catalog])
  const recipe=useMemo(()=>{
    if(!aiOutput)return deterministicRecipe
    const candidate={...deterministicRecipe,style:getAccessibleRecord(catalog.styles,aiOutput.styleId,entitlementTier)||deterministicRecipe.style,palette:getAccessibleRecord(catalog.palettes,aiOutput.paletteId,entitlementTier)||deterministicRecipe.palette,typography:getAccessibleRecord(catalog.typography,aiOutput.typographyId,entitlementTier)||deterministicRecipe.typography,stack:getAccessibleRecord(catalog.stacks,aiOutput.stackId,entitlementTier)||deterministicRecipe.stack,layout:typeof aiOutput.layout==='string'&&aiOutput.layout.trim()?aiOutput.layout:deterministicRecipe.layout,navigation:typeof aiOutput.navigation==='string'&&aiOutput.navigation.trim()?aiOutput.navigation:deterministicRecipe.navigation,warnings:[...deterministicRecipe.warnings,...(Array.isArray(aiOutput.warnings)?aiOutput.warnings.filter(v=>typeof v==='string').slice(0,5):[])],aiAssisted:true}
    const compatibility=evaluateCompatibility(candidate)
    const validation=validateRecipe({...candidate,compatibility},entitlementTier,catalog)
    return validation.valid?{...candidate,compatibility,warnings:[...candidate.warnings,...validation.warnings]}:deterministicRecipe
  },[aiOutput,deterministicRecipe,catalog,entitlementTier])
  const tokens=recipeToTokens(recipe)
  const previewStyle={background:recipe.palette.background,color:recipe.palette.text,'--di-accent':recipe.palette.accent,'--di-cta':recipe.palette.cta}
  const runAI=async()=>{
    setSubmitted(prompt);setAiOutput(null);setAiStatus('')
    const cfg=getConfig(activeProvider)
    if(!cfg.noKeyRequired&&!cfg.apiKey){setAiStatus('Configure and unlock the existing AI API-key vault first.');return}
    try{
      setAiStatus('AI is refining the deterministic Design Recipe…')
      const base=buildRecipe(prompt,entitlementTier,catalog)
      const text=await generateText(activeProvider,'You are the execution model connected to MotionZync Design Intelligence. The Design Intelligence layer supplies the canonical knowledge, constraints, relationships and allowed record IDs. Refine the recipe; do not invent records.\n\n'+buildDIContext(prompt,base,catalog,entitlementTier)+'\n\nReturn JSON with only these optional fields: styleId, paletteId, typographyId, stackId, layout, navigation, warnings.')
      const parsed=extractJson(text)
      if(!parsed){setAiStatus('AI returned an invalid structure; the deterministic recipe remains active.');return}
      setAiOutput(parsed);setAiStatus('AI-assisted recipe applied. Unknown IDs were safely ignored; the preview is deterministic and non-executable.')
    }catch(error){setAiStatus(error?.message||'AI generation failed; deterministic mode remains available.')}
  }
  return <div className="di-page"><section className="di-page-intro"><span className="di-kicker">GENERATE</span><h1>Build a Design Recipe</h1><p>Describe the product. Deterministic Design Intelligence creates the baseline; the optional existing BYOK AI provider can refine the structured recipe without executing generated code.</p><div className="di-note" role="status">{knowledgeState} · Access tier: {accessLabel(entitlementTier)}</div></section><section className="di-generator-grid"><div className="di-surface"><label className="di-label" htmlFor="di-prompt">Your requirement</label><textarea id="di-prompt" className="di-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} rows={7}/><div className="di-example-row">{EXAMPLES.map(example=><button key={example} onClick={()=>setPrompt(example)}>{example}</button>)}</div><button className="di-btn di-btn-primary di-full" onClick={()=>{setSubmitted(prompt);setAiOutput(null);setAiStatus('')}}>Generate deterministic recipe</button><button className="di-btn di-full" aria-pressed={aiEnabled} onClick={()=>setAiEnabled(v=>!v)}>{aiEnabled?'✓ AI-assisted mode enabled':'Enable AI-assisted refinement'}</button>{aiEnabled&&<><div className="di-muted" style={{marginTop:10}}>Provider: <b>{activeProvider}</b> · Model: <b>{activeModel}</b></div><button className="di-btn di-full" onClick={runAI} disabled={isLoading}>{isLoading?'AI is working…':'Refine with selected AI provider'}</button></>}{aiStatus&&<div className="di-warning" role="status">{aiStatus}</div>}</div><div className="di-surface"><div className="di-record-head"><span className="di-record-domain">INTERPRETED REQUEST</span><span className="di-tier tier-free">{recipe.aiAssisted?'AI-assisted':'Deterministic'}</span></div><div className="di-kv"><span>Product</span><b>{recipe.request.product}</b><span>Industry</span><b>{recipe.request.industry}</b><span>Platform</span><b>{recipe.request.platform}</b><span>Mode</span><b>{recipe.request.mode}</b><span>Mood</span><b>{recipe.request.mood}</b></div></div></section><section className="di-recipe-grid"><article className="di-surface"><span className="di-kicker">RECIPE</span><h2>{recipe.style.name} · {recipe.palette.name}</h2><p className="di-muted">{recipe.layout}</p><div className="di-recipe-list"><div><b>Typography</b><span>{recipe.typography.name}</span></div><div><b>Chart</b><span>{recipe.chart?.name||'Not required'}</span></div><div><b>Stack</b><span>{recipe.stack?.name}</span></div><div><b>Navigation</b><span>{recipe.navigation}</span></div><div><b>Access tier</b><span>{accessLabel(recipe.tier)}</span></div><div><b>Compatibility</b><span>{recipe.compatibility?.status||'compatible'}</span></div></div>{recipe.warnings.map(w=><div className="di-warning" key={w}>⚠ {w}</div>)}</article><Preview recipe={recipe} style={previewStyle}/></section><section className="di-surface"><div className="di-section-heading"><div><span className="di-kicker">EXPORT</span><h2>Safe machine-readable outputs</h2><p className="di-muted">These exports contain recipe data/tokens only. No executable HTML or JavaScript is generated by this export layer.</p></div></div><div className="di-actions"><button className="di-btn di-btn-primary" onClick={()=>{const data=recipeToExport(recipe);if(data)downloadText('motionzync-design-recipe.json',JSON.stringify(data,null,2),'application/json')}} disabled={!recipe.valid}>Download recipe JSON</button><button className="di-btn di-btn-secondary" onClick={()=>downloadText('motionzync-design-tokens.css',':root{\n'+recipeToCSSVariables(recipe)+'}','text/css')} disabled={!recipe.valid}>Download CSS variables</button></div><pre className="di-code">{JSON.stringify(tokens,null,2)}</pre></section></div>
}
