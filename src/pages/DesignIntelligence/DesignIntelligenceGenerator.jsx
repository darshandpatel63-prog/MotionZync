import {useEffect,useMemo,useState} from 'react'
import {useSearchParams,Link} from 'react-router-dom'
import {useAI} from '../../ai/providers/AIProviderContext.jsx'
import {useAuth} from '../../context/AuthContext.jsx'
import {buildRecipe,evaluateCompatibility,getAccessibleRecord,recipeToTokens,recipeToExport,validateRecipe} from './engine.js'
import {DI_STYLES,DI_PALETTES,DI_TYPOGRAPHY,DI_CHARTS,DI_STACKS,DI_RECIPES} from './catalog.js'
import {accessLabel,hasEntitlement} from './access.js'
import {fetchDesignIntelligenceKnowledge,mergeKnowledgeCatalog} from './knowledgeClient.js'
import DesignTemplateCustomizer,{DEFAULT_TEMPLATE_CONFIG} from './DesignTemplateCustomizer.jsx'
import './DesignTemplateCustomizer.css'
import './DesignIntelligence.css'
import manifest from './ui-design-bundle/manifest.json'
import './DesignBundleGalleryThemes.css'

const EXAMPLES=['Build a dark analytics dashboard for developers with a technical, premium feel.','Create a friendly healthcare web product with clear forms and accessible charts.','Design a luxury ecommerce landing page with an editorial mood.']
const PREVIEW_VIEWPORTS=[{value:'desktop',label:'Desktop'},{value:'tablet',label:'Tablet'},{value:'mobile',label:'Mobile'}]
const PUBLIC_CATALOG={styles:DI_STYLES,palettes:DI_PALETTES,typography:DI_TYPOGRAPHY,charts:DI_CHARTS,stacks:DI_STACKS,recipes:DI_RECIPES}
const TEMPLATE_MODULES=import.meta.glob('./ui-design-bundle/designs/**/Design.jsx')
const TEMPLATE_THEMES=['light','dark','colorful','high-contrast']
const tierRank=tier=>tier==='ultra-premium'?2:tier==='premium'?1:0
const TEMPLATE_STOPWORDS=new Set(['the','and','for','with','from','that','this','into','your','our','you','are','was','will','can','has','have','make','build','create','design','page','website','web','app','application','product','user','users','please','want','need','like','use','based','feel','more','less','very','nice','good'])
const TEMPLATE_SYNONYMS={
  dashboard:['analytics','metrics','admin','monitoring','reporting'],
  analytics:['metrics','dashboard','reporting','data','charts'],
  healthcare:['health','medical','clinic','patient','wellness'],
  ecommerce:['commerce','shop','store','product','checkout'],
  shopping:['commerce','ecommerce','store','product','checkout'],
  education:['learning','course','student','school','lesson'],
  portfolio:['creative','agency','showcase','personal'],
  mobile:['phone','ios','android','app'],
  finance:['fintech','banking','payment','wallet','accounting'],
  saas:['dashboard','workspace','analytics','admin'],
  3d:['configurator','immersive','three','model'],
  ai:['artificial','intelligence','assistant','agent'],
}
function findMatchingTemplate(query,accessTier){
  const tokens=[...new Set(String(query||'').toLowerCase().match(/[a-z0-9]+/g)||[])].filter(token=>token.length>2&&!TEMPLATE_STOPWORDS.has(token))
  if(!tokens.length)return null
  const expanded=new Set(tokens)
  for(const token of tokens)for(const alias of TEMPLATE_SYNONYMS[token]||[])expanded.add(alias)
  const allowed=manifest.designs.filter(item=>tierRank(item.tier)<=tierRank(accessTier))
  const ranked=allowed.map((item,index)=>{
    const category=String(item.category||'').toLowerCase().replace(/-/g,' ')
    const id=String(item.id||'').toLowerCase().replace(/-/g,' ')
    const name=String(item.name||'').toLowerCase()
    const description=String(item.description||'').toLowerCase()
    const tags=(Array.isArray(item.tags)?item.tags:[]).join(' ').toLowerCase()
    const score=[...expanded].reduce((total,token)=>total+(category.includes(token)?7:0)+(name.includes(token)?5:0)+(id.includes(token)?3:0)+(tags.includes(token)?3:0)+(description.includes(token)?1:0),0)
    return {item,index,score}
  }).sort((a,b)=>b.score-a.score||a.index-b.index)
  return ranked[0]?.score>0?ranked[0].item:null
}
const extractJson=(text)=>{const raw=String(text||'').trim();const fenced=raw.match(/\`\`\`(?:json)?\s*([\s\S]*?)\s*\`\`\`/i);const candidate=fenced?.[1]||raw;try{return JSON.parse(candidate)}catch{return null}}
const downloadText=(filename,text,mime)=>{const blob=new Blob([text],{type:mime});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),0)}

function buildDIContext(prompt,recipe,catalogs,entitlementTier='free',selectedTemplate=null,customization={}){
  return JSON.stringify({
    system:'MotionZync Design Intelligence is the canonical design-knowledge and validation layer. It is not the visual authoring model.',
    rules:['Preserve usability, accessibility, responsive behavior and platform compatibility.','Do not invent catalog records, fonts, technologies or capabilities.','Avoid converging every interface to one recognizable AI/MotionZync template.','Use the provided catalog IDs when selecting known design knowledge.','Treat an imported template as the chosen composition, not as a source of protected entitlement.','Return only valid JSON; do not return executable HTML or JavaScript.'],
    request:prompt,
    selectedTemplate:selectedTemplate?{id:selectedTemplate.id,name:selectedTemplate.name,category:selectedTemplate.category,tier:selectedTemplate.tier,description:selectedTemplate.description}:null,
    requestedCustomization:customization,
    deterministicRecipe:{styleId:recipe.style.id,paletteId:recipe.palette.id,typographyId:recipe.typography.id,chartId:recipe.chart?.id||null,stackId:recipe.stack?.id||null,layout:recipe.layout,navigation:recipe.navigation},
    allowed:{
      styleIds:catalogs.styles.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      paletteIds:catalogs.palettes.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      typographyIds:catalogs.typography.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      chartIds:catalogs.charts.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      stackIds:catalogs.stacks.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id),
      recipeIds:catalogs.recipes.filter(r=>hasEntitlement(r.tier,entitlementTier)).map(r=>r.id)
    }
  })
}

const Preview=({recipe,style,viewport})=>{
  const baseProps={className:`di-preview di-preview-viewport-${viewport}`,style}
  if(recipe.compositionFamily==='commerce')return <article {...baseProps}><div className="di-preview-editorial-nav"><span>MotionZync</span><span>Shop</span><span>Collections</span><span>Account</span></div><div className="di-preview-commerce"><div><small>NEW COLLECTION</small><h3>Designed for confident decisions</h3><p>Editorial product storytelling with a focused conversion path.</p><button className="di-preview-cta">Explore collection</button></div><div className="di-preview-product"><span>PRODUCT VIEW</span><strong>01</strong><small>Premium object / detail space</small></div></div></article>
  if(recipe.compositionFamily==='editorial')return <article {...baseProps}><div className="di-preview-editorial-nav"><span>MotionZync</span><span>Journal</span><span>Work</span><span>About</span></div><div className="di-preview-editorial"><small>FEATURED STORY</small><h3>Ideas deserve room to breathe.</h3><p>Typography-led composition with asymmetric content rhythm and deliberate negative space.</p><div className="di-preview-editorial-grid"><div>01 — Story</div><div>02 — Visual</div><div>03 — Detail</div></div></div></article>
  if(recipe.compositionFamily==='mobile')return <article {...baseProps}><div className="di-preview-phone"><div className="di-preview-phone-top"><span>9:41</span><span>•••</span></div><div className="di-preview-phone-content"><small>Overview</small><strong>84.7%</strong><div className="di-preview-phone-card"><span>Activity</span><div className="di-bars"><i/><i/><i/><i/><i/></div></div><div className="di-preview-phone-list"><span>Projects</span><b>12</b></div><div className="di-preview-phone-list"><span>Alerts</span><b>3</b></div></div></div></article>
  if(recipe.compositionFamily==='workspace')return <article {...baseProps}><div className="di-preview-workspace-head"><span>Workspace</span><span>● Live</span></div><div className="di-preview-workspace"><aside><b>Sections</b><span>Overview</span><span>Records</span><span>Forms</span><span>Insights</span></aside><div><div className="di-preview-form"><small>Current task</small><h3>Review submitted information</h3><p>Structured, accessible workflow with clear state feedback.</p><button className="di-preview-cta">Continue</button></div></div></div></article>
  return <article {...baseProps}><div className="di-preview-nav"><span>MotionZync</span><span>Dashboard</span><span>Analytics</span><span>Settings</span></div><div className="di-preview-body"><div className="di-preview-kpi"><span>Signal</span><strong>84.7%</strong><small>+12.4%</small></div><div className="di-preview-chart"><span>Activity trend</span><div className="di-bars"><i/><i/><i/><i/><i/><i/><i/></div></div><div className="di-preview-cards"><div>Team <b>14</b></div><div>Projects <b>32</b></div><div>Latency <b>128ms</b></div></div></div></article>
}

export default function DesignIntelligenceGenerator(){
  const {activeProvider,activeModel,getConfig,generateText,isLoading}=useAI()
  const {user}=useAuth()
  const [searchParams]=useSearchParams()
  const requestedTemplateId=searchParams.get('template')||''
  const requestedTemplateTheme=TEMPLATE_THEMES.includes(searchParams.get('theme'))?searchParams.get('theme'):'light'
  const [selectedTemplatePreview,setSelectedTemplatePreview]=useState(null)
  const [selectedTemplateState,setSelectedTemplateState]=useState('')
  const [selectedTemplateTheme,setSelectedTemplateTheme]=useState(requestedTemplateTheme)
  const [generatedTemplateId,setGeneratedTemplateId]=useState(requestedTemplateId)
  const [templateMatchStatus,setTemplateMatchStatus]=useState('')
  const selectedTemplate=manifest.designs.find(item=>item.id===generatedTemplateId)||null
  const templatePrompt=selectedTemplate?'Customize the '+selectedTemplate.name+' UI composition in the '+selectedTemplate.category.replace(/-/g,' ')+' category. Preserve its main composition and tailor the content, visual direction, responsive behaviour and accessibility to my product brief.':EXAMPLES[0]
  const SelectedTemplatePreview=selectedTemplatePreview
  const [catalog,setCatalog]=useState(PUBLIC_CATALOG)
  const [entitlementTier,setEntitlementTier]=useState('free');const [designAccessTier,setDesignAccessTier]=useState('free');const [contentAccessReason,setContentAccessReason]=useState('public-free')
  const [knowledgeState,setKnowledgeState]=useState('Loading free knowledge…')
  const [prompt,setPrompt]=useState(templatePrompt);const [submitted,setSubmitted]=useState(templatePrompt);const [previewViewport,setPreviewViewport]=useState('desktop');const [recipeChoices,setRecipeChoices]=useState({style:'',palette:'',typography:'',chart:'',stack:''});const [templateConfig,setTemplateConfig]=useState(()=>({...DEFAULT_TEMPLATE_CONFIG}));const [aiEnabled,setAiEnabled]=useState(false);const [aiStatus,setAiStatus]=useState('');const [aiOutput,setAiOutput]=useState(null)
  const requestedIngredientDomain=searchParams.get('ingredientDomain')||''
  const requestedIngredientId=searchParams.get('ingredient')||''

  useEffect(()=>{
    let active=true
    fetchDesignIntelligenceKnowledge(user)
      .then(result=>{
        if(!active)return
        setCatalog(prev=>mergeKnowledgeCatalog(prev,result.catalogs))
        setEntitlementTier(result.entitlementTier||'free')
        setDesignAccessTier(result.designAccessTier||result.entitlementTier||'free')
        setContentAccessReason(result.contentAccessReason||'public-free')
        setKnowledgeState(result.ultraContentIncluded&&result.entitlementTier==='premium'?'Ultra Premium design content is shared by the current admin policy; developer API access stays Premium-restricted.':result.protectedIncluded?'Verified entitlement knowledge loaded.':'Free knowledge loaded.')
      })
      .catch(error=>{
        if(!active)return
        setKnowledgeState(error?.message||'Free knowledge remains available.')
      })
    return()=>{active=false}
  },[user])

  useEffect(()=>{
    setGeneratedTemplateId(requestedTemplateId)
    setTemplateMatchStatus('')
    setPrompt(templatePrompt)
    setSubmitted(templatePrompt)
    setRecipeChoices({style:'',palette:'',typography:'',chart:'',stack:''})
    setTemplateConfig({...DEFAULT_TEMPLATE_CONFIG})
    setAiOutput(null)
    setAiStatus('')
  },[requestedTemplateId])

  useEffect(()=>{
    setSelectedTemplateTheme(requestedTemplateTheme)
  },[requestedTemplateTheme])

  useEffect(()=>{
    if(!requestedIngredientDomain||!requestedIngredientId)return
    const selections={}
    const directDomainMap={styles:'style',palettes:'palette',typography:'typography',charts:'chart',stacks:'stack'}
    const targetField=directDomainMap[requestedIngredientDomain]
    if(targetField)selections[targetField]=requestedIngredientId
    if(requestedIngredientDomain==='recipes'){
      const selectedRecipe=catalog.recipes.find(record=>record.id===requestedIngredientId)
      if(selectedRecipe){
        selections.style=selectedRecipe.styleId
        selections.palette=selectedRecipe.paletteId
        selections.typography=selectedRecipe.typographyId
        selections.chart=selectedRecipe.chartIds?.[0]||''
        selections.stack=selectedRecipe.stackIds?.[0]||''
        const recipePrompt='Use the canonical recipe '+selectedRecipe.name+' as a starting point. Layout: '+selectedRecipe.layout+'. Navigation: '+selectedRecipe.navigation+'. Adapt it to my product brief.'
        setPrompt(recipePrompt)
        setSubmitted(recipePrompt)
      }
    }
    if(Object.keys(selections).length)setRecipeChoices(current=>({...current,...selections}))
  },[requestedIngredientDomain,requestedIngredientId,catalog])

  useEffect(()=>{
    let active=true
    setSelectedTemplatePreview(null)
    setSelectedTemplateState('')
    if(!selectedTemplate){return()=>{active=false}}
    if(tierRank(selectedTemplate.tier)>tierRank(designAccessTier)){
      setSelectedTemplateState('This template requires '+selectedTemplate.tier+' design access. Imported assets are public repository files; this UI state is not asset confidentiality.')
      return()=>{active=false}
    }
    const key='./ui-design-bundle/'+selectedTemplate.entry
    const loader=TEMPLATE_MODULES[key]
    if(!loader){setSelectedTemplateState('Template component was not found in the import map.');return()=>{active=false}}
    setSelectedTemplateState('Loading selected Gallery template…')
    loader().then(module=>{
      if(!active)return
      if(module?.default){setSelectedTemplatePreview(()=>module.default);setSelectedTemplateState('Actual Gallery template loaded. Recipe controls remain available below for canonical design ingredients.')}
      else setSelectedTemplateState('Selected template has no default React component export.')
    }).catch(()=>{if(active)setSelectedTemplateState('Selected template failed to load; the recipe preview remains available.')})
    return()=>{active=false}
  },[selectedTemplate,designAccessTier])

  const deterministicRecipe=useMemo(()=>buildRecipe(submitted,designAccessTier,catalog),[submitted,designAccessTier,catalog])
  const aiRefinedRecipe=useMemo(()=>{
    if(!aiOutput)return deterministicRecipe
    const candidate={...deterministicRecipe,style:getAccessibleRecord(catalog.styles,aiOutput.styleId,designAccessTier)||deterministicRecipe.style,palette:getAccessibleRecord(catalog.palettes,aiOutput.paletteId,designAccessTier)||deterministicRecipe.palette,typography:getAccessibleRecord(catalog.typography,aiOutput.typographyId,designAccessTier)||deterministicRecipe.typography,chart:getAccessibleRecord(catalog.charts,aiOutput.chartId,designAccessTier)||deterministicRecipe.chart,stack:getAccessibleRecord(catalog.stacks,aiOutput.stackId,designAccessTier)||deterministicRecipe.stack,layout:typeof aiOutput.layout==='string'&&aiOutput.layout.trim()?aiOutput.layout:deterministicRecipe.layout,navigation:typeof aiOutput.navigation==='string'&&aiOutput.navigation.trim()?aiOutput.navigation:deterministicRecipe.navigation,warnings:[...deterministicRecipe.warnings,...(Array.isArray(aiOutput.warnings)?aiOutput.warnings.filter(v=>typeof v==='string').slice(0,5):[])],aiAssisted:true}
    const compatibility=evaluateCompatibility(candidate)
    const validation=validateRecipe({...candidate,compatibility},designAccessTier,catalog)
    return validation.valid?{...candidate,compatibility,warnings:[...candidate.warnings,...validation.warnings]}:deterministicRecipe
  },[aiOutput,deterministicRecipe,catalog,designAccessTier])

  const recipe=useMemo(()=>{
    const candidate={
      ...aiRefinedRecipe,
      style:getAccessibleRecord(catalog.styles,recipeChoices.style,designAccessTier)||aiRefinedRecipe.style,
      palette:getAccessibleRecord(catalog.palettes,recipeChoices.palette,designAccessTier)||aiRefinedRecipe.palette,
      typography:getAccessibleRecord(catalog.typography,recipeChoices.typography,designAccessTier)||aiRefinedRecipe.typography,
      chart:getAccessibleRecord(catalog.charts,recipeChoices.chart,designAccessTier)||aiRefinedRecipe.chart,
      stack:getAccessibleRecord(catalog.stacks,recipeChoices.stack,designAccessTier)||aiRefinedRecipe.stack,
    }
    const compatibility=evaluateCompatibility(candidate)
    const validation=validateRecipe({...candidate,compatibility},designAccessTier,catalog)
    return validation.valid
      ? {...candidate,compatibility,warnings:[...candidate.warnings,...validation.warnings]}
      : {...aiRefinedRecipe,warnings:[...aiRefinedRecipe.warnings,'One or more custom choices were ignored because they failed compatibility or access validation.']}
  },[aiRefinedRecipe,recipeChoices,catalog,designAccessTier])
  const tokens=recipeToTokens(recipe)
  const activeTemplatePalette=templateConfig.palette==='__recipe__'?recipe.palette:(templateConfig.palette?getAccessibleRecord(catalog.palettes,templateConfig.palette,designAccessTier):null)
  const activeTemplateTypography=templateConfig.typography==='__recipe__'?recipe.typography:(templateConfig.typography?getAccessibleRecord(catalog.typography,templateConfig.typography,designAccessTier):null)
  const activeTemplateStyle=templateConfig.style==='__recipe__'?recipe.style:(templateConfig.style?getAccessibleRecord(catalog.styles,templateConfig.style,designAccessTier):null)
  const activeTemplateChart=templateConfig.chart==='__recipe__'?recipe.chart:(templateConfig.chart?getAccessibleRecord(catalog.charts,templateConfig.chart,designAccessTier):null)
  const activeTemplateStack=templateConfig.stack==='__recipe__'?recipe.stack:(templateConfig.stack?getAccessibleRecord(catalog.stacks,templateConfig.stack,designAccessTier):null)
  const templateStyleTokens=useMemo(()=>{
    if(!selectedTemplate)return {}
    const output={}
    if(activeTemplatePalette){
      const palette=activeTemplatePalette
      const onColor=hex=>{
        const match=String(hex||'').match(/^#([0-9a-f]{6})$/i)
        if(!match)return '#FFFFFF'
        const values=[0,2,4].map(index=>parseInt(match[1].slice(index,index+2),16)/255).map(channel=>channel<=0.04045?channel/12.92:((channel+0.055)/1.055)**2.4)
        const lum=0.2126*values[0]+0.7152*values[1]+0.0722*values[2]
        return lum>0.179?'#111827':'#FFFFFF'
      }
      Object.assign(output,{
        '--mz-surface':palette.surface,'--mz-surface-alt':palette.background,'--mz-surface-raised':palette.surface,
        '--mz-text':palette.text,'--mz-text-muted':palette.muted,'--mz-muted':palette.muted,
        '--mz-accent':palette.accent,'--mz-accent-soft':palette.accent+'22','--mz-on-accent':onColor(palette.accent),
        '--mz-focus':palette.cta,'--mz-border':palette.muted+'55','--mz-success':palette.semantic?.success||'#15803D',
        '--mz-warning':palette.semantic?.warning||'#B45309','--mz-info':palette.accent,'--mz-gridline':palette.accent+'24',
        '--mz-cta':palette.cta,'--mz-primary':palette.primary,'--mz-secondary':palette.secondary,'--mz-background':palette.background,
      })
    }
    if(activeTemplateTypography){
      const family=value=>{
        const name=String(value||'').trim()
        if(!name)return 'system-ui, sans-serif'
        if(name.includes(',')||/^(system-ui|sans-serif|serif|monospace|ui-sans-serif|ui-serif|ui-monospace)$/i.test(name))return name
        return '"'+name.replace(/["\\]/g,'')+'", system-ui, sans-serif'
      }
      output['--mz-font']=family(activeTemplateTypography.body)
      output['--di-font-body']=family(activeTemplateTypography.body)
      output['--di-font-heading']=family(activeTemplateTypography.heading)
    }
    if(templateConfig.readable){output['--mz-fs-h2']='1.6rem';output['--mz-fs-sm']='.95rem'}
    return output
  },[selectedTemplate,activeTemplatePalette,activeTemplateTypography,templateConfig.readable])
  const widthLimit=previewViewport==='mobile'?'390px':previewViewport==='tablet'?'768px':templateConfig.width==='narrow'?'720px':templateConfig.width==='balanced'?'1000px':'100%'
  const templatePreviewStyle={...templateStyleTokens,width:'100%',maxWidth:widthLimit,marginInline:'auto'}
  const previewStyle={background:recipe.palette.background,color:recipe.palette.text,'--di-accent':recipe.palette.accent,'--di-cta':recipe.palette.cta,'--di-corner-radius':templateConfig.corners==='sharp'?'0':templateConfig.corners==='rounded'?'1.1rem':'.5rem',fontFamily:recipe.typography.body}
  const resetTemplateConfig=()=>setTemplateConfig({...DEFAULT_TEMPLATE_CONFIG})
  const generateDeterministicRecipe=()=>{
    setSubmitted(prompt)
    setAiOutput(null)
    setAiStatus('')
    if(requestedTemplateId){setTemplateMatchStatus('Using the UI composition selected from Gallery.');return}
    const match=findMatchingTemplate(prompt,designAccessTier)
    if(match){
      setGeneratedTemplateId(match.id)
      setTemplateMatchStatus('Matched “'+match.name+'” from '+match.category.replace(/-/g,' ')+' using your request and server-authorized '+accessLabel(designAccessTier)+' design access.')
    }else{
      setGeneratedTemplateId('')
      setTemplateMatchStatus(designAccessTier==='free'?'No complete Gallery template is included in Simple / Free design access. Your deterministic recipe and design tokens are still available; Premium/Ultra templates have not been unlocked.':'No permitted Gallery template matched that brief. Your deterministic recipe remains available; add a product category or use Gallery to choose a composition.')
    }
  }
  const exportedRecipe=recipeToExport(recipe)
  const exportPayload=exportedRecipe?{...exportedRecipe,selectedTemplate:selectedTemplate?{id:selectedTemplate.id,name:selectedTemplate.name,category:selectedTemplate.category,tier:selectedTemplate.tier,entry:selectedTemplate.entry}:null,customization:{theme:selectedTemplateTheme,viewport:previewViewport,palette:activeTemplatePalette?.id||null,typography:activeTemplateTypography?{id:activeTemplateTypography.id,name:activeTemplateTypography.name}:null,style:activeTemplateStyle?.id||null,chart:activeTemplateChart?.id||null,stack:activeTemplateStack?.id||null,density:templateConfig.density,spacing:templateConfig.spacing,corners:templateConfig.corners,width:templateConfig.width,reduceMotion:templateConfig.reduceMotion,readable:templateConfig.readable}}:null
  const exportTokens={...tokens,...templateStyleTokens,'--di-content-density':templateConfig.density,'--di-spacing-rhythm':templateConfig.spacing,'--di-corner-treatment':templateConfig.corners,'--di-preview-viewport':previewViewport}
  const runAI=async()=>{
    setSubmitted(prompt);setAiOutput(null);setAiStatus('')
    const cfg=getConfig(activeProvider)
    if(!cfg.noKeyRequired&&!cfg.apiKey){setAiStatus('Configure and unlock the existing AI API-key vault first.');return}
    try{
      setAiStatus('AI is refining the deterministic Design Recipe…')
      const base=buildRecipe(prompt,designAccessTier,catalog)
      const text=await generateText(activeProvider,'You are the execution model connected to MotionZync Design Intelligence. The Design Intelligence layer supplies the canonical knowledge, constraints, relationships and allowed record IDs. Refine the recipe and selected UI specification; do not invent records.\n\n'+buildDIContext(prompt,base,catalog,designAccessTier,selectedTemplate,templateConfig)+'\n\nReturn JSON with only these optional fields: styleId, paletteId, typographyId, chartId, stackId, layout, navigation, warnings.')
      const parsed=extractJson(text)
      if(!parsed){setAiStatus('AI returned an invalid structure; the deterministic recipe remains active.');return}
      setAiOutput(parsed);setAiStatus('AI-assisted recipe applied. Unknown IDs were safely ignored; the preview is deterministic and non-executable.')
    }catch(error){setAiStatus(error?.message||'AI generation failed; deterministic mode remains available.')}
  }
  return <div className="di-page"><section className="di-page-intro"><span className="di-kicker">GENERATE</span><h1>Build a Design Recipe</h1><p>Describe the product. Deterministic Design Intelligence creates the baseline; the optional existing BYOK AI provider can refine the structured recipe without executing generated code.</p><div className="di-note" role="status">{knowledgeState} · Account tier: {accessLabel(entitlementTier)} · Design access: {accessLabel(designAccessTier)}</div><div className="di-actions di-generator-cross-links"><Link className="di-btn di-btn-secondary" to="/design-intelligence/ui-gallery">Browse UI Gallery →</Link><Link className="di-btn di-btn-secondary" to="/design-intelligence/explorer">Explore ingredients →</Link></div></section><section className="di-generator-grid"><div className="di-surface"><label className="di-label" htmlFor="di-prompt">Your requirement</label><textarea id="di-prompt" className="di-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} rows={7}/><details className="di-customize"><summary>Customize recipe choices</summary><div className="di-customize-grid"><div><label className="di-label" htmlFor="di-choice-style">Visual style</label><select id="di-choice-style" className="di-input" value={getAccessibleRecord(catalog.styles,recipeChoices.style,designAccessTier)?recipeChoices.style:''} onChange={e=>setRecipeChoices(current=>({...current,style:e.target.value}))}><option value="">Use generated choice</option>{catalog.styles.filter(record=>hasEntitlement(record.tier,designAccessTier)).map(record=><option key={record.id} value={record.id}>{record.name}</option>)}</select></div><div><label className="di-label" htmlFor="di-choice-palette">Colour palette</label><select id="di-choice-palette" className="di-input" value={getAccessibleRecord(catalog.palettes,recipeChoices.palette,designAccessTier)?recipeChoices.palette:''} onChange={e=>setRecipeChoices(current=>({...current,palette:e.target.value}))}><option value="">Use generated choice</option>{catalog.palettes.filter(record=>hasEntitlement(record.tier,designAccessTier)).map(record=><option key={record.id} value={record.id}>{record.name}</option>)}</select></div><div><label className="di-label" htmlFor="di-choice-typography">Font pairing</label><select id="di-choice-typography" className="di-input" value={getAccessibleRecord(catalog.typography,recipeChoices.typography,designAccessTier)?recipeChoices.typography:''} onChange={e=>setRecipeChoices(current=>({...current,typography:e.target.value}))}><option value="">Use generated choice</option>{catalog.typography.filter(record=>hasEntitlement(record.tier,designAccessTier)).map(record=><option key={record.id} value={record.id}>{record.name}</option>)}</select></div><div><label className="di-label" htmlFor="di-choice-stack">Technology stack</label><select id="di-choice-stack" className="di-input" value={getAccessibleRecord(catalog.stacks,recipeChoices.stack,designAccessTier)?recipeChoices.stack:''} onChange={e=>setRecipeChoices(current=>({...current,stack:e.target.value}))}><option value="">Use generated choice</option>{catalog.stacks.filter(record=>hasEntitlement(record.tier,designAccessTier)).map(record=><option key={record.id} value={record.id}>{record.name}</option>)}</select></div><div><label className="di-label" htmlFor="di-choice-chart">Chart pattern</label><select id="di-choice-chart" className="di-input" value={getAccessibleRecord(catalog.charts,recipeChoices.chart,designAccessTier)?recipeChoices.chart:''} onChange={e=>setRecipeChoices(current=>({...current,chart:e.target.value}))}><option value="">Use generated choice</option>{catalog.charts.filter(record=>hasEntitlement(record.tier,designAccessTier)).map(record=><option key={record.id} value={record.id}>{record.name}</option>)}</select></div><button type="button" className="di-btn di-btn-secondary di-customize-reset" onClick={()=>setRecipeChoices({style:'',palette:'',typography:'',chart:'',stack:''})}>Reset recipe choices</button></div></details><div className="di-example-row">{EXAMPLES.map(example=><button key={example} onClick={()=>setPrompt(example)}>{example}</button>)}</div><button className="di-btn di-btn-primary di-full" onClick={generateDeterministicRecipe}>Generate recipe and match UI composition</button><div className="di-note" role="status" aria-live="polite">{templateMatchStatus||'Describe your product; matching uses only compositions allowed by the verified design-access tier.'}</div><button className="di-btn di-full" aria-pressed={aiEnabled} onClick={()=>setAiEnabled(v=>!v)}>{aiEnabled?'✓ AI-assisted mode enabled':'Enable AI-assisted refinement'}</button>{aiEnabled&&<><div className="di-muted" style={{marginTop:10}}>Provider: <b>{activeProvider}</b> · Model: <b>{activeModel}</b></div><button className="di-btn di-full" onClick={runAI} disabled={isLoading}>{isLoading?'AI is working…':'Refine with selected AI provider'}</button></>}{aiStatus&&<div className="di-warning" role="status">{aiStatus}</div>}</div><div className="di-surface"><div className="di-record-head"><span className="di-record-domain">INTERPRETED REQUEST</span><span className="di-tier tier-free">{recipe.aiAssisted?'AI-assisted':'Deterministic'}</span></div><div className="di-kv"><span>Product</span><b>{recipe.request.product}</b><span>Industry</span><b>{recipe.request.industry}</b><span>Platform</span><b>{recipe.request.platform}</b><span>Mode</span><b>{recipe.request.mode}</b><span>Mood</span><b>{recipe.request.mood}</b></div></div></section><section className="di-recipe-grid"><article className="di-surface"><span className="di-kicker">RECIPE</span><h2>{recipe.style.name} · {recipe.palette.name}</h2><p className="di-muted">{recipe.layout}</p><div className="di-recipe-list"><div><b>Typography</b><span>{recipe.typography.name}</span></div><div><b>Chart</b><span>{recipe.chart?.name||'Not required'}</span></div><div><b>Stack</b><span>{recipe.stack?.name}</span></div><div><b>Navigation</b><span>{recipe.navigation}</span></div><div><b>Access tier</b><span>{accessLabel(recipe.tier)}</span></div><div><b>Compatibility</b><span>{recipe.compatibility?.status||'compatible'}</span></div></div>{recipe.warnings.map(w=><div className="di-warning" key={w}>⚠ {w}</div>)}</article><div className="di-preview-stage"><div className="di-preview-toolbar"><span className="di-kicker">PREVIEW SIZE</span><div className="di-preview-controls" role="group" aria-label="Responsive preview size">{PREVIEW_VIEWPORTS.map(size=><button type="button" key={size.value} className={'di-chip'+(previewViewport===size.value?' active':'')} aria-pressed={previewViewport===size.value} onClick={()=>setPreviewViewport(size.value)}>{size.label}</button>)}</div></div>{selectedTemplate&&<div className="di-surface di-selected-template"><div className="di-record-head"><span className="di-kicker">{requestedTemplateId?'SELECTED GALLERY TEMPLATE':'MATCHED UI COMPOSITION'}</span><span className="di-tier tier-free">{selectedTemplate.category}</span></div><h2>{selectedTemplate.name}</h2><p>{selectedTemplate.description}</p><label className="di-label" htmlFor="di-template-theme">Template preview theme</label><select id="di-template-theme" className="di-input" value={selectedTemplateTheme} onChange={event=>setSelectedTemplateTheme(event.target.value)}>{TEMPLATE_THEMES.map(value=><option key={value} value={value}>{value==='high-contrast'?'High contrast':value[0].toUpperCase()+value.slice(1)}</option>)}</select>{selectedTemplatePreview&&<DesignTemplateCustomizer catalog={catalog} designAccessTier={designAccessTier} config={templateConfig} onChange={setTemplateConfig} onReset={resetTemplateConfig}/>}<p className="di-preview-caption" role="status">{selectedTemplateState}</p>{selectedTemplatePreview&&<div className="dib-rendered-preview di-template-rendered" data-theme={selectedTemplateTheme} data-testid="di-actual-generated-template" data-viewport={previewViewport} data-density={templateConfig.density} data-spacing={templateConfig.spacing} data-corners={templateConfig.corners} data-motion={templateConfig.reduceMotion?'reduce':'allow'} data-readable={String(templateConfig.readable)} data-style={activeTemplateStyle?.id||'original'} style={templatePreviewStyle}><SelectedTemplatePreview key={selectedTemplate.id}/></div>}<section className="di-template-spec" aria-label="Generated design specification"><h3>Applied design specification</h3><div className="di-template-spec-grid"><div className="di-template-spec-item"><span>Visual style</span><strong>{activeTemplateStyle?.name||'Original template styling'}</strong></div><div className="di-template-spec-item"><span>Colour source</span><strong>{activeTemplatePalette?.name||'Selected preview theme'}</strong></div><div className="di-template-spec-item"><span>Typography</span><strong>{activeTemplateTypography?.name||'Original template typography'}</strong></div><div className="di-template-spec-item"><span>Target</span><strong>{previewViewport} · {templateConfig.width} width</strong></div><div className="di-template-spec-item"><span>Implementation stack</span><strong>{activeTemplateStack?.name||'Not selected'}</strong></div><div className="di-template-spec-item"><span>Chart guidance</span><strong>{activeTemplateChart?.name||'Not selected'}</strong></div></div>{activeTemplateChart&&<p><b>{activeTemplateChart.purpose}.</b> Best for: {(activeTemplateChart.bestFor||[]).join(', ')}. Avoid for: {(activeTemplateChart.avoidFor||[]).join(', ')}. This is canonical guidance; an existing chart embedded in the imported template is not automatically rewritten.</p>}</section><Link className="di-btn di-btn-secondary" to="/design-intelligence/ui-gallery">Back to UI Gallery</Link></div>}<p className="di-preview-caption" aria-live="polite">{PREVIEW_VIEWPORTS.find(size=>size.value===previewViewport)?.label} recipe simulation. {selectedTemplate?'The actual selected Gallery component is shown above; this separate preview reflects recipe ingredients.':'This is a recipe preview, not a live browser screenshot.'}</p><Preview recipe={recipe} style={previewStyle} viewport={previewViewport}/></div></section><section className="di-surface"><div className="di-section-heading"><div><span className="di-kicker">EXPORT</span><h2>Safe machine-readable outputs</h2><p className="di-muted">JSON includes the canonical recipe, optional selected template ID and customizer settings. CSS exports mapped design tokens only, not the template's React/CSS source or executable code.</p></div></div><div className="di-actions"><button className="di-btn di-btn-primary" onClick={()=>{const data=recipeToExport(recipe);if(exportPayload)downloadText('motionzync-design-recipe.json',JSON.stringify(exportPayload,null,2),'application/json')}} disabled={!recipe.valid}>Download recipe JSON</button><button className="di-btn di-btn-secondary" onClick={()=>downloadText('motionzync-design-tokens.css',':root{\n'+Object.entries(exportTokens).map(([name,value])=>'  '+name+': '+value+';').join('\n')+'\n}','text/css')} disabled={!recipe.valid}>Download CSS variables</button></div><pre className="di-code">{JSON.stringify(exportTokens,null,2)}</pre></section></div>
}
