// src/pages/Studio3D/Studio3D.jsx
// Full 3D Animation Studio
// Features: 3D Viewport, Physics, Timeline, Keyframe Editor,
//           Material Editor, Lighting, Camera, Export (GLB/OBJ/MP4)
// Mobile: Touch orbit, gesture controls, floating panels

import { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import PhysicsPanel3D from '../AnimCreator/panels/PhysicsPanel3D.jsx'
import { useGestures } from '../../hooks/useGestures.js'
import './Studio3D.css'

const Viewport3D = lazy(() => import('../AnimCreator/panels/Viewport3D.jsx'))

// ─── Keyframe system ──────────────────────────────────────────
let _kfId = 0
const mkKeyframe = (time, body) => ({
  id: `kf_${_kfId++}`,
  time,
  position: { ...body.position },
  rotation: { ...body.rotation },
  bodyId: body.id,
  bodyName: body.name,
})

// ─── Panel tabs ───────────────────────────────────────────────
const PANELS = [
  { id:'physics',   icon:'⚡', label:'Physics'   },
  { id:'material',  icon:'🎨', label:'Material'  },
  { id:'lighting',  icon:'💡', label:'Lighting'  },
  { id:'camera',    icon:'📷', label:'Camera'    },
  { id:'keyframes', icon:'🔑', label:'Keyframes' },
  { id:'export',    icon:'↓',  label:'Export'    },
]

const LIGHT_PRESETS = {
  'Studio':    { ambient:0.5, dirX:5,  dirY:10, dirZ:5,  color:'#ffffff', intensity:1.2 },
  'Sunset':    { ambient:0.3, dirX:-8, dirY:4,  dirZ:2,  color:'#ff6b35', intensity:1.5 },
  'Moonlight': { ambient:0.1, dirX:2,  dirY:15, dirZ:-5, color:'#87ceeb', intensity:0.5 },
  'Neon Lab':  { ambient:0.2, dirX:0,  dirY:8,  dirZ:0,  color:'#7c3aed', intensity:2.0 },
  'Dawn':      { ambient:0.4, dirX:10, dirY:3,  dirZ:0,  color:'#ffd700', intensity:1.0 },
}

const MATERIAL_PRESETS = {
  'Neon Purple': { color:'#7c3aed', emissive:'#3b0764', metalness:0.3, roughness:0.4 },
  'Cyan Glow':   { color:'#06b6d4', emissive:'#0891b2', metalness:0.5, roughness:0.2 },
  'Gold':        { color:'#f59e0b', emissive:'#78350f', metalness:0.9, roughness:0.1 },
  'Chrome':      { color:'#e2e8f0', emissive:'#000000', metalness:1.0, roughness:0.0 },
  'Matte Red':   { color:'#ef4444', emissive:'#000000', metalness:0.0, roughness:0.9 },
  'Glass':       { color:'#93c5fd', emissive:'#000000', metalness:0.1, roughness:0.0, transparent:true, opacity:0.5 },
  'Rubber':      { color:'#22c55e', emissive:'#000000', metalness:0.0, roughness:1.0 },
  'Lava':        { color:'#ff4500', emissive:'#ff2200', metalness:0.0, roughness:0.8 },
}

export default function Studio3D() {
  const navigate   = useNavigate()
  const rootRef    = useRef(null)
  const vpRef      = useRef(null)

  const [panel,      setPanel]      = useState('physics')
  const [selectedBody, setSelectedBody] = useState(null)
  const [keyframes,  setKeyframes]  = useState([])
  const [currentTime,setCurrentTime]= useState(0)
  const [duration,   setDuration]   = useState(5)
  const [playing,    setPlaying]    = useState(false)
  const [lightPreset,setLightPreset]= useState('Studio')
  const [matPreset,  setMatPreset]  = useState('Neon Purple')
  const [showPanels, setShowPanels] = useState(true)
  const [panelSide,  setPanelSide]  = useState('right')
  const [gravity,    setGravity]    = useState({ x:0, y:-9.81, z:0 })
  const [worldStep,  setWorldStep]  = useState(0)
  const [exportFmt,  setExportFmt]  = useState('png')
  const timelineRef  = useRef(null)
  const playRef      = useRef(null)

  // ── Receive selected body from viewport
  const onSelectBody = useCallback((body) => {
    setSelectedBody(body)
    if (body) setPanel('physics')
  }, [])

  // ── Update physics body
  const onUpdateBody = useCallback((updated) => {
    vpRef.current?.updateBody(updated)
    setSelectedBody(updated)
  }, [])

  // ── Add keyframe at current time
  const addKeyframe = useCallback(() => {
    if (!selectedBody) return
    const kf = mkKeyframe(currentTime, selectedBody)
    setKeyframes(prev => [...prev.filter(k=>!(k.bodyId===selectedBody.id&&Math.abs(k.time-currentTime)<0.05)), kf])
  }, [selectedBody, currentTime])

  // ── Delete keyframe
  const deleteKf = useCallback((id) => {
    setKeyframes(prev => prev.filter(k=>k.id!==id))
  }, [])

  // ── Timeline playback
  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => {
        setCurrentTime(t => {
          const next = t + 0.033
          if (next >= duration) { setPlaying(false); return 0 }
          return next
        })
      }, 33)
    } else {
      clearInterval(playRef.current)
    }
    return () => clearInterval(playRef.current)
  }, [playing, duration])

  // ── Export functions
  const exportPNG = useCallback(() => {
    const canvas = document.querySelector('.vp3-canvas-mount canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `studio3d-${Date.now()}.png`
    a.click()
  }, [])

  // ── Gravity preset
  const applyGravityPreset = useCallback((preset) => {
    const presets = {
      'Earth':    { x:0, y:-9.81, z:0 },
      'Moon':     { x:0, y:-1.62, z:0 },
      'Mars':     { x:0, y:-3.71, z:0 },
      'Zero G':   { x:0, y:0,     z:0 },
      'Reverse':  { x:0, y:9.81,  z:0 },
      'Wind':     { x:5, y:-9.81, z:0 },
    }
    const g = presets[preset]
    if (!g) return
    setGravity(g)
    const world = vpRef.current?.getWorld()
    if (world) { world.gravity.x=g.x; world.gravity.y=g.y; world.gravity.z=g.z }
  }, [])

  // ── Mobile gesture: toggle panel
  useGestures(rootRef, {
    onSwipeLeft:  () => setShowPanels(false),
    onSwipeRight: () => setShowPanels(true),
  })

  return (
    <div className="s3d-root" ref={rootRef}>

      {/* ═══ TOP BAR ═══════════════════════════════ */}
      <header className="s3d-topbar">
        <button className="s3d-back" onClick={()=>navigate(-1)}>‹</button>
        <span className="s3d-title">🌎 3D Studio</span>
        <div className="s3d-top-center">
          {/* Timeline transport */}
          <button className="s3d-tbtn" onClick={()=>setCurrentTime(0)} title="Rewind">⏮</button>
          <button className={`s3d-tbtn s3d-play ${playing?'active':''}`}
            onClick={()=>setPlaying(p=>!p)} title="Play/Pause">
            {playing?'⏸':'▶'}
          </button>
          <button className="s3d-tbtn" onClick={()=>vpRef.current?.triggerExplosion()} title="Explosion">💥</button>
          <div className="s3d-time-display">
            {currentTime.toFixed(2)}s / {duration}s
          </div>
        </div>
        <div className="s3d-top-right">
          <button className="s3d-tbtn-sm" onClick={()=>setShowPanels(p=>!p)} title="Toggle Panels">
            {showPanels?'◧':'▣'}
          </button>
          <button className="s3d-tbtn-sm" onClick={exportPNG} title="Screenshot">📸</button>
        </div>
      </header>

      {/* ═══ MAIN LAYOUT ═══════════════════════════ */}
      <div className="s3d-layout">

        {/* ═══ 3D VIEWPORT ════════════════════════ */}
        <div className="s3d-viewport">
          <Suspense fallback={<div className="s3d-loading"><div className="s3d-spinner"/>Loading 3D Engine...</div>}>
            <Viewport3D
              ref={vpRef}
              onSelectBody={onSelectBody}
              onWorldStep={setWorldStep}
            />
          </Suspense>

          {/* Floating world info */}
          <div className="s3d-world-info">
            <span>⚡ g: ({gravity.y.toFixed(1)})</span>
            <span>🕐 {worldStep.toFixed(1)}s</span>
          </div>

          {/* Mobile panel toggle */}
          <button className="s3d-mob-panel-btn"
            onClick={()=>setShowPanels(p=>!p)}>
            {showPanels?'≡ Hide':'≡ Panels'}
          </button>
        </div>

        {/* ═══ RIGHT PANELS ═══════════════════════ */}
        {showPanels && (
          <aside className="s3d-panels">

            {/* Panel tab bar */}
            <div className="s3d-panel-tabs">
              {PANELS.map(p=>(
                <button key={p.id}
                  className={`s3d-ptab ${panel===p.id?'active':''}`}
                  onClick={()=>setPanel(p.id)}
                  title={p.label}>
                  <span>{p.icon}</span>
                  <span className="s3d-ptab-lbl">{p.label}</span>
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div className="s3d-panel-content">

              {/* ── Physics Panel ─────────────────── */}
              {panel==='physics' && (
                <>
                  <PhysicsPanel3D
                    body={selectedBody}
                    onUpdate={onUpdateBody}
                    onExplode={()=>vpRef.current?.triggerExplosion()}
                    onReset={()=>vpRef.current?.getWorld()?.reset()}
                  />
                  <div className="s3d-gravity-section">
                    <div className="s3d-section-head">🌍 Gravity Preset</div>
                    <div className="s3d-gravity-btns">
                      {['Earth','Moon','Mars','Zero G','Reverse','Wind'].map(g=>(
                        <button key={g} className="s3d-gravity-btn"
                          onClick={()=>applyGravityPreset(g)}>{g}</button>
                      ))}
                    </div>
                    <div className="s3d-gravity-inputs">
                      {['x','y','z'].map(ax=>(
                        <div key={ax} className="s3d-g-row">
                          <span>G.{ax.toUpperCase()}</span>
                          <input type="number" step="0.1"
                            value={gravity[ax]}
                            onChange={e=>{
                              const v=parseFloat(e.target.value)||0
                              const ng={...gravity,[ax]:v}
                              setGravity(ng)
                              const w=vpRef.current?.getWorld()
                              if(w) w.gravity[ax]=v
                            }}/>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Material Panel ────────────────── */}
              {panel==='material' && (
                <div className="s3d-material-panel">
                  <div className="s3d-section-head">🎨 Material Presets</div>
                  <div className="s3d-mat-grid">
                    {Object.entries(MATERIAL_PRESETS).map(([name,mat])=>(
                      <button key={name}
                        className={`s3d-mat-btn ${matPreset===name?'active':''}`}
                        style={{
                          background:`radial-gradient(circle at 35% 35%, ${mat.color}88, ${mat.color}22)`,
                          borderColor: matPreset===name ? mat.color : 'transparent'
                        }}
                        onClick={()=>setMatPreset(name)}>
                        <div className="s3d-mat-swatch" style={{background:mat.color}}/>
                        <span>{name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="s3d-section-head" style={{marginTop:12}}>✏️ Custom</div>
                  {selectedBody && (
                    <div className="s3d-custom-mat">
                      <div className="s3d-cm-row">
                        <span>Color</span>
                        <input type="color" defaultValue="#7c3aed"/>
                      </div>
                      <div className="s3d-cm-row">
                        <span>Emissive</span>
                        <input type="color" defaultValue="#000000"/>
                      </div>
                      <div className="s3d-cm-row">
                        <span>Metalness</span>
                        <input type="range" min="0" max="1" step="0.01" defaultValue="0.5"/>
                      </div>
                      <div className="s3d-cm-row">
                        <span>Roughness</span>
                        <input type="range" min="0" max="1" step="0.01" defaultValue="0.5"/>
                      </div>
                      <div className="s3d-cm-row">
                        <span>Opacity</span>
                        <input type="range" min="0" max="1" step="0.01" defaultValue="1"/>
                      </div>
                    </div>
                  )}
                  {!selectedBody && <div className="s3d-empty">Select an object first</div>}
                </div>
              )}

              {/* ── Lighting Panel ────────────────── */}
              {panel==='lighting' && (
                <div className="s3d-lighting-panel">
                  <div className="s3d-section-head">💡 Light Presets</div>
                  <div className="s3d-light-presets">
                    {Object.keys(LIGHT_PRESETS).map(name=>(
                      <button key={name}
                        className={`s3d-light-btn ${lightPreset===name?'active':''}`}
                        onClick={()=>setLightPreset(name)}>
                        {name}
                      </button>
                    ))}
                  </div>
                  {(() => {
                    const lp = LIGHT_PRESETS[lightPreset]
                    return (
                      <div className="s3d-light-settings">
                        {[
                          {k:'intensity',label:'Intensity', min:0, max:5, step:0.1},
                          {k:'ambient',  label:'Ambient',   min:0, max:2, step:0.05},
                          {k:'dirX',     label:'Dir X',     min:-20,max:20,step:0.5},
                          {k:'dirY',     label:'Dir Y',     min:0,  max:30,step:0.5},
                          {k:'dirZ',     label:'Dir Z',     min:-20,max:20,step:0.5},
                        ].map(({k,label,min,max,step})=>(
                          <div key={k} className="s3d-ls-row">
                            <span>{label}</span>
                            <input type="range" min={min} max={max} step={step}
                              defaultValue={lp[k]}/>
                            <span>{lp[k]}</span>
                          </div>
                        ))}
                        <div className="s3d-ls-row">
                          <span>Color</span>
                          <input type="color" defaultValue={lp.color}/>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* ── Camera Panel ──────────────────── */}
              {panel==='camera' && (
                <div className="s3d-camera-panel">
                  <div className="s3d-section-head">📷 Camera Settings</div>
                  {[
                    {label:'FOV',        min:20,  max:120, step:1,  def:60},
                    {label:'Near Clip',  min:0.01,max:10,  step:0.01,def:0.1},
                    {label:'Far Clip',   min:10,  max:2000,step:10,  def:1000},
                  ].map(({label,min,max,step,def})=>(
                    <div key={label} className="s3d-ls-row">
                      <span>{label}</span>
                      <input type="range" min={min} max={max} step={step} defaultValue={def}/>
                      <span>{def}</span>
                    </div>
                  ))}
                  <div className="s3d-section-head" style={{marginTop:12}}>🎬 Camera Mode</div>
                  <div className="s3d-cam-modes">
                    {['Orbit','Fly','Pan','First Person'].map(m=>(
                      <button key={m} className="s3d-cam-mode-btn">{m}</button>
                    ))}
                  </div>
                  <div className="s3d-section-head" style={{marginTop:12}}>📍 Saved Positions</div>
                  <div className="s3d-cam-saves">
                    {['Front','Side','Top','Iso','Custom'].map(v=>(
                      <button key={v} className="s3d-cam-save-btn">{v}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Keyframe Editor ───────────────── */}
              {panel==='keyframes' && (
                <div className="s3d-kf-panel">
                  <div className="s3d-kf-header">
                    <span className="s3d-section-head">🔑 Keyframes</span>
                    <button className="s3d-add-kf-btn"
                      onClick={addKeyframe}
                      disabled={!selectedBody}>
                      + Add at {currentTime.toFixed(2)}s
                    </button>
                  </div>

                  {/* Mini timeline */}
                  <div className="s3d-mini-tl" ref={timelineRef}>
                    <div className="s3d-tl-bar">
                      <div className="s3d-tl-playhead"
                        style={{left:`${(currentTime/duration)*100}%`}}/>
                      {keyframes.map(kf=>(
                        <div key={kf.id}
                          className="s3d-kf-marker"
                          style={{left:`${(kf.time/duration)*100}%`}}
                          title={`${kf.bodyName} @ ${kf.time.toFixed(2)}s`}
                          onClick={()=>setCurrentTime(kf.time)}>
                          <div className="s3d-kf-diamond"/>
                        </div>
                      ))}
                    </div>
                    <div className="s3d-tl-labels">
                      {[0,1,2,3,4,5].filter(t=>t<=duration).map(t=>(
                        <span key={t} style={{left:`${(t/duration)*100}%`}}>{t}s</span>
                      ))}
                    </div>
                  </div>

                  {/* Keyframe list */}
                  <div className="s3d-kf-list">
                    {keyframes.length===0 && (
                      <div className="s3d-empty">Select object → Add keyframe at any time point</div>
                    )}
                    {keyframes.map(kf=>(
                      <div key={kf.id} className="s3d-kf-item"
                        onClick={()=>setCurrentTime(kf.time)}>
                        <span className="s3d-kf-diamond-sm">◆</span>
                        <div className="s3d-kf-info">
                          <span className="s3d-kf-name">{kf.bodyName}</span>
                          <span className="s3d-kf-time">{kf.time.toFixed(2)}s</span>
                        </div>
                        <div className="s3d-kf-pos">
                          x:{kf.position.x.toFixed(1)} y:{kf.position.y.toFixed(1)} z:{kf.position.z.toFixed(1)}
                        </div>
                        <button className="s3d-kf-del"
                          onClick={e=>{e.stopPropagation();deleteKf(kf.id)}}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Timeline duration */}
                  <div className="s3d-ls-row" style={{padding:'8px 12px'}}>
                    <span>Duration</span>
                    <input type="range" min={1} max={30} step={1} value={duration}
                      onChange={e=>setDuration(+e.target.value)}/>
                    <span>{duration}s</span>
                  </div>
                </div>
              )}

              {/* ── Export Panel ──────────────────── */}
              {panel==='export' && (
                <div className="s3d-export-panel">
                  <div className="s3d-section-head">↓ Export</div>
                  <div className="s3d-exp-formats">
                    {['PNG','WebP','GLB','OBJ','JSON','MP4 (WIP)'].map(fmt=>(
                      <button key={fmt}
                        className={`s3d-exp-btn ${exportFmt===fmt.toLowerCase()?'active':''}`}
                        onClick={()=>setExportFmt(fmt.toLowerCase())}>
                        {fmt}
                      </button>
                    ))}
                  </div>
                  <button className="s3d-do-export" onClick={()=>{
                    if (exportFmt==='png'||exportFmt==='webp') exportPNG()
                    else alert(`${exportFmt.toUpperCase()} export coming soon!`)
                  }}>
                    ↓ Export as {exportFmt.toUpperCase()}
                  </button>
                  <div className="s3d-exp-settings">
                    <div className="s3d-ls-row">
                      <span>Width</span>
                      <input type="number" defaultValue={1920} className="s3d-exp-num"/>
                    </div>
                    <div className="s3d-ls-row">
                      <span>Height</span>
                      <input type="number" defaultValue={1080} className="s3d-exp-num"/>
                    </div>
                    <div className="s3d-ls-row">
                      <span>Quality</span>
                      <input type="range" min={0.1} max={1} step={0.05} defaultValue={0.92}/>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}
      </div>

      {/* ═══ BOTTOM TIMELINE BAR ════════════════════ */}
      <div className="s3d-timeline-bar">
        <div className="s3d-tl-transport">
          <button onClick={()=>setCurrentTime(0)}>⏮</button>
          <button onClick={()=>setPlaying(p=>!p)} className={playing?'active':''}>
            {playing?'⏸':'▶'}
          </button>
          <button onClick={()=>setCurrentTime(duration)}>⏭</button>
        </div>
        <div className="s3d-main-tl" onClick={e=>{
          const rect=e.currentTarget.getBoundingClientRect()
          const pct=(e.clientX-rect.left)/rect.width
          setCurrentTime(Math.max(0,Math.min(duration,pct*duration)))
        }}>
          <div className="s3d-main-tl-fill" style={{width:`${(currentTime/duration)*100}%`}}/>
          <div className="s3d-main-ph" style={{left:`${(currentTime/duration)*100}%`}}>
            <div className="s3d-main-ph-line"/>
            <div className="s3d-main-ph-head"/>
          </div>
          {keyframes.map(kf=>(
            <div key={kf.id} className="s3d-main-kf"
              style={{left:`${(kf.time/duration)*100}%`}}/>
          ))}
        </div>
        <div className="s3d-tl-time">
          {currentTime.toFixed(2)}s
        </div>
        <div className="s3d-tl-kf-count">
          {keyframes.length} KF
        </div>
        <button className="s3d-add-kf-mini"
          onClick={addKeyframe} disabled={!selectedBody}
          title="Add Keyframe">◆</button>
      </div>

    </div>
  )
}
