// PhysicsPanel3D.jsx
// UE5 Details Panel → Physics section equivalent
// Works on Mobile + Desktop
import { useState, useCallback } from 'react'
import './PhysicsPanel3D.css'

const SHAPES = ['Box', 'Sphere', 'Capsule', 'Convex Hull', 'Mesh']
const PRESETS = {
  'Default':     { mass:1,    restitution:0.3, friction:0.5, linearDamping:0.01, angularDamping:0.05, gravityScale:1 },
  'Heavy Metal': { mass:50,   restitution:0.1, friction:0.8, linearDamping:0.05, angularDamping:0.1,  gravityScale:1 },
  'Rubber Ball': { mass:0.5,  restitution:0.9, friction:0.3, linearDamping:0.01, angularDamping:0.01, gravityScale:1 },
  'Balloon':     { mass:0.05, restitution:0.5, friction:0.1, linearDamping:0.5,  angularDamping:0.3,  gravityScale:-0.5 },
  'Ice Block':   { mass:5,    restitution:0.2, friction:0.02,linearDamping:0.01, angularDamping:0.02, gravityScale:1 },
  'Feather':     { mass:0.01, restitution:0.1, friction:0.2, linearDamping:0.9,  angularDamping:0.8,  gravityScale:0.1 },
  'Stone':       { mass:20,   restitution:0.05,friction:0.9, linearDamping:0.01, angularDamping:0.05, gravityScale:1 },
  'Wood':        { mass:3,    restitution:0.3, friction:0.6, linearDamping:0.02, angularDamping:0.05, gravityScale:1 },
}

function Slider({ label, value, min, max, step=0.01, unit='', onChange }) {
  return (
    <div className="pp3-row">
      <span className="pp3-label">{label}</span>
      <div className="pp3-slider-wrap">
        <input
          type="range" min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="pp3-slider"
        />
        <input
          type="number" min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="pp3-number"
        />
        {unit && <span className="pp3-unit">{unit}</span>}
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange, description }) {
  return (
    <div className="pp3-row pp3-toggle-row" onClick={() => onChange(!value)}>
      <div className="pp3-toggle-info">
        <span className="pp3-label">{label}</span>
        {description && <span className="pp3-desc">{description}</span>}
      </div>
      <div className={`pp3-toggle ${value ? 'on' : ''}`}>
        <div className="pp3-toggle-thumb"/>
      </div>
    </div>
  )
}

function Section({ title, children, defaultOpen=true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="pp3-section">
      <button className="pp3-section-head" onClick={() => setOpen(o=>!o)}>
        <span>{open ? '▾' : '▸'}</span> {title}
      </button>
      {open && <div className="pp3-section-body">{children}</div>}
    </div>
  )
}

