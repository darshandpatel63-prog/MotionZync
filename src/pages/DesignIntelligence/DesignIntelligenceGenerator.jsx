import {useMemo,useState} from 'react'
import {useAI} from '../../ai/providers/AIProviderContext.jsx'
import {buildRecipe,recipeToTokens} from './engine.js'
import {DI_STYLES,DI_PALETTES,DI_TYPOGRAPHY,DI_STACKS,DI_RECIPES} from './catalog.js'
import './DesignIntelligence.css'

const EXAMPLES=['Build a dark analytics dashboard for developers with a technical, premium feel.','Create a friendly healthcare web product with clear forms and accessible charts.','Design a luxury ecommerce landing page with an editorial mood.']
const byId=(records,id,fallback)=>records.find(record=>record.id===id)||fallback
const extractJson=(text)=>{const raw=String(text||'').trim();const fenced=raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);const candidate=fenced?.[1]||raw;try{return JSON.parse(candidate)}catch{return null}}

function buildDIContext(prompt,recipe){
  return JSON.stringify({
    system:'MotionZync Design Intelligence is the canonical design-knowledge and validation layer. It is not the visual authoring model.',
    rules:['Preserve usability, accessibility, responsive behavior and platform compatibility.','Do not invent catalog records, fonts, technologies or capabilities.','Avoid converging every interface to one recognizable AI/MotionZync template.','Use the provided catalog IDs when selecting known design knowledge.','Return only valid JSON; do not return executable HTML or JavaScript.'],
    request:prompt,
    deterministicRecipe:{styleId:recipe.style.id,paletteId:recipe.palette.id,typographyId:recipe.typography.id,stackId:recipe.stack?.id,layout:recipe.layout,navigation:recipe.navigation},
    allowed:{styleIds:DI_STYLES.map(r=>r.id),paletteIds:DI_PALETTES.map(r=>r.id),typographyIds:DI_TYPOGRAPHY.map(r=>r.id),stackIds:DI_STACKS.map(r=>r.id),recipeIds:DI_RECIPES.map(r=>r.id)}
  })
}

