// SimpleModePanel.jsx — NEW (Feature 8)
// Beginner-friendly preset panel — shown in Simple Mode
// One-click apply: shape presets, animation combos, color themes, physics presets

import { useCreator } from '../store/CreatorContext.jsx'
import './SimpleModePanel.css'

// ── Shape + style quick presets ───────────────────────────────
const QUICK_SHAPES = [
  { label:'Violet Orb',   type:'circle',   fill:'#7c3aed', anim:'float',      physics:'none', glow:true  },
  { label:'Cyan Box',     type:'rect',     fill:'#06b6d4', anim:'pulse',      physics:'none', glow:true  },
  { label:'Fire Star',    type:'star',     fill:'#f97316', anim:'spin',       physics:'none', glow:false },
  { label:'Ghost Text',   type:'text',     fill:'#fff',    anim:'fadeIn',     physics:'none', glow:false },
  { label:'Neon Tri',     type:'triangle', fill:'#ec4899', anim:'neonFlicker',physics:'none', glow:true  },
  { label:'Bounce Ball',  type:'circle',   fill:'#10b981', anim:'none',       physics:'bounce',glow:false},
  { label:'Float Box',    type:'rect',     fill:'#8b5cf6', anim:'none',       physics:'float', glow:false},
  { label:'Spring Orb',   type:'circle',   fill:'#f59e0b', anim:'none',       physics:'spring',glow:true },
]

// ── One-click animation combos ────────────────────────────────
const ANIM_COMBOS = [
  { label:'🌟 Cinematic Entry', anim:'cinematic', duration:1.2, delay:0,   loop:false },
  { label:'💫 Infinite Float',  anim:'float',     duration:3,   delay:0,   loop:true  },
  { label:'⚡ Glitch Loop',    anim:'glitch',    duration:0.4, delay:0,   loop:true  },
  { label:'🌈 Neon Pulse',     anim:'neonFlicker',duration:1.5,delay:0,   loop:true  },
  { label:'🎯 Spring In',      anim:'springIn',  duration:0.8, delay:0.2, loop:false },
  { label:'🌊 Wave Idle',      anim:'wave',      duration:2.5, delay:0,   loop:true  },
  { label:'💥 Zoom Burst',     anim:'zoomPulse', duration:1,   delay:0,   loop:true  },
  { label:'🎬 Blur Reveal',    anim:'blur',      duration:1.5, delay:0,   loop:false },
]

// ── Color themes ──────────────────────────────────────────────
const COLOR_THEMES = [
  { label:'Violet',  fill:'#7c3aed', glow:'#7c3aed', border:'#a78bfa' },
  { label:'Cyan',    fill:'#06b6d4', glow:'#06b6d4', border:'#67e8f9' },
  { label:'Fire',    fill:'#f97316', glow:'#ef4444', border:'#fbbf24' },
  { label:'Emerald', fill:'#10b981', glow:'#10b981', border:'#34d399' },
  { label:'Rose',    fill:'#ec4899', glow:'#ec4899', border:'#f9a8d4' },
  { label:'Gold',    fill:'#f59e0b', glow:'#f59e0b', border:'#fcd34d' },
  { label:'Arctic',  fill:'#3b82f6', glow:'#60a5fa', border:'#93c5fd' },
  { label:'Neon',    fill:'#a3e635', glow:'#84cc16', border:'#d9f99d' },
]

// ── Physics quick-sets ────────────────────────────────────────
const PHYSICS_QUICK = [
  { label:'🚫 Off',         mode:'none',     enabled:false },
  { label:'🌊 Float',       mode:'float',    enabled:true  },
  { label:'⬇ Gravity',    mode:'gravity',  enabled:true  },
  { label:'⬆ Bounce',     mode:'bounce',   enabled:true  },
  { label:'🌀 Spring',     mode:'spring',   enabled:true  },
  { label:'🧲 Magnetic',   mode:'magnetic', enabled:true  },
  { label:'💨 Wind',       mode:'wind',     enabled:true  },
]

