// TimelinePanel.jsx — NEW
// Full keyframe-based timeline editor
// Features: add/delete/drag keyframes, playback, scrub, per-element tracks

import { useState, useRef, useEffect, useCallback } from 'react'
import { useCreator } from '../store/CreatorContext.jsx'
import {
  makeKeyframe, getStateAtTime, getElementTrack,
  snapTime, formatTime, EASING_NAMES,
} from '../engine/TimelineEngine.js'
import './TimelinePanel.css'

const DURATION   = 8      // default scene duration (seconds)
const FPS        = 24
const TRACK_H    = 32     // px per track row
const RULER_H    = 28     // px ruler height
const MIN_ZOOM   = 60     // px per second minimum
const MAX_ZOOM   = 400

// ── Ruler ─────────────────────────────────────────────────────
function Ruler({ duration, pxPerSec, scrollX }) {
  const ticks = []
  for (let i = 0; i <= duration; i += 0.5) {
    const x      = i * pxPerSec - scrollX
    const isMaj  = Number.isInteger(i)
    if (x < -40 || x > 4000) continue
    ticks.push(
      <div key={i} className={`tl-tick ${isMaj?'major':''}`} style={{ left: x }}>
        {isMaj && <span className="tl-tick-label">{formatTime(i,FPS)}</span>}
      </div>
    )
  }
  return <div className="tl-ruler">{ticks}</div>
}

// ── Keyframe diamond ──────────────────────────────────────────
function KfDiamond({ kf, pxPerSec, scrollX, selected, onMouseDown, onDoubleClick }) {
  const x = kf.time * pxPerSec - scrollX - 6
  return (
    <div
      className={`tl-kf ${selected?'sel':''}`}
      style={{ left: x }}
      onMouseDown={e => { e.stopPropagation(); onMouseDown(e, kf) }}
      onDoubleClick={e => { e.stopPropagation(); onDoubleClick(kf) }}
      title={`${formatTime(kf.time,FPS)} — ${kf.easing}`}
    />
  )
}

