// FPSMonitor.jsx — NEW
// Live FPS counter — only shown in Pro mode
// Uses requestAnimationFrame delta timing — CPU-only, zero canvas overhead

import { useEffect, useRef, useState } from 'react'
import './FPSMonitor.css'

const SAMPLE_SIZE = 30   // rolling average over last 30 frames
const HISTORY_LEN = 60   // sparkline history points

export default function FPSMonitor() {
  const [fps,     setFps]     = useState(60)
  const [history, setHistory] = useState(Array(HISTORY_LEN).fill(60))
  const [grade,   setGrade]   = useState('good')   // good | ok | bad
  const samplesRef = useRef([])
  const lastRef    = useRef(performance.now())
  const rafRef     = useRef(null)

  useEffect(() => {
    function loop(now) {
      const dt = now - lastRef.current
      lastRef.current = now
      if (dt > 0 && dt < 500) {
        const current = 1000 / dt
        const s = samplesRef.current
        s.push(current)
        if (s.length > SAMPLE_SIZE) s.shift()
        const avg = Math.round(s.reduce((a,b)=>a+b,0) / s.length)
        setFps(avg)
        setHistory(h => { const n=[...h,avg]; return n.length>HISTORY_LEN?n.slice(-HISTORY_LEN):n })
        setGrade(avg >= 55 ? 'good' : avg >= 40 ? 'ok' : 'bad')
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Sparkline path
  const W = 60, H = 22
  const max = Math.max(...history, 65)
  const pts = history.map((v,i) => {
    const x = (i/(HISTORY_LEN-1))*W
    const y = H - (v/max)*H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const color = grade==='good' ? '#34d399' : grade==='ok' ? '#fbbf24' : '#f87171'

  return (
    <div className={`fps-monitor fps-${grade}`} title="FPS Monitor (Pro Mode)">
      {/* Sparkline */}
      <svg className="fps-spark" width={W} height={H}>
        <polyline points={pts} stroke={color} strokeWidth="1.4"
          fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
        {/* Current dot */}
        {history.length > 0 && (() => {
          const last = history[history.length-1]
          const lx   = W
          const ly   = H - (last/max)*H
          return <circle cx={lx} cy={ly} r="2" fill={color}/>
        })()}
      </svg>

      {/* Value */}
      <div className="fps-value" style={{ color }}>
        {fps}
        <span className="fps-unit">fps</span>
      </div>

      {/* Grade dot */}
      <div className="fps-dot" style={{ background: color }}/>
    </div>
  )
}

