// ParticleCanvas.jsx — NEW (Feature 9)
// Transparent canvas overlay on top of stage
// Renders one ParticleSystem per element that has particles enabled
// Uses requestAnimationFrame — CPU-friendly, no WebGL

import { useEffect, useRef } from 'react'
import { ParticleSystem } from '../engine/ParticleEngine.js'

const STAGE_W = 900
const STAGE_H = 580

export default function ParticleCanvas({ elements }) {
  const cvRef     = useRef(null)
  const systemsRef= useRef({})   // elId → ParticleSystem
  const rafRef    = useRef(null)
  const lastRef   = useRef(performance.now())

  // ── Sync particle systems with elements ─────────────────
  useEffect(() => {
    const existing = systemsRef.current
    const next     = {}

    elements.forEach(el => {
      if (!el.particles?.enabled || el.visible === false) return

      const preset    = el.particles.preset || 'stars'
      const emitX     = el.x + el.width  / 2
      const emitY     = el.y + el.height / 2
      const overrides = {
        count:         el.particles.count,
        speed:         el.particles.speed,
        size:          el.particles.size,
        gravity:       el.particles.gravity,
        opacity:       el.particles.opacity,
        life:          el.particles.life,
        colorOverride: el.particles.colorOverride || null,
      }
      // Key includes overrides so system recreates when they change
      const overKey = JSON.stringify(overrides)

      if (existing[el.id]
          && existing[el.id].presetName === preset
          && existing[el.id]._overKey   === overKey) {
        existing[el.id].emitterX = emitX
        existing[el.id].emitterY = emitY
        next[el.id] = existing[el.id]
      } else {
        const sys = new ParticleSystem(preset, emitX, emitY, STAGE_W, STAGE_H, overrides)
        sys._overKey = overKey
        next[el.id]  = sys
      }
    })

    systemsRef.current = next
  }, [elements])

  // ── Render loop ──────────────────────────────────────────
  useEffect(() => {
    const cv  = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    cv.width  = STAGE_W
    cv.height = STAGE_H

    function loop(now) {
      const dt  = Math.min((now - lastRef.current) / 1000, 0.05)
      lastRef.current = now

      const systems = systemsRef.current
      const hasAny  = Object.keys(systems).length > 0

      ctx.clearRect(0, 0, STAGE_W, STAGE_H)

      if (hasAny) {
        Object.values(systems).forEach(sys => {
          sys.update(dt)
          sys.draw(ctx)
        })
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Only render canvas if any element has particles
  const hasParticles = elements.some(e => e.particles?.enabled && e.visible !== false)
  if (!hasParticles) return null

  return (
    <canvas
      ref={cvRef}
      style={{
        position:      'absolute',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        50,
        width:         STAGE_W,
        height:        STAGE_H,
      }}
    />
  )
}