// ─────────────────────────────────────────────────────────────
export default function SimpleModePanel() {
  const { selectedEl, updateEl, addElement } = useCreator()

  function applyToSelected(patch) {
    if (!selectedEl) return
    updateEl(selectedEl.id, patch)
  }

  // ── Quick-add a preset shape to canvas ────────────────────
  function addQuickShape(preset) {
    const x = 200 + Math.random()*400, y = 150 + Math.random()*200
    const extra = {
      fill:    preset.fill,
      anim:    preset.anim !== 'none' ? { name:preset.anim, duration:2, delay:0, loop:true } : { name:'none' },
      physics: { enabled:preset.physics!=='none', mode:preset.physics||'none',
                 gravity:0.3, bounce:0.6, mass:1, friction:0.08,
                 wind:0, magnetic:0, stiffness:0.15, damping:0.85,
                 vx:0, vy:0, ax:0, ay:0, restX:0, restY:0, sleeping:false },
      glow:    preset.glow ? { enabled:true,  color:preset.fill, intensity:20 }
                           : { enabled:false, color:preset.fill, intensity:20 },
      label:   preset.label,
    }
    addElement(preset.type, Math.round(x), Math.round(y), extra)
  }

  const hasEl = !!selectedEl

  return (
    <div className="simple-panel">
      {/* ── Quick Add ─────────────────────────────────────── */}
      <div className="sp-section">
        <div className="sp-section-title">✨ Quick Add</div>
        <div className="sp-hint">Click to drop preset on canvas</div>
        <div className="sp-preset-grid">
          {QUICK_SHAPES.map(p => (
            <button key={p.label} className="sp-preset-btn" onClick={() => addQuickShape(p)}>
              <span className="sp-preset-dot" style={{ background:p.fill }}/>
              <span className="sp-preset-label">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Animation Combos ──────────────────────────────── */}
      <div className="sp-section">
        <div className="sp-section-title">🎬 Animation Presets</div>
        {!hasEl && <div className="sp-no-sel">Select an element first</div>}
        <div className={`sp-combo-grid ${!hasEl?'disabled':''}`}>
          {ANIM_COMBOS.map(c => (
            <button key={c.label} className="sp-combo-btn"
              disabled={!hasEl}
              onClick={() => applyToSelected({ anim:{ name:c.anim, duration:c.duration, delay:c.delay, loop:c.loop, easing:'ease-in-out' }})}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Color Themes ──────────────────────────────────── */}
      <div className="sp-section">
        <div className="sp-section-title">🎨 Color Themes</div>
        {!hasEl && <div className="sp-no-sel">Select an element first</div>}
        <div className={`sp-color-grid ${!hasEl?'disabled':''}`}>
          {COLOR_THEMES.map(t => (
            <button key={t.label} className="sp-color-swatch"
              disabled={!hasEl}
              style={{ background: t.fill }}
              title={t.label}
              onClick={() => applyToSelected({
                fill: t.fill,
                glow: { enabled:true, color:t.glow, intensity:18 },
                borderAnim: { enabled:true, type:'neon', color:t.border, speed:2, thickness:2, glow:12 },
              })}>
              <span className="sp-swatch-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Physics Quick ─────────────────────────────────── */}
      <div className="sp-section">
        <div className="sp-section-title">⚛️ Physics</div>
        {!hasEl && <div className="sp-no-sel">Select an element first</div>}
        <div className={`sp-phys-grid ${!hasEl?'disabled':''}`}>
          {PHYSICS_QUICK.map(p => (
            <button key={p.label} className={`sp-phys-btn ${selectedEl?.physics?.mode===p.mode&&p.mode!=='none'?'active':''}`}
              disabled={!hasEl}
              onClick={() => applyToSelected({
                physics: { ...selectedEl?.physics, mode:p.mode, enabled:p.enabled, sleeping:false, vx:0, vy:0 }
              })}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pro mode hint */}
      <div className="sp-pro-hint">
        Switch to <strong>Pro Mode</strong> in the toolbar for full controls
      </div>
    </div>
  )
}