// ── Easing picker popover ─────────────────────────────────────
function EasingPicker({ kf, onSelect, onClose }) {
  return (
    <div className="tl-ease-picker">
      <div className="tl-ep-title">Easing — {formatTime(kf.time,FPS)}</div>
      <div className="tl-ep-grid">
        {EASING_NAMES.map(name => (
          <button key={name}
            className={`tl-ep-btn ${kf.easing===name?'active':''}`}
            onClick={() => { onSelect(name); onClose() }}>
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// Main TimelinePanel
// ════════════════════════════════════════════════════════════
export default function TimelinePanel() {
  const { elements, selected, select, dispatch, playing, playTime } = useCreator()

  const [pxPerSec,   setPxPerSec]   = useState(100)
  const [scrollX,    setScrollX]    = useState(0)
  const [duration,   setDuration]   = useState(DURATION)
  const [selKf,      setSelKf]      = useState(null)   // { elId, kfId }
  const [easingKf,   setEasingKf]   = useState(null)   // kf object for popover
  const [headTime,   setHeadTime]   = useState(0)      // playhead position

  const rulerRef     = useRef(null)
  const tracksRef    = useRef(null)
  const dragKfRef    = useRef(null)   // { elId, kfId, startX, startTime }
  const rafRef       = useRef(null)
  const startTimeRef = useRef(null)
  const pauseTimeRef = useRef(0)

  // ── Playback loop ──────────────────────────────────────────
  useEffect(() => {
    if (playing) {
      startTimeRef.current = performance.now() - pauseTimeRef.current * 1000
      function loop(now) {
        const t = Math.min((now - startTimeRef.current) / 1000, duration)
        setHeadTime(t)
        dispatch({ type:'TICK_PLAY', dt: 1/60 })
        // Apply keyframe state to each element
        elements.forEach(el => {
          if (!el._keyframes?.length) return
          const state = getStateAtTime(el._keyframes, t)
          if (Object.keys(state).length)
            dispatch({ type:'UPDATE_ELEMENT', id:el.id, patch:state })
        })
        if (t < duration) rafRef.current = requestAnimationFrame(loop)
        else dispatch({ type:'SET_PLAYING', playing:false })
      }
      rafRef.current = requestAnimationFrame(loop)
    } else {
      pauseTimeRef.current = headTime
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  // ── Ruler click → scrub ────────────────────────────────────
  function handleRulerDown(e) {
    const rect = rulerRef.current?.getBoundingClientRect(); if(!rect) return
    function move(ev) {
      const t = snapTime((ev.clientX - rect.left + scrollX) / pxPerSec, duration, FPS)
      setHeadTime(t); pauseTimeRef.current = t
      // scrub: apply element states
      elements.forEach(el => {
        if (!el._keyframes?.length) return
        const state = getStateAtTime(el._keyframes, t)
        if (Object.keys(state).length)
          dispatch({ type:'UPDATE_ELEMENT', id:el.id, patch:state })
      })
    }
    function up() { window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup',   up)
    move(e)
  }

  // ── Track area click → add keyframe ────────────────────────
  function handleTrackClick(e, elId) {
    if (dragKfRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const t    = snapTime((e.clientX - rect.left + scrollX) / pxPerSec, duration, FPS)
    const el   = elements.find(x=>x.id===elId); if(!el) return
    const existing = el._keyframes?.find(k => Math.abs(k.time-t) < 0.02)
    if (existing) return  // already has one here
    const kf = makeKeyframe(t, el)
    dispatch({ type:'UPDATE_ELEMENT', id:elId,
      patch:{ _keyframes: [...(el._keyframes||[]), kf] }})
  }

  // ── Keyframe drag ──────────────────────────────────────────
  function handleKfMouseDown(e, elId, kf) {
    e.preventDefault()
    setSelKf({ elId, kfId:kf.id })
    dragKfRef.current = { elId, kfId:kf.id, startX:e.clientX, startTime:kf.time }

    function move(ev) {
      const d    = dragKfRef.current; if(!d) return
      const el   = elements.find(x=>x.id===d.elId); if(!el) return
      const dt   = (ev.clientX - d.startX) / pxPerSec
      const newT = snapTime(d.startTime + dt, duration, FPS)
      dispatch({ type:'UPDATE_ELEMENT', id:d.elId,
        patch:{ _keyframes: (el._keyframes||[]).map(k =>
          k.id===d.kfId ? {...k, time:newT} : k) }})
    }
    function up() {
      dragKfRef.current = null
      window.removeEventListener('mousemove',move)
      window.removeEventListener('mouseup',  up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup',   up)
  }

  // ── Update keyframe at current head (capture current state) ─
  function captureKeyframe(elId) {
    const el = elements.find(x=>x.id===elId); if(!el) return
    const existing = el._keyframes?.find(k => Math.abs(k.time-headTime)<0.02)
    const kf = makeKeyframe(headTime, el)
    dispatch({ type:'UPDATE_ELEMENT', id:elId,
      patch:{ _keyframes: existing
        ? (el._keyframes||[]).map(k=>Math.abs(k.time-headTime)<0.02 ? kf : k)
        : [...(el._keyframes||[]), kf] }})
  }

  // ── Delete selected keyframe ──────────────────────────────
  function deleteSelKf() {
    if (!selKf) return
    const el = elements.find(x=>x.id===selKf.elId); if(!el) return
    dispatch({ type:'UPDATE_ELEMENT', id:selKf.elId,
      patch:{ _keyframes: (el._keyframes||[]).filter(k=>k.id!==selKf.kfId) }})
    setSelKf(null)
  }

  // ── Scroll sync ruler + tracks ─────────────────────────────
  function handleTracksScroll(e) { setScrollX(e.currentTarget.scrollLeft) }

  // ── Zoom ──────────────────────────────────────────────────
  function handleZoomWheel(e) {
    e.preventDefault()
    setPxPerSec(p => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, p - e.deltaY * 0.4)))
  }

  useEffect(() => {
    const el = tracksRef.current; if(!el) return
    el.addEventListener('wheel', handleZoomWheel, { passive:false })
    return () => el.removeEventListener('wheel', handleZoomWheel)
  }, [])

  const tracks    = elements.map(getElementTrack)
  const totalW    = duration * pxPerSec
  const headX     = headTime * pxPerSec - scrollX

  return (
    <div className="tl-panel">
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="tl-toolbar">
        <div className="tl-tb-left">
          {/* Playback controls */}
          <button className="tl-btn" onClick={() => { setHeadTime(0); pauseTimeRef.current=0 }} title="Go to start">⏮</button>
          <button className={`tl-btn play-btn ${playing?'active':''}`}
            onClick={() => dispatch({type:'SET_PLAYING', playing:!playing})}
            title={playing?'Pause':'Play'}>
            {playing ? '⏸' : '▶'}
          </button>
          <button className="tl-btn" onClick={() => { dispatch({type:'SET_PLAYING',playing:false}); setHeadTime(0); pauseTimeRef.current=0 }} title="Stop">⏹</button>

          <div className="tl-divider"/>

          {/* Time display */}
          <div className="tl-time-display">
            <span className="tl-time-cur">{formatTime(headTime,FPS)}</span>
            <span className="tl-time-sep">/</span>
            <span className="tl-time-dur">{formatTime(duration,FPS)}</span>
          </div>

          <div className="tl-divider"/>

          {/* Capture keyframe button */}
          {selected.length > 0 && (
            <button className="tl-btn accent" title="Add keyframe at current time (K)"
              onClick={() => selected.forEach(captureKeyframe)}>
              ◆ Add KF
            </button>
          )}

          {/* Delete keyframe */}
          {selKf && (
            <button className="tl-btn danger" title="Delete selected keyframe" onClick={deleteSelKf}>
              🗑 Del KF
            </button>
          )}
        </div>

        <div className="tl-tb-right">
          {/* Duration control */}
          <span className="tl-label">Duration:</span>
          <select className="tl-select" value={duration}
            onChange={e => setDuration(+e.target.value)}>
            {[2,4,6,8,10,15,20,30].map(v =>
              <option key={v} value={v}>{v}s</option>)}
          </select>

          {/* Zoom display */}
          <span className="tl-label">Zoom:</span>
          <button className="tl-btn small" onClick={() => setPxPerSec(p=>Math.max(MIN_ZOOM,p-20))}>−</button>
          <span className="tl-zoom-val">{pxPerSec}px/s</span>
          <button className="tl-btn small" onClick={() => setPxPerSec(p=>Math.min(MAX_ZOOM,p+20))}>+</button>
        </div>
      </div>

      {/* ── Main timeline area ──────────────────────────── */}
      <div className="tl-main">
        {/* Track labels (left column) */}
        <div className="tl-labels">
          <div className="tl-ruler-spacer"/>
          {tracks.map(track => (
            <div key={track.id}
              className={`tl-label-row ${selected.includes(track.id)?'sel':''}`}
              onClick={() => select([track.id])}>
              <span className="tl-label-dot" style={{ background: track.color }}/>
              <span className="tl-label-name">{track.label}</span>
              <span className="tl-kf-count">{track.keyframes.length}</span>
            </div>
          ))}
          {tracks.length === 0 && (
            <div className="tl-no-tracks">Add elements to see tracks</div>
          )}
        </div>

        {/* Scrollable tracks area */}
        <div className="tl-tracks-scroll" ref={tracksRef} onScroll={handleTracksScroll}>
          <div className="tl-tracks-inner" style={{ width: totalW + 80 }}>

            {/* Ruler */}
            <div ref={rulerRef} className="tl-ruler-wrap" onMouseDown={handleRulerDown}>
              <Ruler duration={duration} pxPerSec={pxPerSec} scrollX={0}/>
            </div>

            {/* Tracks */}
            {tracks.map(track => (
              <div key={track.id}
                className={`tl-track ${selected.includes(track.id)?'sel':''}`}
                style={{ height: TRACK_H }}
                onClick={e => handleTrackClick(e, track.id)}>

                {/* Track fill bar */}
                {track.keyframes.length >= 2 && (() => {
                  const sorted = [...track.keyframes].sort((a,b)=>a.time-b.time)
                  const x1 = sorted[0].time * pxPerSec
                  const x2 = sorted[sorted.length-1].time * pxPerSec
                  return (
                    <div className="tl-track-bar"
                      style={{ left:x1, width:x2-x1, background:`${track.color}22`,
                               borderLeft:`2px solid ${track.color}44`, borderRight:`2px solid ${track.color}44` }}/>
                  )
                })()}

                {/* Keyframe diamonds */}
                {track.keyframes.map(kf => (
                  <KfDiamond
                    key={kf.id}
                    kf={kf}
                    pxPerSec={pxPerSec}
                    scrollX={0}
                    selected={selKf?.kfId===kf.id}
                    onMouseDown={(e,k) => handleKfMouseDown(e, track.id, k)}
                    onDoubleClick={k => setEasingKf({ ...k, _elId:track.id })}
                  />
                ))}
              </div>
            ))}

          </div>

          {/* Playhead */}
          <div className="tl-playhead" style={{ left: headX }}>
            <div className="tl-ph-head"/>
            <div className="tl-ph-line"/>
          </div>
        </div>
      </div>

      {/* Easing picker popover */}
      {easingKf && (
        <EasingPicker
          kf={easingKf}
          onSelect={name => {
            const el = elements.find(x=>x.id===easingKf._elId); if(!el) return
            dispatch({ type:'UPDATE_ELEMENT', id:el.id,
              patch:{ _keyframes: (el._keyframes||[]).map(k=>k.id===easingKf.id ? {...k,easing:name}:k) }})
          }}
          onClose={() => setEasingKf(null)}
        />
      )}

      {/* Empty state hint */}
      {tracks.length === 0 && (
        <div className="tl-empty-hint">
          <span>🎬</span>
          <span>Add elements to canvas — tracks appear here automatically</span>
        </div>
      )}
    </div>
  )
}

