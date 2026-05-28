// RightPanel.jsx — UPDATED (Feature 8)
// New: Trigger tab (hover/click/scroll/auto) + Simple Mode panel

import { useCreator } from '../store/CreatorContext.jsx'
import { ANIMATIONS, ANIM_CATEGORIES, EASINGS, BORDER_ANIMS } from '../engine/AnimEngine.js'
import { SHADERS, SHADER_NAMES } from '../engine/ShaderEngine.js'
import { TRIGGERS, TRIGGER_NAMES, makeTriggerConfig } from '../engine/TriggerEngine.js'
import GradientBuilder, { makeGradient } from './GradientBuilder.jsx'
import SimpleModePanel from './SimpleModePanel.jsx'
import './RightPanel.css'

const PHYSICS_MODES = [
  { id:'none',     label:'Off',      icon:'—'  },
  { id:'gravity',  label:'Gravity',  icon:'↓'  },
  { id:'float',    label:'Float',    icon:'〰️' },
  { id:'spring',   label:'Spring',   icon:'🌀' },
  { id:'magnetic', label:'Magnetic', icon:'🧲' },
  { id:'bounce',   label:'Bounce',   icon:'⬆'  },
  { id:'wind',     label:'Wind',     icon:'💨' },
  { id:'cloth',    label:'Cloth',    icon:'🌊' },
]

// ── Shared sub-components ─────────────────────────────────────
function Slider({ label, value, min, max, step=1, unit='', onChange }) {
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <input type="range" className="prop-slider" min={min} max={max} step={step}
        value={value} onChange={e => onChange(+e.target.value)}/>
      <span className="prop-val">{typeof value==='number'?value.toFixed(step<1?2:0):value}{unit}</span>
    </div>
  )
}
function ColorRow({ label, value, onChange }) {
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <input type="color" className="prop-color" value={value||'#000000'} onChange={e=>onChange(e.target.value)}/>
      <input className="prop-hex" value={value||''} onChange={e=>onChange(e.target.value)} maxLength={7}/>
    </div>
  )
}
function Toggle({ label, value, onChange }) {
  return (
    <label className="prop-toggle">
      <input type="checkbox" checked={value||false} onChange={e=>onChange(e.target.checked)}/>
      <span className="toggle-track"><span className="toggle-thumb"/></span>
      <span className="prop-toggle-label">{label}</span>
    </label>
  )
}

