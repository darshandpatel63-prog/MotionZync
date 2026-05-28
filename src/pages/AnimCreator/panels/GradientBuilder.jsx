// GradientBuilder.jsx — NEW
// Visual multi-stop gradient builder
// Supports: linear, radial, conic | drag stops | add/delete stops

import { useState, useRef, useCallback } from 'react'
import './GradientBuilder.css'

// ─── Default gradient ────────────────────────────────────────
export function makeGradient(from='#7c3aed', to='#06b6d4') {
  return {
    type:   'linear',
    angle:  135,
    stops:  [
      { id:'s0', pos:0,   color: from },
      { id:'s1', pos:100, color: to   },
    ],
  }
}

// ─── Build CSS gradient string from stops ────────────────────
export function buildGradientCSS(g) {
  if (!g) return ''
  const sorted = [...g.stops].sort((a,b) => a.pos - b.pos)
  const stops  = sorted.map(s => `${s.color} ${s.pos}%`).join(', ')
  if (g.type === 'radial') return `radial-gradient(circle, ${stops})`
  if (g.type === 'conic')  return `conic-gradient(from ${g.angle||0}deg, ${stops})`
  return `linear-gradient(${g.angle||135}deg, ${stops})`
}

// ─── Color stop marker ───────────────────────────────────────
function StopMarker({ stop, selected, onSelect, onDrag, onDelete }) {
  const markerRef = useRef(null)

  function handleMouseDown(e) {
    e.preventDefault(); e.stopPropagation()
    onSelect(stop.id)
    const startX = e.clientX, startPos = stop.pos
    function move(ev) {
      const parent = markerRef.current?.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const newPos = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100))
      onDrag(stop.id, Math.round(newPos))
    }
    function up() { window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup',   up)
  }

  return (
    <div
      ref={markerRef}
      className={`gb-stop-marker ${selected?'sel':''}`}
      style={{ left: `${stop.pos}%`, background: stop.color }}
      onMouseDown={handleMouseDown}
      title={`${stop.color} at ${stop.pos}%\nDouble-click to delete`}
      onDoubleClick={e => { e.stopPropagation(); onDelete(stop.id) }}
    >
      <div className="gb-stop-pin"/>
    </div>
  )
}

