// PhysicsEngine.js
// Modular physics system — lightweight, browser-safe
// Uses requestAnimationFrame, no external dependencies

const SLEEP_THRESHOLD = 0.05
const MAX_VELOCITY    = 25
const STAGE_W = 900
const STAGE_H = 580

// ─── Core physics step ────────────────────────────────────────
export function stepPhysics(el, cursorX, cursorY, dt = 0.016) {
  if (!el.physics?.enabled) return null
  const p    = { ...el.physics }
  const mode = p.mode

  // Don't step sleeping elements
  if (p.sleeping && mode !== 'magnetic') return null

  let { vx, vy, x, y } = { ...p, x: el.x, y: el.y }
  let changed = false

  switch (mode) {
    case 'gravity':
      vy += p.gravity * p.mass * 60 * dt
      vy *= (1 - p.friction)
      vx *= (1 - p.friction)
      x  += vx
      y  += vy
      // Floor collision
      if (y + el.height >= STAGE_H) {
        y  = STAGE_H - el.height
        vy = -Math.abs(vy) * p.bounce
        vx *= 0.85
        if (Math.abs(vy) < SLEEP_THRESHOLD) { vy = 0; vx = 0; p.sleeping = true }
      }
      // Wall collisions
      if (x <= 0)                 { x = 0;               vx = Math.abs(vx) * p.bounce }
      if (x + el.width >= STAGE_W){ x = STAGE_W-el.width; vx = -Math.abs(vx)*p.bounce }
      changed = true
      break

    case 'float':
      // Ambient floating — sine wave
      p._floatT = (p._floatT || 0) + dt * (0.8 + p.mass * 0.3)
      const floatAmp = 12 + p.gravity * 8
      const floatX   = Math.sin(p._floatT * 0.7 + (p._seed||0)) * floatAmp * 0.4
      const floatY   = Math.sin(p._floatT + (p._seed||0)) * floatAmp
      x = (p.restX || el.x) + floatX
      y = (p.restY || el.y) + floatY
      changed = true
      break

    case 'spring': {
      const rx = p.restX !== undefined ? p.restX : el.x
      const ry = p.restY !== undefined ? p.restY : el.y
      const dx = rx - (el.x + vx)
      const dy = ry - (el.y + vy)
      vx = (vx + dx * p.stiffness) * p.damping
      vy = (vy + dy * p.stiffness) * p.damping
      // Wind
      if (p.wind) vx += p.wind * 0.02
      x = el.x + vx
      y = el.y + vy
      if (Math.abs(vx) < SLEEP_THRESHOLD && Math.abs(vy) < SLEEP_THRESHOLD) {
        x = rx; y = ry; vx = 0; vy = 0; p.sleeping = true
      }
      changed = true
      break
    }

    case 'magnetic': {
      if (cursorX === null || cursorY === null) break
      const cx = cursorX - el.x - el.width  / 2
      const cy = cursorY - el.y - el.height / 2
      const dist = Math.sqrt(cx*cx + cy*cy)
      const force = Math.min(p.magnetic * 120 / (dist + 1), 18)
      if (dist < 200) {
        vx = (vx + (cx / dist) * force) * p.damping
        vy = (vy + (cy / dist) * force) * p.damping
      } else {
        // Spring back to rest
        const rx = p.restX !== undefined ? p.restX : el.x
        const ry = p.restY !== undefined ? p.restY : el.y
        vx = (vx + (rx - el.x) * p.stiffness) * p.damping
        vy = (vy + (ry - el.y) * p.stiffness) * p.damping
      }
      vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, vx))
      vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, vy))
      x  = el.x + vx
      y  = el.y + vy
      changed = true
      break
    }

    case 'bounce': {
      // Pinball-style bouncing
      if (!p._bvx) { p._bvx = (Math.random()-0.5)*4+2; p._bvy = (Math.random()-0.5)*4-2 }
      p._bvx *= (1 - p.friction * 0.1)
      p._bvy += p.gravity * 0.15
      x = el.x + p._bvx
      y = el.y + p._bvy
      if (y + el.height >= STAGE_H) { y=STAGE_H-el.height; p._bvy=-Math.abs(p._bvy)*p.bounce }
      if (y <= 0)                   { y=0;                  p._bvy= Math.abs(p._bvy)*p.bounce }
      if (x <= 0)                   { x=0;                  p._bvx= Math.abs(p._bvx)*p.bounce }
      if (x + el.width >= STAGE_W)  { x=STAGE_W-el.width;  p._bvx=-Math.abs(p._bvx)*p.bounce }
      changed = true
      break
    }

    case 'wind': {
      p._windT = (p._windT || 0) + dt
      vx = Math.sin(p._windT * 1.2) * p.wind * 3 + p.wind * 2
      vy = Math.sin(p._windT * 0.8) * p.wind * 0.8
      x  = (p.restX || el.x) + vx * 8
      y  = (p.restY || el.y) + vy * 4
      changed = true
      break
    }

    case 'cloth': {
      // Fake cloth: oscillate with wind-like deformation on rotation
      p._clothT = (p._clothT || 0) + dt * 1.5
      const wave = Math.sin(p._clothT) * p.wind * 12
      const rot  = Math.sin(p._clothT * 0.7) * 8 * p.wind
      x = (p.restX || el.x) + wave
      // Return rotation via a special key
      p._rotDelta = rot
      changed = true
      break
    }

    default: break
  }

  if (!changed) return null

  return {
    vx: isNaN(vx) ? 0 : vx,
    vy: isNaN(vy) ? 0 : vy,
    _floatT:   p._floatT,
    _windT:    p._windT,
    _clothT:   p._clothT,
    _bvx:      p._bvx,
    _bvy:      p._bvy,
    _rotDelta: p._rotDelta,
    sleeping:  p.sleeping,
    restX:     p.restX !== undefined ? p.restX : el.x,
    restY:     p.restY !== undefined ? p.restY : el.y,
    _seed:     p._seed || Math.random() * Math.PI * 2,
  }
}

