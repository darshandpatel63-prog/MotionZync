import { hasEntitlement } from './access.js'
import './DesignTemplateCustomizer.css'

export const DEFAULT_TEMPLATE_CONFIG = Object.freeze({
  palette: '',
  typography: '',
  style: '',
  chart: '__recipe__',
  stack: '__recipe__',
  density: 'balanced',
  spacing: 'balanced',
  corners: 'soft',
  width: 'balanced',
  reduceMotion: true,
  readable: false,
})

function Choice({id,label,value,onChange,children,help}){
  return <div className="di-template-control">
    <label className="di-label" htmlFor={id}>{label}</label>
    <select id={id} className="di-input" value={value} onChange={event=>onChange(event.target.value)}>
      {children}
    </select>
    {help&&<p className="di-template-help">{help}</p>}
  </div>
}

export default function DesignTemplateCustomizer({catalog,designAccessTier,config,onChange,onReset}){
  const update=(key,value)=>onChange(current=>({...current,[key]:value}))
  const available=domain=>(catalog[domain]||[]).filter(record=>hasEntitlement(record.tier,designAccessTier))
  return <section className="di-template-customizer" aria-labelledby="di-template-customizer-title">
    <div className="di-template-customizer-heading">
      <div>
        <span className="di-kicker">CUSTOMIZE THE ACTUAL UI</span>
        <h3 id="di-template-customizer-title">Shape this selected composition</h3>
        <p>These settings apply to the imported UI preview. They are separate from the recipe summary and do not change your account tier.</p>
      </div>
      <button type="button" className="di-btn di-btn-secondary" onClick={onReset}>Reset UI changes</button>
    </div>
    <div className="di-template-customizer-grid">
      <Choice id="di-template-palette" label="Colour palette" value={config.palette} onChange={value=>update('palette',value)} help="A chosen palette overrides the preview theme's colours; reset to follow theme tokens.">
        <option value="">Follow preview theme</option>
        <option value="__recipe__">Use generated recipe palette</option>
        {available('palettes').map(record=><option key={record.id} value={record.id}>{record.name}</option>)}
      </Choice>
      <Choice id="di-template-typography" label="Typography pairing" value={config.typography} onChange={value=>update('typography',value)}>
        <option value="">Keep template typography</option>
        <option value="__recipe__">Use generated recipe typography</option>
        {available('typography').map(record=><option key={record.id} value={record.id}>{record.name} — {record.heading} / {record.body}</option>)}
      </Choice>
      <Choice id="di-template-style" label="Visual style" value={config.style} onChange={value=>update('style',value)}>
        <option value="">Keep template visual treatment</option>
        <option value="__recipe__">Use generated recipe style</option>
        {available('styles').map(record=><option key={record.id} value={record.id}>{record.name}</option>)}
      </Choice>
      <Choice id="di-template-chart" label="Chart guidance" value={config.chart} onChange={value=>update('chart',value)} help="Adds a canonical chart recommendation to the output spec; it does not replace hard-coded template charts.">
        <option value="">No chart recommendation</option>
        <option value="__recipe__">Use generated recipe chart</option>
        {available('charts').map(record=><option key={record.id} value={record.id}>{record.name}</option>)}
      </Choice>
      <Choice id="di-template-stack" label="Implementation stack" value={config.stack} onChange={value=>update('stack',value)}>
        <option value="">No stack recommendation</option>
        <option value="__recipe__">Use generated recipe stack</option>
        {available('stacks').map(record=><option key={record.id} value={record.id}>{record.name} — {record.category}</option>)}
      </Choice>
      <Choice id="di-template-density" label="Content density" value={config.density} onChange={value=>update('density',value)}>
        <option value="compact">Compact</option>
        <option value="balanced">Balanced</option>
        <option value="comfortable">Comfortable</option>
      </Choice>
      <Choice id="di-template-spacing" label="Spacing rhythm" value={config.spacing} onChange={value=>update('spacing',value)}>
        <option value="tight">Tight spacing</option>
        <option value="balanced">Balanced spacing</option>
        <option value="airy">Airy spacing</option>
      </Choice>
      <Choice id="di-template-corners" label="Corner treatment" value={config.corners} onChange={value=>update('corners',value)}>
        <option value="sharp">Sharp</option>
        <option value="soft">Soft</option>
        <option value="rounded">Rounded</option>
      </Choice>
      <Choice id="di-template-width" label="Composition width" value={config.width} onChange={value=>update('width',value)}>
        <option value="narrow">Narrow — 720px max</option>
        <option value="balanced">Balanced — 1000px max</option>
        <option value="wide">Wide — use available space</option>
      </Choice>
    </div>
    <div className="di-template-toggle-row">
      <label htmlFor="di-template-reduce-motion"><input id="di-template-reduce-motion" type="checkbox" checked={config.reduceMotion} onChange={event=>update('reduceMotion',event.target.checked)}/> Respect reduced-motion preference</label>
      <label htmlFor="di-template-readable"><input id="di-template-readable" type="checkbox" checked={config.readable} onChange={event=>update('readable',event.target.checked)}/> Increase text size for readability</label>
    </div>
    <p className="di-template-help">Style, spacing and responsive settings use scoped CSS overrides where the selected template exposes compatible shared UI classes. Chart/stack choices are also included in the generation specification and export.</p>
  </section>
}
