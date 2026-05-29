// ParticlePanel.jsx — NEW (Feature 9)
// Particle system configuration panel — embedded in RightPanel

import { PARTICLE_PRESETS, PRESET_NAMES } from '../engine/ParticleEngine.js'
import './ParticlePanel.css'

const PRESET_ICONS = {
  stars:'⭐', sparks:'✨', smoke:'💨', fire:'🔥',
  rain:'🌧', snow:'❄', dust:'🌫', energy:'⚡',
  confetti:'🎊', magic:'🪄',
}

function Slider({ label, value, min, max, step=1, unit='', onChange }) {
  return (
    <div className="pp-row">
      <span className="pp-label">{label}</span>
      <input type="range" className="pp-slider" min={min} max={max} step={step}
        value={value} onChange={e=>onChange(+e.target.value)}/>
      <span className="pp-val">{typeof value==='number'?value.toFixed(step<1?2:0):value}{unit}</span>
    </div>
  )
}

export default function ParticlePanel({ el, update }) {
  if (!el) return <div className="pp-empty">Select an element to add particles</div>

  const particles = el.particles || { enabled:false, preset:'stars', count:50, speed:1, gravity:0, size:1 }

  function upP(patch) { update({ particles:{ ...particles, ...patch } }) }

  const def = PARTICLE_PRESETS[particles.preset] || PARTICLE_PRESETS.stars

  return (
    <div className="particle-panel">
      {/* Enable toggle */}
      <div className="pp-section">
        <div className="pp-section-title">🎆 Particle System</div>
        <label className="pp-toggle-row">
          <input type="checkbox" checked={particles.enabled||false}
            onChange={e=>upP({enabled:e.target.checked})}/>
          <span className="pp-toggle-track"><span className="pp-toggle-thumb"/></span>
          <span className="pp-toggle-label">Enable Particles</span>
        </label>
      </div>

      {/* Preset picker */}
      <div className="pp-section">
        <div className="pp-section-title">🎨 Preset</div>
        <div className="pp-preset-grid">
          {PRESET_NAMES.map(name => (
            <button
              key={name}
              className={`pp-preset-btn ${particles.preset===name?'active':''}`}
              onClick={() => upP({ preset:name })}
              title={PARTICLE_PRESETS[name].label}
            >
              <span className="pp-preset-icon">{PRESET_ICONS[name]||'✦'}</span>
              <span className="pp-preset-label">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tuning */}
      {particles.enabled && (
        <div className="pp-section">
          <div className="pp-section-title">⚙️ Fine-tune</div>

          <Slider label="Count"   value={particles.count??def.count}
            min={5} max={200} onChange={v=>upP({count:v})}/>
          <Slider label="Speed"   value={particles.speed??1}
            min={0.1} max={3} step={0.1} onChange={v=>upP({speed:v})}/>
          <Slider label="Size ×"  value={particles.size??1}
            min={0.2} max={4} step={0.1} onChange={v=>upP({size:v})}/>
          <Slider label="Gravity" value={particles.gravity??def.gravity}
            min={-0.3} max={0.5} step={0.01} onChange={v=>upP({gravity:v})}/>
          <Slider label="Opacity" value={particles.opacity??1}
            min={0.1} max={1} step={0.05} onChange={v=>upP({opacity:v})}/>
          <Slider label="Life ×"  value={particles.life??1}
            min={0.2} max={3} step={0.1} onChange={v=>upP({life:v})}/>

          {/* Color override */}
          <div className="pp-row">
            <span className="pp-label">Color</span>
            <input type="color" className="pp-color"
              value={particles.colorOverride||def.color||'#ffffff'}
              onChange={e=>upP({colorOverride:e.target.value})}/>
            <button className="pp-reset-color"
              onClick={()=>upP({colorOverride:null})}
              title="Reset to preset color">↺</button>
          </div>

          {/* Preset description */}
          <div className="pp-desc">{def.label} — {_desc(particles.preset)}</div>
        </div>
      )}

      {!particles.enabled && (
        <div className="pp-off-hint">
          Enable particles to add a live {PARTICLE_PRESETS[particles.preset]?.label || 'effect'} to this element
        </div>
      )}
    </div>
  )
}

function _desc(name) {
  const map = {
    stars:'Gently twinkling stars fill the scene',
    sparks:'Explosive spark burst from element center',
    smoke:'Soft rising smoke cloud',
    fire:'Flickering fire emitting upward',
    rain:'Falling rain across full scene',
    snow:'Gentle snowfall across scene',
    dust:'Floating dust particles drifting',
    energy:'Electric energy pulses radiating out',
    confetti:'Colorful confetti burst celebration',
    magic:'Magical sparkle particles swirling',
  }
  return map[name] || ''
}
