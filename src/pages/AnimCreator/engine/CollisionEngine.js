// CollisionEngine.js — NEW (Feature 10)
// Object-to-object AABB + circle collision resolution
// Rope / chain constraint simulation (Verlet integration)
// CPU-friendly — runs alongside existing PhysicsEngine

const STAGE_W = 900
const STAGE_H = 580

// ─── AABB rect overlap test ───────────────────────────────────
function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width  &&
    a.x + a.width  > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

// ─── MTV (minimum translation vector) for AABB ───────────────
function getMTV(a, b) {
  const ax = a.x + a.width  / 2, ay = a.y + a.height / 2
  const bx = b.x + b.width  / 2, by = b.y + b.height / 2
  const overlapX = (a.width  + b.width)  / 2 - Math.abs(ax - bx)
  const overlapY = (a.height + b.height) / 2 - Math.abs(ay - by)
  if (overlapX < overlapY) return { nx: ax < bx ? -1 : 1, ny: 0,               depth: overlapX }
  return                           { nx: 0,               ny: ay < by ? -1 : 1, depth: overlapY }
}

// ─── Resolve element-to-element collisions ────────────────────
// Returns map of { elId: { x, y, vx, vy } } position + velocity patches
export function resolveElementCollisions(elements) {
  const patches = {}

  // Only elements with collision enabled
  const collidables = elements.filter(e =>
    e.collision?.enabled && e.visible !== false && !e.locked
  )
  if (collidables.length < 2) return patches

  for (let i = 0; i < collidables.length; i++) {
    for (let j = i + 1; j < collidables.length; j++) {
      const a = { ...collidables[i], ...patches[collidables[i].id] }
      const b = { ...collidables[j], ...patches[collidables[j].id] }

      if (!rectsOverlap(a, b)) continue

      const mtv = getMTV(a, b)
      const { nx, ny, depth } = mtv

      // Mass ratio (use physics.mass if available, else 1)
      const ma = a.physics?.mass || 1
      const mb = b.physics?.mass || 1
      const total = ma + mb
      const ratioA = mb / total
      const ratioB = ma / total

      // Push apart
      const push = depth * 0.55  // slight overdrive to prevent sticking
      const axNew = (patches[a.id]?.x ?? a.x) - nx * push * ratioA
      const ayNew = (patches[a.id]?.y ?? a.y) - ny * push * ratioA
      const bxNew = (patches[b.id]?.x ?? b.x) + nx * push * ratioB
      const byNew = (patches[b.id]?.y ?? b.y) + ny * push * ratioB

      // Velocity exchange (elastic-ish)
      const avx = a.physics?.vx || 0, avy = a.physics?.vy || 0
      const bvx = b.physics?.vx || 0, bvy = b.physics?.vy || 0
      const restitution = Math.min(
        a.physics?.bounce ?? 0.6,
        b.physics?.bounce ?? 0.6
      )

      const relV  = (bvx - avx) * nx + (bvy - avy) * ny
      if (relV < 0) {
        const imp   = -(1 + restitution) * relV / total
        const iax   = -imp * mb * nx,  iay = -imp * mb * ny
        const ibx   =  imp * ma * nx,  iby =  imp * ma * ny

        patches[a.id] = { x:axNew, y:ayNew, vx:(avx+iax)*0.98, vy:(avy+iay)*0.98 }
        patches[b.id] = { x:bxNew, y:byNew, vx:(bvx+ibx)*0.98, vy:(bvy+iby)*0.98 }
      } else {
        patches[a.id] = { ...(patches[a.id]||{}), x:axNew, y:ayNew }
        patches[b.id] = { ...(patches[b.id]||{}), x:bxNew, y:byNew }
      }

      // Stage boundaries
      if (patches[a.id]) {
        patches[a.id].x = Math.max(0, Math.min(STAGE_W - a.width,  patches[a.id].x))
        patches[a.id].y = Math.max(0, Math.min(STAGE_H - a.height, patches[a.id].y))
      }
      if (patches[b.id]) {
        patches[b.id].x = Math.max(0, Math.min(STAGE_W - b.width,  patches[b.id].x))
        patches[b.id].y = Math.max(0, Math.min(STAGE_H - b.height, patches[b.id].y))
      }
    }
  }

  return patches
}

// ═══════════════════════════════════════════════════════════════
// ROPE / CHAIN SYSTEM
// ═══════════════════════════════════════════════════════════════
// Each rope: { id, anchorElId, tailElId, segments, points[], config }

const GRAVITY = 0.25
const DAMPING = 0.98
const ITERS   = 8    // constraint solver iterations

// ─── Make a new rope ─────────────────────────────────────────
export function makeRope(id, anchorEl, tailEl, config = {}) {
  const ax = anchorEl.x + anchorEl.width  / 2
  const ay = anchorEl.y + anchorEl.height / 2
  const tx = tailEl.x   + tailEl.width    / 2
  const ty = tailEl.y   + tailEl.height   / 2

  const segments = config.segments || 10
  const points   = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    points.push({
      x:   ax + (tx - ax) * t,
      y:   ay + (ty - ay) * t,
      px:  ax + (tx - ax) * t,  // previous position (Verlet)
      py:  ay + (ty - ay) * t,
      pinned: i === 0,           // anchor end is pinned
    })
  }

  const restLen = Math.hypot(tx - ax, ty - ay) / segments

  return {
    id,
    anchorElId: anchorEl.id,
    tailElId:   tailEl.id,
    segments,
    points,
    restLen: config.segmentLength || restLen,
    color:   config.color   || '#7c3aed',
    width:   config.width   || 2,
    stiff:   config.stiff   || 0.9,
  }
}

// ─── Step a rope simulation ───────────────────────────────────
export function stepRope(rope, anchorEl, tailEl, dt) {
  const pts = rope.points
  if (!pts || pts.length < 2) return rope

  // Update anchor pin to follow anchor element
  pts[0].x = anchorEl.x + anchorEl.width  / 2
  pts[0].y = anchorEl.y + anchorEl.height / 2

  // Update tail pin to follow tail element (if both ends pinned)
  if (tailEl) {
    const last = pts[pts.length - 1]
    last.x  = tailEl.x + tailEl.width  / 2
    last.y  = tailEl.y + tailEl.height / 2
    last.pinned = true
  }

  // Verlet integration — update free points
  for (let i = 1; i < pts.length - 1; i++) {
    const p   = pts[i]
    const vx  = (p.x - p.px) * DAMPING
    const vy  = (p.y - p.py) * DAMPING
    p.px = p.x
    p.py = p.y
    p.x += vx
    p.y += vy + GRAVITY * dt * 60
  }

  // Constraint relaxation iterations
  for (let iter = 0; iter < ITERS; iter++) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1]
      const dx   = b.x - a.x, dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 0.001
      const diff = (dist - rope.restLen) / dist * 0.5 * rope.stiff

      if (!a.pinned) { a.x += dx * diff; a.y += dy * diff }
      if (!b.pinned) { b.x -= dx * diff; b.y -= dy * diff }
    }
  }

  return { ...rope, points: pts }
}

// ─── Default collision config ─────────────────────────────────
export function makeCollisionConfig() {
  return { enabled: false, restitution: 0.6, mass: 1 }
}

