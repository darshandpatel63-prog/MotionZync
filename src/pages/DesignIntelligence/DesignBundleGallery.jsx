import { Suspense, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchDesignIntelligenceKnowledge } from './knowledgeClient.js'
import manifest from './ui-design-bundle/manifest.json'
import './DesignBundleGallery.css'
import './DesignBundleGalleryThemes.css'
import './ui-design-bundle/shared/tokens.css'

const DESIGN_MODULES = import.meta.glob('./ui-design-bundle/designs/**/Design.jsx')
const CATEGORIES = [{ id: 'all', name: 'All categories' }, ...manifest.categories.map(({ id, name }) => ({ id, name }))]
const TIERS = [{ id: 'all', label: 'All tiers' }, { id: 'premium', label: 'Premium' }, { id: 'ultra-premium', label: 'Ultra Premium+' }]
const THEMES = ['light', 'dark', 'colorful', 'high-contrast']
function tierRank(tier) { return tier === 'ultra-premium' ? 2 : tier === 'premium' ? 1 : 0 }

export default function DesignBundleGallery() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [tier, setTier] = useState('all')
  const [theme, setTheme] = useState('light')
  const [selectedId, setSelectedId] = useState(manifest.designs[0]?.id || '')
  const [designAccessTier, setDesignAccessTier] = useState('free')
  const [entitlementTier, setEntitlementTier] = useState('free')
  const [accessState, setAccessState] = useState('Checking server-authorized design access…')
  const [preview, setPreview] = useState({ id: '', Component: null, error: '' })

  useEffect(() => {
    let active = true
    fetchDesignIntelligenceKnowledge(user).then(result => {
      if (!active) return
      setDesignAccessTier(result.designAccessTier || 'free')
      setEntitlementTier(result.entitlementTier || 'free')
      setAccessState('Server access checked. Design visibility: ' + (result.designAccessTier || 'free') + '.')
    }).catch(() => {
      if (active) {
        setDesignAccessTier('free')
        setEntitlementTier('free')
        setAccessState('Access check unavailable; Premium/Ultra previews stay locked.')
      }
    })
    return () => { active = false }
  }, [user])

  const filtered = manifest.designs.filter(item => {
    const haystack = [item.id, item.name, item.description, item.category, ...(item.tags || [])].join(' ').toLowerCase()
    return (category === 'all' || item.category === category)
      && (tier === 'all' || item.tier === tier)
      && haystack.includes(query.trim().toLowerCase())
  })
  const selected = filtered.find(item => item.id === selectedId) || filtered[0] || null
  const canPreview = selected && tierRank(selected.tier) <= tierRank(designAccessTier)

  async function loadSelected() {
    if (!selected || !canPreview) return
    const key = './ui-design-bundle/' + selected.entry
    const loader = DESIGN_MODULES[key]
    if (!loader) {
      setPreview({ id: selected.id, Component: null, error: 'Preview module not found for this manifest entry.' })
      return
    }
    setPreview({ id: selected.id, Component: null, error: '' })
    try {
      const module = await loader()
      if (module?.default) setPreview({ id: selected.id, Component: module.default, error: '' })
      else setPreview({ id: selected.id, Component: null, error: 'This design does not export a React component.' })
    } catch {
      setPreview({ id: selected.id, Component: null, error: 'This preview could not load. Other designs remain available.' })
    }
  }

  const PreviewComponent = preview.id === selected?.id ? preview.Component : null
  const selectedIndex = selected ? manifest.designs.findIndex(item => item.id === selected.id) : -1

  return <div className="di-page dib-page">
    <section className="di-page-intro">
      <span className="di-kicker">UI DESIGN BUNDLE</span>
      <h1>Browse 3,600 UI designs</h1>
      <p>The imported bundle contains {manifest.designs.length.toLocaleString()} manifest entries across {manifest.categories.length} categories. Choose a design to lazy-load its React preview and switch themes.</p>
    </section>
    <section className="di-surface dib-controls" aria-label="Design filters">
      <label className="di-label" htmlFor="dib-search">Search designs</label>
      <input id="dib-search" className="di-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, category, or tags"/>
      <div className="dib-filter-row">
        <label className="dib-filter"><span>Category</span><select value={category} onChange={event => setCategory(event.target.value)}>{CATEGORIES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="dib-filter"><span>Tier</span><select value={tier} onChange={event => setTier(event.target.value)}>{TIERS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label className="dib-filter"><span>Preview theme</span><select value={theme} onChange={event => setTheme(event.target.value)}>{THEMES.map(item => <option key={item} value={item}>{item === 'high-contrast' ? 'High contrast' : item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>
      </div>
      <p className="di-note" role="status">{accessState} · Account tier: {entitlementTier} · {filtered.length.toLocaleString()} matching designs</p>
    </section>
    <div className="dib-layout">
      <section className="dib-results" aria-label="Design results">
        <div className="dib-results-head"><strong>{filtered.length.toLocaleString()} designs</strong><span>Showing up to {Math.min(filtered.length, 120)} at a time</span></div>
        <div className="dib-card-grid">
          {filtered.slice(0, 120).map(item => <button type="button" key={item.id} className={'dib-design-card ' + (selected?.id === item.id ? 'is-selected' : '')} onClick={() => { setSelectedId(item.id); setPreview({ id: '', Component: null, error: '' }) }} aria-pressed={selected?.id === item.id}>
            <span className="dib-card-top"><span className={'di-tier tier-' + item.tier}>{item.tier === 'ultra-premium' ? 'Ultra Premium+' : 'Premium'}</span><span className="dib-card-id">{item.id.split('-').slice(-1)[0]}</span></span>
            <strong>{item.name}</strong>
            <span className="dib-card-category">{manifest.categories.find(cat => cat.id === item.category)?.name || item.category}</span>
            <span className="dib-card-description">{item.description}</span>
            <span className="dib-card-themes">{(item.themes || []).join(' · ')}</span>
          </button>)}
        </div>
        {filtered.length > 120 && <p className="di-note">For speed on mobile, the gallery displays the first 120 filtered results at once. Narrow the search or category to reach other designs.</p>}
        {!filtered.length && <div className="di-empty">No design matches these filters.</div>}
      </section>
      <aside className="dib-preview-panel" aria-label="Selected design preview">
        <div className="dib-preview-heading"><div><span className="di-kicker">SELECTED DESIGN</span><h2>{selected?.name || 'Choose a design'}</h2></div><span className="dib-index">{selected ? String(selectedIndex + 1) + ' / ' + manifest.designs.length : '—'}</span></div>
        {selected && <p className="dib-description">{selected.description}</p>}
        {selected && <div className="dib-theme-row">{THEMES.map(value => <button key={value} type="button" className={'di-chip ' + (theme === value ? 'active' : '')} onClick={() => setTheme(value)} aria-pressed={theme === value}>{value === 'high-contrast' ? 'High contrast' : value[0].toUpperCase() + value.slice(1)}</button>)}</div>}
        {selected && !canPreview && <div className="di-empty" role="status"><strong>Preview locked</strong><p>This {selected.tier === 'ultra-premium' ? 'Ultra Premium+' : 'Premium'} preview is not available for the current server-authorized design access tier ({designAccessTier}). Sign in or check your plan/access policy.</p></div>}
        {selected && canPreview && !PreviewComponent && <div className="dib-preview-placeholder"><span>✦</span><strong>Ready to preview</strong><p>Load this design only when you select it, keeping the initial page lighter.</p><button type="button" className="di-btn di-btn-primary" onClick={loadSelected}>Load design preview</button>{preview.error && <p role="alert">{preview.error}</p>}</div>}
        {PreviewComponent && <div className="dib-rendered-preview" data-theme={theme}><Suspense fallback={<div className="di-empty">Loading selected design…</div>}><PreviewComponent key={selected.id}/></Suspense></div>}
        {selected && <details className="dib-details"><summary>Design details</summary><dl><dt>Design ID</dt><dd>{selected.id}</dd><dt>Category</dt><dd>{selected.category}</dd><dt>Tier</dt><dd>{selected.tier}</dd><dt>Themes</dt><dd>{(selected.themes || []).join(', ')}</dd><dt>Responsive</dt><dd>{selected.responsive ? 'Declared responsive' : 'Not declared responsive'}</dd><dt>Motion</dt><dd>{selected.motion || 'Not specified'}</dd></dl></details>}
      </aside>
    </div>
  </div>
}
