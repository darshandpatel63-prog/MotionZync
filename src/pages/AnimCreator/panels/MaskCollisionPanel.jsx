// MaskCollisionPanel.jsx — NEW (Feature 10)
// Combined panel: Mask/Clip region · Object collision · Rope/Chain linking

import { useState } from 'react'
import { useCreator } from '../store/CreatorContext.jsx'
import { MASK_PRESETS, MASK_PRESET_NAMES, makeMaskConfig } from '../engine/MaskSystem.js'
import { makeRope } from '../engine/CollisionEngine.js'
import './MaskCollisionPanel.css'

// ── Sub: Mask tab ─────────────────────────────────────────────
function MaskTab({ el, update }) {
  if (!el) return <div className="mcp-empty">Select an element to apply mask</div>

  const mask = el.mask || makeMaskConfig()

  function upM(patch) { update({ mask:{ ...mask, ...patch } }) }

  return (
    <div className="mcp-scroll">
      <div className="mcp-section">
        <div className="mcp-section-title">✂️ Clip Mask</div>
        <label className="mcp-toggle">
          <input type="checkbox" checked={mask.enabled||false}
            onChange={e=>upM({enabled:e.target.checked})}/>
          <span className="mcp-tog-track"><span className="mcp-tog-thumb"/></span>
          <span className="mcp-tog-label">Enable Mask</span>
        </label>
      </div>

      <div className="mcp-section">
        <div className="mcp-section-title">🔷 Shape Presets</div>
        <div className="mask-preset-grid">
          {MASK_PRESET_NAMES.filter(n=>n!=='custom').map(name => {
            const def = MASK_PRESETS[name]
            return (
              <button key={name}
                className={`mask-preset-btn ${mask.preset===name?'active':''}`}
                onClick={() => upM({ preset:name, enabled:true })}
                title={def.label}>
                <span className="mpb-icon">{def.icon}</span>
                <span className="mpb-label">{def.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Inset / Radius for insetRound */}
      {mask.preset === 'insetRound' && (
        <div className="mcp-section">
          <div className="mcp-section-title">⚙️ Options</div>
          <div className="mcp-row">
            <span className="mcp-label">Inset</span>
            <input type="range" className="mcp-slider" min={0} max={30}
              value={mask.inset||8} onChange={e=>upM({inset:+e.target.value})}/>
            <span className="mcp-val">{mask.inset||8}%</span>
          </div>
          <div className="mcp-row">
            <span className="mcp-label">Radius</span>
            <input type="range" className="mcp-slider" min={0} max={80}
              value={mask.radius||24} onChange={e=>upM({radius:+e.target.value})}/>
            <span className="mcp-val">{mask.radius||24}px</span>
          </div>
        </div>
      )}

      {/* Custom clip-path */}
      <div className="mcp-section">
        <div className="mcp-section-title">✏️ Custom clip-path</div>
        <input className="mcp-custom-input"
          placeholder="polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)"
          value={mask.customClip||''}
          onChange={e=>upM({customClip:e.target.value, preset:'custom', enabled:true})}/>
        <div className="mcp-hint">Enter any valid CSS clip-path value</div>
      </div>

      {mask.enabled && mask.preset !== 'none' && (
        <div className="mcp-active-badge">
          ✓ {MASK_PRESETS[mask.preset]?.label || 'Custom'} mask active
        </div>
      )}
    </div>
  )
}

// ── Sub: Collision tab ────────────────────────────────────────
function CollisionTab({ el, update }) {
  if (!el) return <div className="mcp-empty">Select an element</div>

  const col = el.collision || { enabled:false, restitution:0.6 }
  function upC(patch) { update({ collision:{ ...col, ...patch } }) }

  return (
    <div className="mcp-scroll">
      <div className="mcp-section">
        <div className="mcp-section-title">💥 Collision Detection</div>
        <label className="mcp-toggle">
          <input type="checkbox" checked={col.enabled||false}
            onChange={e=>upC({enabled:e.target.checked})}/>
          <span className="mcp-tog-track"><span className="mcp-tog-thumb"/></span>
          <span className="mcp-tog-label">Enable Collision</span>
        </label>
        <div className="mcp-desc">
          Element will physically collide with other elements that also have collision enabled.
          Works best with Gravity or Bounce physics mode.
        </div>
      </div>

      {col.enabled && (
        <div className="mcp-section">
          <div className="mcp-section-title">⚙️ Parameters</div>
          <div className="mcp-row">
            <span className="mcp-label">Bounce</span>
            <input type="range" className="mcp-slider" min={0} max={1} step={0.05}
              value={col.restitution??0.6} onChange={e=>upC({restitution:+e.target.value})}/>
            <span className="mcp-val">{(col.restitution??0.6).toFixed(2)}</span>
          </div>
          <div className="mcp-row">
            <span className="mcp-label">Mass</span>
            <input type="range" className="mcp-slider" min={0.1} max={5} step={0.1}
              value={col.mass??1} onChange={e=>upC({mass:+e.target.value})}/>
            <span className="mcp-val">{(col.mass??1).toFixed(1)}</span>
          </div>
          <div className="mcp-collision-hint">
            <span className="mch-icon">ℹ️</span>
            <span>Enable collision on multiple elements with Gravity physics to see them bounce off each other.</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub: Rope tab ─────────────────────────────────────────────
function RopeTab({ el, elements, ropes, onAddRope, onDeleteRope }) {
  const [tailId,    setTailId]    = useState('')
  const [segments,  setSegments]  = useState(10)
  const [ropeColor, setRopeColor] = useState('#7c3aed')
  const [ropeWidth, setRopeWidth] = useState(2)

  if (!el) return <div className="mcp-empty">Select an anchor element</div>

  // Ropes attached to this element
  const myRopes = (ropes||[]).filter(r => r.anchorElId===el.id || r.tailElId===el.id)

  const otherEls = elements.filter(e => e.id !== el.id)

  function handleAdd() {
    if (!tailId) return
    const tailEl = elements.find(e=>e.id===tailId); if(!tailEl) return
    const rope   = makeRope(
      'rope_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),
      el, tailEl,
      { segments, color:ropeColor, width:ropeWidth }
    )
    onAddRope(rope)
    setTailId('')
  }

  return (
    <div className="mcp-scroll">
      <div className="mcp-section">
        <div className="mcp-section-title">🪢 Rope / Chain</div>
        <div className="mcp-desc">Connect this element to another with a rope or chain.</div>
      </div>

      <div className="mcp-section">
        <div className="mcp-section-title">➕ New Rope</div>
        <div className="mcp-row">
          <span className="mcp-label">Anchor</span>
          <span className="mcp-fixed-val">{el.label||el.type}</span>
        </div>
        <div className="mcp-row">
          <span className="mcp-label">Tail</span>
          <select className="mcp-select" value={tailId} onChange={e=>setTailId(e.target.value)}>
            <option value="">— select element —</option>
            {otherEls.map(e=>(
              <option key={e.id} value={e.id}>{e.label||e.type}</option>
            ))}
          </select>
        </div>
        <div className="mcp-row">
          <span className="mcp-label">Segments</span>
          <input type="range" className="mcp-slider" min={4} max={20}
            value={segments} onChange={e=>setSegments(+e.target.value)}/>
          <span className="mcp-val">{segments}</span>
        </div>
        <div className="mcp-row">
          <span className="mcp-label">Color</span>
          <input type="color" className="mcp-color" value={ropeColor}
            onChange={e=>setRopeColor(e.target.value)}/>
          <input type="range" className="mcp-slider" min={1} max={6}
            value={ropeWidth} onChange={e=>setRopeWidth(+e.target.value)}/>
          <span className="mcp-val">{ropeWidth}px</span>
        </div>
        <button className="mcp-add-rope-btn"
          onClick={handleAdd} disabled={!tailId}>
          🪢 Add Rope
        </button>
      </div>

      {/* Existing ropes */}
      {myRopes.length > 0 && (
        <div className="mcp-section">
          <div className="mcp-section-title">📋 Active Ropes ({myRopes.length})</div>
          {myRopes.map(r => {
            const otherElId = r.anchorElId===el.id ? r.tailElId : r.anchorElId
            const otherEl   = elements.find(e=>e.id===otherElId)
            return (
              <div key={r.id} className="rope-item">
                <span className="ri-dot" style={{background:r.color}}/>
                <span className="ri-label">{el.label} ↔ {otherEl?.label||'?'}</span>
                <span className="ri-segs">{r.segments} seg</span>
                <button className="ri-del" onClick={()=>onDeleteRope(r.id)}>✕</button>
              </div>
            )
          })}
        </div>
      )}
      {myRopes.length === 0 && (
        <div className="mcp-hint" style={{textAlign:'center',padding:'0.75rem'}}>No ropes attached yet</div>
      )}
    </div>
  )
}

// ── Main Panel ────────────────────────────────────────────────
const TABS = [
  { id:'mask',      icon:'✂️', label:'Mask'      },
  { id:'collision', icon:'💥', label:'Collision' },
  { id:'rope',      icon:'🪢', label:'Rope'      },
]

export default function MaskCollisionPanel({ el, update, elements, ropes, onAddRope, onDeleteRope }) {
  const [activeTab, setActiveTab] = useState('mask')

  return (
    <div className="mcp-panel">
      <div className="mcp-tabs">
        {TABS.map(t=>(
          <button key={t.id} className={`mcp-tab ${activeTab===t.id?'active':''}`}
            onClick={()=>setActiveTab(t.id)}>
            <span>{t.icon}</span><span className="mcp-tab-label">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="mcp-content">
        {activeTab==='mask'      && <MaskTab      el={el} update={update}/>}
        {activeTab==='collision' && <CollisionTab el={el} update={update}/>}
        {activeTab==='rope'      && <RopeTab      el={el} elements={elements} ropes={ropes} onAddRope={onAddRope} onDeleteRope={onDeleteRope}/>}
      </div>
    </div>
  )
}