export default function DesignIntelligenceGenerator(){
  const {activeProvider,activeModel,getConfig,generateText,isLoading}=useAI()
  const [prompt,setPrompt]=useState(EXAMPLES[0]);const [submitted,setSubmitted]=useState(EXAMPLES[0]);const [aiEnabled,setAiEnabled]=useState(false);const [aiStatus,setAiStatus]=useState('');const [aiOutput,setAiOutput]=useState(null)
  const deterministicRecipe=useMemo(()=>buildRecipe(submitted),[submitted])
  const recipe=useMemo(()=>{
    if(!aiOutput)return deterministicRecipe
    return {...deterministicRecipe,style:byId(DI_STYLES,aiOutput.styleId,deterministicRecipe.style),palette:byId(DI_PALETTES,aiOutput.paletteId,deterministicRecipe.palette),typography:byId(DI_TYPOGRAPHY,aiOutput.typographyId,deterministicRecipe.typography),stack:byId(DI_STACKS,aiOutput.stackId,deterministicRecipe.stack),layout:typeof aiOutput.layout==='string'&&aiOutput.layout.trim()?aiOutput.layout:deterministicRecipe.layout,navigation:typeof aiOutput.navigation==='string'&&aiOutput.navigation.trim()?aiOutput.navigation:deterministicRecipe.navigation,warnings:[...deterministicRecipe.warnings,...(Array.isArray(aiOutput.warnings)?aiOutput.warnings.filter(v=>typeof v==='string').slice(0,5):[])],aiAssisted:true}
  },[aiOutput,deterministicRecipe])
  const tokens=recipeToTokens(recipe)
  const previewStyle={background:recipe.palette.background,color:recipe.palette.text,'--di-accent':recipe.palette.accent,'--di-cta':recipe.palette.cta}
  const runAI=async()=>{
    setSubmitted(prompt);setAiOutput(null);setAiStatus('')
    const cfg=getConfig(activeProvider)
    if(!cfg.noKeyRequired&&!cfg.apiKey){setAiStatus('Configure and unlock the existing AI API-key vault first.');return}
    try{
      setAiStatus('AI is refining the deterministic Design Recipe…')
      const base=buildRecipe(prompt)
      const text=await generateText(activeProvider,'You are the execution model connected to MotionZync Design Intelligence. The Design Intelligence layer supplies the canonical knowledge, constraints, relationships and allowed record IDs. Refine the recipe; do not invent records.\n\n'+buildDIContext(prompt,base)+'\n\nReturn JSON with only these optional fields: styleId, paletteId, typographyId, stackId, layout, navigation, warnings.')
      const parsed=extractJson(text)
      if(!parsed){setAiStatus('AI returned an invalid structure; the deterministic recipe remains active.');return}
      setAiOutput(parsed);setAiStatus('AI-assisted recipe applied. Unknown IDs were safely ignored; the preview is deterministic and non-executable.')
    }catch(error){setAiStatus(error?.message||'AI generation failed; deterministic mode remains available.')}
  }
  return <div className="di-page"><section className="di-page-intro"><span className="di-kicker">GENERATE</span><h1>Build a Design Recipe</h1><p>Describe the product. Deterministic Design Intelligence creates the baseline; the optional existing BYOK AI provider can refine the structured recipe without executing generated code.</p></section><section className="di-generator-grid"><div className="di-surface"><label className="di-label" htmlFor="di-prompt">Your requirement</label><textarea id="di-prompt" className="di-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} rows={7}/><div className="di-example-row">{EXAMPLES.map(example=><button key={example} onClick={()=>setPrompt(example)}>{example}</button>)}</div><button className="di-btn di-btn-primary di-full" onClick={()=>{setSubmitted(prompt);setAiOutput(null);setAiStatus('')}}>Generate deterministic recipe</button><button className="di-btn di-full" aria-pressed={aiEnabled} onClick={()=>setAiEnabled(v=>!v)}>{aiEnabled?'✓ AI-assisted mode enabled':'Enable AI-assisted refinement'}</button>{aiEnabled&&<><div className="di-muted" style={{marginTop:10}}>Provider: <b>{activeProvider}</b> · Model: <b>{activeModel}</b></div><button className="di-btn di-full" onClick={runAI} disabled={isLoading}>{isLoading?'AI is working…':'Refine with selected AI provider'}</button></>}{aiStatus&&<div className="di-warning" role="status">{aiStatus}</div>}</div><div className="di-surface"><div className="di-record-head"><span className="di-record-domain">INTERPRETED REQUEST</span><span className="di-tier tier-free">{recipe.aiAssisted?'AI-assisted':'Deterministic'}</span></div><div className="di-kv"><span>Product</span><b>{recipe.request.product}</b><span>Industry</span><b>{recipe.request.industry}</b><span>Platform</span><b>{recipe.request.platform}</b><span>Mode</span><b>{recipe.request.mode}</b><span>Mood</span><b>{recipe.request.mood}</b></div></div></section><section className="di-recipe-grid"><article className="di-surface"><span className="di-kicker">RECIPE</span><h2>{recipe.style.name} · {recipe.palette.name}</h2><p className="di-muted">{recipe.layout}</p><div className="di-recipe-list"><div><b>Typography</b><span>{recipe.typography.name}</span></div><div><b>Chart</b><span>{recipe.chart?.name||'Not required'}</span></div><div><b>Stack</b><span>{recipe.stack?.name}</span></div><div><b>Navigation</b><span>{recipe.navigation}</span></div><div><b>Access tier</b><span>{recipe.tier}</span></div></div>{recipe.warnings.map(w=><div className="di-warning" key={w}>⚠ {w}</div>)}</article><article className="di-preview" style={previewStyle}><div className="di-preview-nav"><span>MotionZync</span><span>Dashboard</span><span>Analytics</span><span>Settings</span></div><div className="di-preview-body"><div className="di-preview-kpi"><span>Signal</span><strong>84.7%</strong><small>+12.4%</small></div><div className="di-preview-chart"><span>Activity trend</span><div className="di-bars"><i/><i/><i/><i/><i/><i/><i/></div></div><div className="di-preview-cards"><div>Team <b>14</b></div><div>Projects <b>32</b></div><div>Latency <b>128ms</b></div></div></div></article></section><section className="di-surface"><div className="di-section-heading"><div><span className="di-kicker">TOKENS</span><h2>Generated design tokens</h2></div></div><pre className="di-code">{JSON.stringify(tokens,null,2)}</pre></section></div>
}