// ─── Main GradientBuilder ─────────────────────────────────────
export default function GradientBuilder({ gradient, onChange }) {
  const [selStop, setSelStop] = useState(gradient?.stops?.[0]?.id || null)
  const barRef = useRef(null)

  const g       = gradient || makeGradient()
  const selObj  = g.stops.find(s => s.id === selStop)
  const cssStr  = buildGradientCSS(g)

  function updateGrad(patch) { onChange({ ...g, ...patch }) }
  function updateStop(id, patch) {
    onChange({ ...g, stops: g.stops.map(s => s.id===id ? {...s,...patch} : s) })
  }
  function addStop(e) {
    const rect = barRef.current?.getBoundingClientRect(); if(!rect) return
    const pos  = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    // interpolate color at that position
    const sorted = [...g.stops].sort((a,b)=>a.pos-b.pos)
    let color = sorted[0]?.color || '#ffffff'
    for (let i=0; i<sorted.length-1; i++) {
      if (sorted[i].pos <= pos && sorted[i+1].pos >= pos) {
        color = sorted[i].color; break
      }
    }
    const newStop = { id:`s${Date.now()}`, pos, color }
    const newId   = newStop.id
    onChange({ ...g, stops:[...g.stops, newStop] })
    setSelStop(newId)
  }
  function deleteStop(id) {
    if (g.stops.length <= 2) return // min 2 stops
    onChange({ ...g, stops: g.stops.filter(s=>s.id!==id) })
    setSelStop(g.stops.find(s=>s.id!==id)?.id || null)
  }

  // PRESET gradients
  const PRESETS = [
    { label:'Violet', stops:[{id:'a',pos:0,color:'#7c3aed'},{id:'b',pos:100,color:'#06b6d4'}], type:'linear',angle:135 },
    { label:'Fire',   stops:[{id:'a',pos:0,color:'#f97316'},{id:'b',pos:100,color:'#ef4444'}], type:'linear',angle:135 },
    { label:'Forest', stops:[{id:'a',pos:0,color:'#059669'},{id:'b',pos:100,color:'#0d9488'}], type:'linear',angle:135 },
    { label:'Gold',   stops:[{id:'a',pos:0,color:'#f59e0b'},{id:'b',pos:100,color:'#fcd34d'}], type:'linear',angle:135 },
    { label:'Rose',   stops:[{id:'a',pos:0,color:'#ec4899'},{id:'b',pos:100,color:'#8b5cf6'}], type:'linear',angle:135 },
    { label:'Ice',    stops:[{id:'a',pos:0,color:'#bae6fd'},{id:'b',pos:100,color:'#7c3aed'}], type:'linear',angle:180 },
    { label:'Dusk',   stops:[{id:'a',pos:0,color:'#1e1b4b'},{id:'b',pos:50,color:'#7c3aed'},{id:'c',pos:100,color:'#f97316'}], type:'linear',angle:135 },
    { label:'Ocean',  stops:[{id:'a',pos:0,color:'#0c4a6e'},{id:'b',pos:100,color:'#06b6d4'}], type:'radial',angle:0 },
  ]

  return (
    <div className="gradient-builder">
      {/* Type + Angle row */}
      <div className="gb-row">
        <div className="gb-type-btns">
          {['linear','radial','conic'].map(t => (
            <button key={t} className={`gb-type-btn ${g.type===t?'active':''}`}
              onClick={() => updateGrad({type:t})}>{t}</button>
          ))}
        </div>
        {(g.type==='linear'||g.type==='conic') && (
          <div className="gb-angle-row">
            <span className="gb-label">Angle</span>
            <input type="range" className="gb-slider" min={0} max={360}
              value={g.angle||135} onChange={e => updateGrad({angle:+e.target.value})}/>
            <span className="gb-val">{g.angle||135}°</span>
          </div>
        )}
      </div>

      {/* Gradient bar */}
      <div className="gb-bar-wrap">
        <div className="gb-checkers"/>
        <div ref={barRef} className="gb-bar" style={{ background: cssStr }}
          onClick={addStop} title="Click to add stop"/>
        {/* Stop markers */}
        <div className="gb-stops-row">
          {g.stops.map(s => (
            <StopMarker key={s.id} stop={s} selected={selStop===s.id}
              onSelect={setSelStop}
              onDrag={(id,pos) => updateStop(id,{pos})}
              onDelete={deleteStop}/>
          ))}
        </div>
      </div>

      {/* Selected stop controls */}
      {selObj && (
        <div className="gb-stop-ctrl">
          <input type="color" className="gb-stop-color" value={selObj.color}
            onChange={e => updateStop(selObj.id, {color:e.target.value})}/>
          <input className="gb-stop-hex" value={selObj.color}
            onChange={e => updateStop(selObj.id, {color:e.target.value})} maxLength={7}/>
          <span className="gb-label">Pos</span>
          <input type="number" className="gb-stop-pos" min={0} max={100}
            value={selObj.pos} onChange={e => updateStop(selObj.id, {pos:Math.max(0,Math.min(100,+e.target.value))})}/>
          <span className="gb-label">%</span>
          {g.stops.length > 2 && (
            <button className="gb-del-stop" onClick={() => deleteStop(selObj.id)} title="Delete stop">✕</button>
          )}
        </div>
      )}

      {/* Presets */}
      <div className="gb-presets">
        {PRESETS.map(p => (
          <div key={p.label} className="gb-preset"
            style={{ background: buildGradientCSS(p) }}
            onClick={() => onChange({...p, stops:p.stops.map(s=>({...s,id:'s'+Math.random().toString(36).slice(2,6)}))})}
            title={p.label}
          />
        ))}
      </div>
      <div className="gb-preset-hint">Click preset · Click bar to add stop · Drag stops · Double-click to delete</div>
    </div>
  )
}