export default function PhysicsPanel3D({ body, onUpdate, onExplode, onReset }) {
  const [preset, setPreset] = useState('Default')

  const update = useCallback((key, val) => {
    onUpdate?.({ ...body, [key]: val })
  }, [body, onUpdate])

  const applyPreset = useCallback((name) => {
    setPreset(name)
    const p = PRESETS[name]
    onUpdate?.({ ...body, ...p })
  }, [body, onUpdate])

  if (!body) {
    return (
      <div className="pp3-empty">
        <div className="pp3-empty-icon">⚙️</div>
        <p>Select an object to edit physics</p>
      </div>
    )
  }

  return (
    <div className="pp3-panel">
      {/* Header */}
      <div className="pp3-header">
        <div className="pp3-body-name">⚡ {body.name ?? 'Body'}</div>
        <button className="pp3-reset-btn" onClick={onReset}>Reset</button>
      </div>

      {/* Presets */}
      <Section title="⚡ Physics Preset">
        <div className="pp3-presets">
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              className={`pp3-preset-btn ${preset===name?'active':''}`}
              onClick={() => applyPreset(name)}
            >{name}</button>
          ))}
        </div>
      </Section>

      {/* Simulate */}
      <Section title="🎮 Simulate Physics">
        <Toggle
          label="Simulate Physics"
          description="Enable real-time physics simulation"
          value={!body.isStatic}
          onChange={v => update('isStatic', !v)}
        />
        <Toggle
          label="Is Trigger"
          description="Detect overlaps but don't collide"
          value={body.isTrigger ?? false}
          onChange={v => update('isTrigger', v)}
        />
        <Toggle
          label="Enable CCD"
          description="Continuous Collision Detection (for fast objects)"
          value={body.enableCCD ?? false}
          onChange={v => update('enableCCD', v)}
        />
      </Section>

      {/* Mass & Gravity */}
      <Section title="⚖️ Mass & Gravity">
        <Slider label="Mass" value={body.mass??1} min={0.001} max={1000} step={0.1} unit="kg"
                onChange={v=>update('mass',v)} />
        <Slider label="Gravity Scale" value={body.gravityScale??1} min={-5} max={5} step={0.01}
                onChange={v=>update('gravityScale',v)} />
      </Section>

      {/* Damping */}
      <Section title="💨 Damping">
        <Slider label="Linear Damping" value={body.linearDamping??0.01} min={0} max={1} step={0.001}
                onChange={v=>update('linearDamping',v)} />
        <Slider label="Angular Damping" value={body.angularDamping??0.05} min={0} max={1} step={0.001}
                onChange={v=>update('angularDamping',v)} />
      </Section>

      {/* Physics Material */}
      <Section title="🧱 Physics Material">
        <Slider label="Restitution (Bounce)" value={body.restitution??0.3} min={0} max={1} step={0.01}
                onChange={v=>update('restitution',v)} />
        <Slider label="Friction" value={body.friction??0.5} min={0} max={1} step={0.01}
                onChange={v=>update('friction',v)} />
      </Section>

      {/* Constraints - Lock Axes */}
      <Section title="🔒 Lock Axes" defaultOpen={false}>
        <div className="pp3-lock-grid">
          <span className="pp3-lock-title">Position</span>
          {['X','Y','Z'].map(ax => (
            <label key={ax} className="pp3-lock-item">
              <input type="checkbox"
                checked={body[`lockPos${ax}`]??false}
                onChange={e => update(`lockPos${ax}`, e.target.checked)}
              /> {ax}
            </label>
          ))}
          <span className="pp3-lock-title">Rotation</span>
          {['X','Y','Z'].map(ax => (
            <label key={ax} className="pp3-lock-item">
              <input type="checkbox"
                checked={body[`lockRot${ax}`]??false}
                onChange={e => update(`lockRot${ax}`, e.target.checked)}
              /> {ax}
            </label>
          ))}
        </div>
      </Section>

      {/* Collision Shape */}
      <Section title="🔷 Collision Shape" defaultOpen={false}>
        <div className="pp3-row">
          <span className="pp3-label">Shape</span>
          <select className="pp3-select"
            value={body.shape?.type ?? 'box'}
            onChange={e => update('shapeType', e.target.value)}>
            {SHAPES.map(s => <option key={s} value={s.toLowerCase().replace(' ','_')}>{s}</option>)}
          </select>
        </div>
        {body.shape?.type === 'sphere' && (
          <Slider label="Radius" value={body.shape.radius??0.5} min={0.01} max={10} step={0.01} unit="m"
                  onChange={v=>update('shape',{...body.shape,radius:v})} />
        )}
        {body.shape?.type === 'box' && (
          <>
            <Slider label="Half X" value={body.shape.halfExtents?.x??0.5} min={0.01} max={10} step={0.01} unit="m"
                    onChange={v=>update('shape',{...body.shape,halfExtents:{...body.shape.halfExtents,x:v}})} />
            <Slider label="Half Y" value={body.shape.halfExtents?.y??0.5} min={0.01} max={10} step={0.01} unit="m"
                    onChange={v=>update('shape',{...body.shape,halfExtents:{...body.shape.halfExtents,y:v}})} />
            <Slider label="Half Z" value={body.shape.halfExtents?.z??0.5} min={0.01} max={10} step={0.01} unit="m"
                    onChange={v=>update('shape',{...body.shape,halfExtents:{...body.shape.halfExtents,z:v}})} />
          </>
        )}
      </Section>

      {/* Forces */}
      <Section title="💥 Apply Force" defaultOpen={false}>
        <div className="pp3-force-btns">
          <button className="pp3-force-btn" onClick={()=>onUpdate?.({...body,_impulse:{x:0,y:10,z:0}})}>
            🚀 Launch Up
          </button>
          <button className="pp3-force-btn" onClick={()=>onUpdate?.({...body,_impulse:{x:10,y:5,z:0}})}>
            ➡️ Throw Right
          </button>
          <button className="pp3-force-btn pp3-force-explode" onClick={onExplode}>
            💥 Explosion
          </button>
        </div>
      </Section>
    </div>
  )
          }
                                