// ─── Multi-element collision pass ─────────────────────────────
export function resolveCollisions(elements) {
  const physics = elements.filter(e => e.physics?.enabled && e.physics?.mode === 'gravity')
  const updates = {}

  for (let i = 0; i < physics.length; i++) {
    for (let j = i+1; j < physics.length; j++) {
      const a = physics[i]
      const b = physics[j]
      const ax = a.x + a.width/2,  ay = a.y + a.height/2
      const bx = b.x + b.width/2,  by = b.y + b.height/2
      const dx = bx - ax, dy = by - ay
      const minDist = (a.width + b.width)/4 + (a.height + b.height)/4

      if (Math.sqrt(dx*dx+dy*dy) < minDist) {
        const nx = dx / (Math.sqrt(dx*dx+dy*dy) || 1)
        const ny = dy / (Math.sqrt(dx*dx+dy*dy) || 1)
        const relVx = (b.physics.vx||0) - (a.physics.vx||0)
        const relVy = (b.physics.vy||0) - (a.physics.vy||0)
        const imp = (relVx*nx + relVy*ny) * 0.7
        if (!updates[a.id]) updates[a.id] = {}
        if (!updates[b.id]) updates[b.id] = {}
        updates[a.id].vx = ((a.physics.vx||0) - imp*nx)
        updates[a.id].vy = ((a.physics.vy||0) - imp*ny)
        updates[b.id].vx = ((b.physics.vx||0) + imp*nx)
        updates[b.id].vy = ((b.physics.vy||0) + imp*ny)
      }
    }
  }
  return updates
}

// ─── Wake all physics elements ────────────────────────────────
export function wakeAll(elements) {
  return elements.map(e => e.physics?.enabled ? { ...e, physics: { ...e.physics, sleeping: false } } : e)
}

// ─── Init rest positions ──────────────────────────────────────
export function initRestPositions(elements) {
  return elements.map(e => ({
    ...e,
    physics: {
      ...e.physics,
      restX: e.x,
      restY: e.y,
      _seed: Math.random() * Math.PI * 2,
    }
  }))
}

// ─── Apply physics step to element position ───────────────────
export function applyPhysicsUpdate(el, physUpdate, posUpdate) {
  if (!physUpdate && !posUpdate) return el
  return {
    ...el,
    x: posUpdate?.x !== undefined ? posUpdate.x : el.x,
    y: posUpdate?.y !== undefined ? posUpdate.y : el.y,
    physics: physUpdate ? { ...el.physics, ...physUpdate } : el.physics,
  }
        }
        