// ── Properties tab ─────────────────────────────────────────────
function PropertiesTab({ el, update }) {
  if (!el) return <div className="rp-empty">Select an element to edit</div>
  return (
    <div className="rp-scroll">
      <div className="prop-section">
        <div className="prop-section-title">📐 Transform</div>
        <div className="prop-xy-row">
          <div className="prop-xy-group"><span className="prop-label">X</span><input type="number" className="prop-num" value={Math.round(el.x)} onChange={e=>update({x:+e.target.value})}/></div>
          <div className="prop-xy-group"><span className="prop-label">Y</span><input type="number" className="prop-num" value={Math.round(el.y)} onChange={e=>update({y:+e.target.value})}/></div>
        </div>
        <div className="prop-xy-row">
          <div className="prop-xy-group"><span className="prop-label">W</span><input type="number" className="prop-num" value={el.width}  min={10} onChange={e=>update({width:+e.target.value})}/></div>
          <div className="prop-xy-group"><span className="prop-label">H</span><input type="number" className="prop-num" value={el.height} min={10} onChange={e=>update({height:+e.target.value})}/></div>
        </div>
        <Slider label="Rotation" value={el.rotation||0} min={-180} max={180} unit="°" onChange={v=>update({rotation:v})}/>
        <Slider label="Opacity"  value={el.opacity}     min={0} max={1} step={0.01}   onChange={v=>update({opacity:v})}/>
        {el.type!=='circle'&&el.type!=='text'&&(
          <Slider label="Radius" value={el.borderRadius||0} min={0} max={50} unit="%" onChange={v=>update({borderRadius:v})}/>
        )}
      </div>
      <div className="prop-section">
        <div className="prop-section-title">🎨 Fill</div>
        {el.type!=='text'?(
          <ColorRow label="Color" value={el.fill} onChange={v=>update({fill:v})}/>
        ):(
          <>
            <ColorRow label="Text Color" value={el.fontColor} onChange={v=>update({fontColor:v})}/>
            <div className="prop-row"><span className="prop-label">Content</span><input className="prop-text-input" value={el.label} onChange={e=>update({label:e.target.value})}/></div>
            <Slider label="Font Size" value={el.fontSize||20} min={10} max={96} unit="px" onChange={v=>update({fontSize:v})}/>
            <div className="prop-row"><span className="prop-label">Weight</span>
              <select className="prop-select" value={el.fontWeight||'700'} onChange={e=>update({fontWeight:e.target.value})}>
                {['300','400','500','600','700','800','900'].map(w=><option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </>
        )}
      </div>
      <div className="prop-section">
        <div className="prop-section-title">🌑 Shadow</div>
        <Toggle label="Enable Shadow" value={el.shadow?.enabled} onChange={v=>update({shadow:{...el.shadow,enabled:v}})}/>
        {el.shadow?.enabled&&(<>
          <ColorRow label="Color" value={el.shadow?.color||'#7c3aed'} onChange={v=>update({shadow:{...el.shadow,color:v}})}/>
          <Slider label="Blur" value={el.shadow?.blur||20} min={0} max={60} unit="px" onChange={v=>update({shadow:{...el.shadow,blur:v}})}/>
          <Slider label="X"    value={el.shadow?.x||0}    min={-30} max={30}           onChange={v=>update({shadow:{...el.shadow,x:v}})}/>
          <Slider label="Y"    value={el.shadow?.y||0}    min={-30} max={30}           onChange={v=>update({shadow:{...el.shadow,y:v}})}/>
        </>)}
      </div>
      <div className="prop-section">
        <div className="prop-section-title">✨ Glow</div>
        <Toggle label="Enable Glow" value={el.glow?.enabled} onChange={v=>update({glow:{...el.glow,enabled:v}})}/>
        {el.glow?.enabled&&(<>
          <ColorRow label="Color"     value={el.glow?.color||'#7c3aed'} onChange={v=>update({glow:{...el.glow,color:v}})}/>
          <Slider   label="Intensity" value={el.glow?.intensity||20} min={4} max={60} unit="px" onChange={v=>update({glow:{...el.glow,intensity:v}})}/>
        </>)}
      </div>
      <div className="prop-section">
        <div className="prop-section-title">🔒 State</div>
        <Toggle label="Lock element"  value={el.locked}         onChange={v=>update({locked:v})}/>
        <Toggle label="Hide element"  value={el.visible===false} onChange={v=>update({visible:!v})}/>
      </div>
    </div>
  )
}

// ── Gradient tab ──────────────────────────────────────────────
function GradientTab({ el, update }) {
  if (!el) return <div className="rp-empty">Select an element to edit</div>
  if (['text','image','draw','line'].includes(el.type)) return <div className="rp-empty">Gradient not available for {el.type}</div>
  const gradient = el.gradient || null
  return (
    <div className="rp-scroll">
      <div className="prop-section">
        <div className="prop-section-title">🌈 Gradient Fill</div>
        <Toggle label="Enable Gradient" value={!!gradient}
          onChange={v=>update({gradient:v?makeGradient(el.fill||'#7c3aed','#06b6d4'):null})}/>
        {gradient && <div style={{marginTop:'0.5rem'}}><GradientBuilder gradient={gradient} onChange={g=>update({gradient:g})}/></div>}
        {!gradient && <div className="grad-off-hint">Enable gradient to replace flat fill color</div>}
      </div>
    </div>
  )
}

// ── Shader tab ────────────────────────────────────────────────
function ShaderTab({ el, update }) {
  if (!el) return <div className="rp-empty">Select an element to edit</div>
  const shader = el.shader || { name:'none', intensity:0.8 }
  return (
    <div className="rp-scroll">
      <div className="prop-section">
        <div className="prop-section-title">⚗️ Shader Effects</div>
        <div className="shader-grid">
          {SHADER_NAMES.map(name => {
            const def = SHADERS[name]
            return (
              <button key={name} className={`shader-btn ${shader.name===name?'active':''}`}
                onClick={() => update({shader:{...shader,name}})} title={def.label}>
                <span className="shader-btn-icon">{def.icon}</span>
                <span className="shader-btn-label">{def.label}</span>
              </button>
            )
          })}
        </div>
        {shader.name!=='none'&&(
          <div className="prop-section" style={{marginTop:'0.75rem'}}>
            <div className="prop-section-title">⚙️ Intensity</div>
            <Slider label="Strength" value={shader.intensity??0.8} min={0.1} max={1} step={0.05}
              onChange={v=>update({shader:{...shader,intensity:v}})}/>
          </div>
        )}
      </div>
      <div className="prop-section">
        <div className="prop-section-title">🌈 CSS Filters</div>
        {(()=>{ const fx=el.effects||{}; return (<>
          <Slider label="Blur"       value={fx.blur||0}         min={0}  max={20}  unit="px" onChange={v=>update({effects:{...fx,blur:v}})}/>
          <Slider label="Brightness" value={fx.brightness||100} min={50} max={200} unit="%"  onChange={v=>update({effects:{...fx,brightness:v}})}/>
          <Slider label="Contrast"   value={fx.contrast||100}   min={50} max={200} unit="%"  onChange={v=>update({effects:{...fx,contrast:v}})}/>
          <Slider label="Saturate"   value={fx.saturate||100}   min={0}  max={300} unit="%"  onChange={v=>update({effects:{...fx,saturate:v}})}/>
          <Slider label="Hue Rotate" value={fx.hueRotate||0}    min={0}  max={360} unit="°"  onChange={v=>update({effects:{...fx,hueRotate:v}})}/>
          <button className="phys-reset-btn" onClick={()=>update({effects:{blur:0,brightness:100,contrast:100,saturate:100,hueRotate:0}})}>↺ Reset</button>
        </>)})()}
      </div>
    </div>
  )
}

// ── Animation tab ─────────────────────────────────────────────
function AnimationTab({ el, update }) {
  if (!el) return <div className="rp-empty">Select an element to edit</div>
  const anim = el.anim || {}
  return (
    <div className="rp-scroll">
      <div className="prop-section">
        <div className="prop-section-title">🎬 Animation Preset</div>
        {Object.entries(ANIM_CATEGORIES).map(([cat,keys]) => (
          <div key={cat} className="anim-category">
            <div className="anim-cat-label">{cat}</div>
            <div className="anim-grid">
              {keys.map(k => {
                const def = ANIMATIONS[k]
                return (
                  <button key={k} className={`anim-preset-btn ${anim.name===k?'active':''}`}
                    onClick={()=>update({anim:{...anim,name:k}})} title={def.label}>
                    <span>{def.icon}</span><span>{def.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {anim.name&&anim.name!=='none'&&(
        <div className="prop-section">
          <div className="prop-section-title">⚙️ Controls</div>
          <Slider label="Duration" value={anim.duration||2} min={0.2} max={10} step={0.1} unit="s" onChange={v=>update({anim:{...anim,duration:v}})}/>
          <Slider label="Delay"    value={anim.delay||0}    min={0}   max={5}  step={0.1} unit="s" onChange={v=>update({anim:{...anim,delay:v}})}/>
          <Toggle label="Loop"     value={anim.loop!==false} onChange={v=>update({anim:{...anim,loop:v}})}/>
          <div className="prop-row"><span className="prop-label">Easing</span>
            <select className="prop-select" value={anim.easing||'ease-in-out'} onChange={e=>update({anim:{...anim,easing:e.target.value}})}>
              {EASINGS.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

// ── ✦ TRIGGER TAB (NEW) ──────────────────────────────────────
function TriggerTab({ el, update }) {
  if (!el) return <div className="rp-empty">Select an element to edit</div>
  const trigger      = el.trigger            || 'auto'
  const resetOnLeave = el.trigger_resetOnLeave !== false

  return (
    <div className="rp-scroll">
      <div className="prop-section">
        <div className="prop-section-title">🎯 Animation Trigger</div>
        <div className="trigger-desc">How does this element's animation start?</div>
        <div className="trigger-grid">
          {TRIGGER_NAMES.map(name => {
            const def = TRIGGERS[name]
            return (
              <button key={name}
                className={`trigger-btn ${trigger===name?'active':''}`}
                onClick={() => update({ trigger:name, trigger_resetOnLeave: name==='hover' })}>
                <span className="trig-icon">{def.icon}</span>
                <span className="trig-label">{def.label}</span>
              </button>
            )
          })}
        </div>

        {/* Trigger-specific options */}
        {trigger !== 'auto' && (
          <div className="trigger-options">
            <div className="prop-section-title" style={{marginTop:'0.5rem'}}>⚙️ Options</div>
            <div className="trig-desc-box">
              {TRIGGERS[trigger]?.desc}
            </div>
            {trigger === 'hover' && (
              <Toggle label="Reset on mouse leave"
                value={resetOnLeave}
                onChange={v=>update({trigger_resetOnLeave:v})}/>
            )}
            {trigger === 'click' && (
              <div className="prop-row">
                <span className="prop-label">Re-trigger</span>
                <span className="prop-val" style={{color:'#6b7280',fontSize:'0.63rem'}}>Auto after animation ends</span>
              </div>
            )}
            {trigger === 'scroll' && (
              <div className="trig-hint">Element plays when 20% visible in viewport</div>
            )}
          </div>
        )}
      </div>

      {/* Preview note */}
      <div className="prop-section">
        <div className="trig-preview-note">
          <span className="tpn-icon">ℹ️</span>
          <span>Triggers are active in the exported HTML.<br/>
          In the editor: hover/click work live.<br/>
          Scroll trigger works in exported page.</span>
        </div>
      </div>
    </div>
  )
}

// ── Physics tab ───────────────────────────────────────────────
function PhysicsTab({ el, update }) {
  if (!el) return <div className="rp-empty">Select an element to edit</div>
  const phys = el.physics || {}
  return (
    <div className="rp-scroll">
      <div className="prop-section">
        <div className="prop-section-title">⚛️ Physics Mode</div>
        <div className="phys-modes">
          {PHYSICS_MODES.map(m=>(
            <button key={m.id} className={`phys-mode-btn ${(phys.mode||'none')===m.id?'active':''}`}
              onClick={()=>update({physics:{...phys,mode:m.id,enabled:m.id!=='none',sleeping:false}})}>
              <span>{m.icon}</span><span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>
      {phys.enabled&&phys.mode!=='none'&&(
        <div className="prop-section">
          <div className="prop-section-title">🔧 Parameters</div>
          {['gravity','bounce','spring'].includes(phys.mode)&&<Slider label="Gravity"    value={phys.gravity||0.3}   min={0} max={2}   step={0.05} onChange={v=>update({physics:{...phys,gravity:v}})}/>}
          {['gravity','bounce'].includes(phys.mode)&&<Slider         label="Bounce"     value={phys.bounce||0.6}    min={0} max={1}   step={0.05} onChange={v=>update({physics:{...phys,bounce:v}})}/>}
          <Slider label="Mass"     value={phys.mass||1}        min={0.1} max={5} step={0.1}  onChange={v=>update({physics:{...phys,mass:v}})}/>
          <Slider label="Friction" value={phys.friction||0.08} min={0}   max={0.5} step={0.01} onChange={v=>update({physics:{...phys,friction:v}})}/>
          {phys.mode==='spring'&&<><Slider label="Stiffness" value={phys.stiffness||0.15} min={0.01} max={0.5} step={0.01} onChange={v=>update({physics:{...phys,stiffness:v}})}/>
            <Slider label="Damping" value={phys.damping||0.85} min={0.5} max={1} step={0.01} onChange={v=>update({physics:{...phys,damping:v}})}/>
          </>}
          {phys.mode==='magnetic'&&<Slider label="Attraction" value={phys.magnetic||0.5} min={0} max={2} step={0.05} onChange={v=>update({physics:{...phys,magnetic:v}})}/>}
          {['wind','cloth'].includes(phys.mode)&&<Slider label="Wind Force" value={phys.wind||0.5} min={0} max={3} step={0.1} onChange={v=>update({physics:{...phys,wind:v}})}/>}
          <div className="prop-row" style={{marginTop:'0.5rem'}}>
            <button className="phys-reset-btn" onClick={()=>update({physics:{...phys,vx:0,vy:0,sleeping:false}})}>↺ Reset Motion</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Border tab ────────────────────────────────────────────────
function BorderTab({ el, update }) {
  if (!el) return <div className="rp-empty">Select an element to edit</div>
  const ba = el.borderAnim || {}
  return (
    <div className="rp-scroll">
      <div className="prop-section">
        <div className="prop-section-title">🔲 Border Animation</div>
        <Toggle label="Enable Border Animation" value={ba.enabled} onChange={v=>update({borderAnim:{...ba,enabled:v}})}/>
        {ba.enabled&&(<>
          <div className="border-type-grid">
            {Object.entries(BORDER_ANIMS).map(([k,v])=>(
              <button key={k} className={`border-type-btn ${ba.type===k?'active':''}`}
                onClick={()=>update({borderAnim:{...ba,type:k}})}>{v.label}</button>
            ))}
          </div>
          <ColorRow label="Color"     value={ba.color||'#06b6d4'} onChange={v=>update({borderAnim:{...ba,color:v}})}/>
          <Slider   label="Thickness" value={ba.thickness||2}     min={1} max={12} unit="px"  onChange={v=>update({borderAnim:{...ba,thickness:v}})}/>
          <Slider   label="Glow"      value={ba.glow||15}         min={0} max={50} unit="px"  onChange={v=>update({borderAnim:{...ba,glow:v}})}/>
          <Slider   label="Speed"     value={ba.speed||2}         min={0.3} max={8} step={0.1} unit="s" onChange={v=>update({borderAnim:{...ba,speed:v}})}/>
        </>)}
      </div>
    </div>
  )
}

// ── Main RightPanel ───────────────────────────────────────────
const PRO_PANELS = [
  { id:'properties', icon:'📐', label:'Props'   },
  { id:'gradient',   icon:'🌈', label:'Grad'    },
  { id:'shader',     icon:'⚗️', label:'Shader'  },
  { id:'animation',  icon:'🎬', label:'Anim'    },
  { id:'trigger',    icon:'🎯', label:'Trigger' },  // NEW
  { id:'physics',    icon:'⚛️', label:'Phys'    },
  { id:'border',     icon:'🔲', label:'Border'  },
]

export default function RightPanel() {
  const { selectedEl, updateEl, activeRightPanel, setPanel, mode } = useCreator()
  const update = (patch) => { if (selectedEl) updateEl(selectedEl.id, patch) }

  // ── Simple mode → show SimpleModePanel ───────────────────
  if (mode === 'simple') {
    return (
      <div className="right-panel">
        <div className="rp-simple-header">
          <span className="rp-sh-icon">✨</span>
          <span className="rp-sh-title">Simple Mode</span>
        </div>
        <SimpleModePanel/>
      </div>
    )
  }

  // ── Pro mode → full tabs ──────────────────────────────────
  return (
    <div className="right-panel">
      <div className="rp-tabs">
        {PRO_PANELS.map(p=>(
          <button key={p.id} className={`rp-tab ${activeRightPanel===p.id?'active':''}`}
            onClick={()=>setPanel(p.id)} title={p.label}>
            <span>{p.icon}</span>
            <span className="rp-tab-label">{p.label}</span>
          </button>
        ))}
      </div>
      <div className="rp-content">
        {activeRightPanel==='properties' && <PropertiesTab el={selectedEl} update={update}/>}
        {activeRightPanel==='gradient'   && <GradientTab   el={selectedEl} update={update}/>}
        {activeRightPanel==='shader'     && <ShaderTab     el={selectedEl} update={update}/>}
        {activeRightPanel==='animation'  && <AnimationTab  el={selectedEl} update={update}/>}
        {activeRightPanel==='trigger'    && <TriggerTab    el={selectedEl} update={update}/>}
        {activeRightPanel==='physics'    && <PhysicsTab    el={selectedEl} update={update}/>}
        {activeRightPanel==='border'     && <BorderTab     el={selectedEl} update={update}/>}
      </div>
    </div>
  )
}
