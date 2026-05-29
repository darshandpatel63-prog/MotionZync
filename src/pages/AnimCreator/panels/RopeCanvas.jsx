// RopeCanvas.jsx — NEW (Feature 10)
// SVG overlay that draws rope/chain simulations between linked elements
// Uses Verlet integration via CollisionEngine.stepRope

import { useEffect, useRef, useState } from 'react'
import { makeRope, stepRope } from '../engine/CollisionEngine.js'

const STAGE_W = 900
const STAGE_H = 580

export default function RopeCanvas({ elements, ropes, onUpdateRopes }) {
  const rafRef  = useRef(null)
  const lastRef = useRef(performance.now())
  const ropesRef= useRef(ropes)
  const elsRef  = useRef(elements)

  useEffect(() => { ropesRef.current = ropes },    [ropes])
  useEffect(() => { elsRef.current   = elements },  [elements])

  const [paths, setPaths] = useState([])

  useEffect(() => {
    function loop(now) {
      const dt    = Math.min((now - lastRef.current) / 1000, 0.05)
      lastRef.current = now

      const currentRopes = ropesRef.current
      const currentEls   = elsRef.current
      if (!currentRopes?.length) { rafRef.current = requestAnimationFrame(loop); return }

      const newRopes = currentRopes.map(rope => {
        const anchorEl = currentEls.find(e => e.id === rope.anchorElId)
        const tailEl   = currentEls.find(e => e.id === rope.tailElId)
        if (!anchorEl) return rope
        return stepRope(rope, anchorEl, tailEl, dt)
      })

      // Build SVG path strings
      const newPaths = newRopes.map(rope => {
        if (!rope.points?.length) return null
        const pts = rope.points
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
        for (let i = 1; i < pts.length; i++) {
          // Smooth catmull-rom-like
          if (i < pts.length - 1) {
            const cx = (pts[i].x + pts[i+1 < pts.length ? i+1 : i].x) / 2
            const cy = (pts[i].y + pts[i+1 < pts.length ? i+1 : i].y) / 2
            d += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)}`
          } else {
            d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`
          }
        }
        return { id:rope.id, d, color:rope.color||'#7c3aed', width:rope.width||2, points:pts }
      }).filter(Boolean)

      setPaths(newPaths)
      if (onUpdateRopes) onUpdateRopes(newRopes)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onUpdateRopes])

  if (!ropes?.length && !paths.length) return null

  return (
    <svg
      style={{
        position:      'absolute', inset: 0,
        width:         STAGE_W,   height: STAGE_H,
        pointerEvents: 'none',    zIndex: 45,
        overflow:      'visible',
      }}
    >
      {paths.map(p => (
        <g key={p.id}>
          {/* Shadow stroke */}
          <path d={p.d} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth={p.width+2} strokeLinecap="round" strokeLinejoin="round"/>
          {/* Main rope */}
          <path d={p.d} fill="none" stroke={p.color} strokeWidth={p.width} strokeLinecap="round" strokeLinejoin="round"
            style={{ filter:`drop-shadow(0 0 3px ${p.color})` }}/>
          {/* Segment dots (chain look) */}
          {p.points.filter((_,i)=>i%2===0).map((pt,i)=>(
            <circle key={i} cx={pt.x} cy={pt.y} r={p.width*0.7}
              fill={p.color} opacity={0.6}/>
          ))}
        </g>
      ))}
    </svg>
  )
}

