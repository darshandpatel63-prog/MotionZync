// Animation3DTypes.js
// Procedural animation behaviors for 3D objects + camera in MotionZync Studio3D.
// Each animation type implements: update(elapsed, dt, target) -> mutates target transform
//
// "target" is either a THREE.Mesh (for object anims) or a THREE.Camera (for camera anims).
// All anims are pure-data + step functions — no THREE.js import required at module load.

// ─── Easing (shared with Keyframe3DEngine, duplicated here to avoid cross-import coupling) ──
const EASE = {
  linear:    (t) => t,
  easeIn:    (t) => t * t,
  easeOut:   (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
}

// ─── Base class ──────────────────────────────────────────────────
export class Animation3D {
  constructor(opts = {}) {
    this.id = opts.id || `anim_${Date.now()}_${Math.floor(Math.random()*1000)}`
    this.type = 'base'
    this.targetId = opts.targetId ?? null // bodyId / meshId, or 'camera'
    this.enabled = opts.enabled !== false
    this.elapsed = 0
  }

  reset() { this.elapsed = 0 }

  // step(dt, mesh) — override in subclasses
  step(dt, mesh) {
    this.elapsed += dt
  }

  serialize() {
    return { ...this }
  }
}

// ════════════════════════════════════════════════════════════════
// ORBIT — object orbits around a center point
// ════════════════════════════════════════════════════════════════
export class OrbitAnimation extends Animation3D {
  constructor(opts = {}) {
    super(opts)
    this.type = 'orbit'
    this.center  = opts.center  ?? { x: 0, y: 0, z: 0 }
    this.radius  = opts.radius  ?? 3
    this.speed   = opts.speed   ?? 1     // radians per second
    this.axis    = opts.axis    ?? 'y'   // 'x' | 'y' | 'z'
    this.startAngle = opts.startAngle ?? 0
    this.tilt    = opts.tilt    ?? 0     // additional vertical bobbing
    this.faceCenter = opts.faceCenter ?? false // mesh always faces center
  }

  step(dt, mesh) {
    this.elapsed += dt
    const angle = this.startAngle + this.elapsed * this.speed
    const { x: cx, y: cy, z: cz } = this.center
    const r = this.radius

    let x = cx, y = cy, z = cz
    switch (this.axis) {
      case 'x':
        y = cy + Math.cos(angle) * r
        z = cz + Math.sin(angle) * r
        x = cx + Math.sin(this.elapsed * 0.5) * this.tilt
        break
      case 'z':
        x = cx + Math.cos(angle) * r
        y = cy + Math.sin(angle) * r
        z = cz + Math.sin(this.elapsed * 0.5) * this.tilt
        break
      default: // 'y'
        x = cx + Math.cos(angle) * r
        z = cz + Math.sin(angle) * r
        y = cy + Math.sin(this.elapsed * 0.5) * this.tilt
    }

    mesh.position.set(x, y, z)

    if (this.faceCenter) {
      mesh.lookAt(cx, cy, cz)
    }
  }
}

// ════════════════════════════════════════════════════════════════
// BOUNCE — physics-based vertical bounce with energy loss
// ════════════════════════════════════════════════════════════════
export class BounceAnimation extends Animation3D {
  constructor(opts = {}) {
    super(opts)
    this.type = 'bounce'
    this.groundY     = opts.groundY ?? 0
    this.height      = opts.height ?? 4       // initial drop/bounce height
    this.gravity     = opts.gravity ?? 9.81
    this.restitution = opts.restitution ?? 0.7 // energy retained per bounce (0-1)
    this.startX = opts.startX ?? 0
    this.startZ = opts.startZ ?? 0
    this.horizontalDrift = opts.horizontalDrift ?? 0 // units/sec sideways

    // internal sim state
    this._y  = (opts.startY ?? (this.groundY + this.height))
    this._vy = 0
    this._minBounceHeight = opts.minBounceHeight ?? 0.05
  }

  reset() {
    super.reset()
    this._y  = (this._startY ?? (this.groundY + this.height))
    this._vy = 0
  }

  step(dt, mesh) {
    this.elapsed += dt

    this._vy -= this.gravity * dt
    this._y  += this._vy * dt

    if (this._y <= this.groundY) {
      this._y = this.groundY
      this._vy = -this._vy * this.restitution
      // stop bouncing once it's negligible
      if (Math.abs(this._vy) < this._minBounceHeight) this._vy = 0
    }

    const x = this.startX + this.elapsed * this.horizontalDrift
    mesh.position.set(x, this._y, this.startZ)
  }
}

// ════════════════════════════════════════════════════════════════
// SPIN — continuous rotation around an axis
// ════════════════════════════════════════════════════════════════
export class SpinAnimation extends Animation3D {
  constructor(opts = {}) {
    super(opts)
    this.type = 'spin'
    this.axis  = opts.axis  ?? 'y'   // 'x' | 'y' | 'z'
    this.speed = opts.speed ?? 1     // radians per second
  }

  step(dt, mesh) {
    this.elapsed += dt
    mesh.rotation[this.axis] += this.speed * dt
  }
}

// ════════════════════════════════════════════════════════════════
// FLOAT — sine-wave vertical bobbing (idle/hover effect)
// ════════════════════════════════════════════════════════════════
export class FloatAnimation extends Animation3D {
  constructor(opts = {}) {
    super(opts)
    this.type = 'float'
    this.baseY    = opts.baseY    ?? 0
    this.amplitude= opts.amplitude?? 0.5
    this.speed    = opts.speed    ?? 1   // cycles relate to this multiplier
    this.baseX    = opts.baseX ?? null   // if provided, lock x/z
    this.baseZ    = opts.baseZ ?? null
    this.rotate   = opts.rotate ?? false // gentle rotation while floating
    this.rotateSpeed = opts.rotateSpeed ?? 0.3
  }

  step(dt, mesh) {
    this.elapsed += dt
    const y = this.baseY + Math.sin(this.elapsed * this.speed) * this.amplitude
    mesh.position.y = y
    if (this.baseX !== null) mesh.position.x = this.baseX
    if (this.baseZ !== null) mesh.position.z = this.baseZ

    if (this.rotate) {
      mesh.rotation.y += this.rotateSpeed * dt
    }
  }
}

// ════════════════════════════════════════════════════════════════
// PATH — follow a cubic bezier curve (looping or once)
// ════════════════════════════════════════════════════════════════
function bezierPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t
  return {
    x: a*p0.x + b*p1.x + c*p2.x + d*p3.x,
    y: a*p0.y + b*p1.y + c*p2.y + d*p3.y,
    z: a*p0.z + b*p1.z + c*p2.z + d*p3.z,
  }
}

export class PathAnimation extends Animation3D {
  constructor(opts = {}) {
    super(opts)
    this.type = 'path'
    // 4 control points for a cubic bezier
    this.p0 = opts.p0 ?? { x:-3, y:1, z:0 }
    this.p1 = opts.p1 ?? { x:-1, y:3, z:0 }
    this.p2 = opts.p2 ?? { x: 1, y:3, z:0 }
    this.p3 = opts.p3 ?? { x: 3, y:1, z:0 }
    this.duration = opts.duration ?? 4   // seconds for one full traverse
    this.loop     = opts.loop ?? true
    this.pingPong = opts.pingPong ?? false
    this.easing   = opts.easing ?? 'easeInOut'
    this.faceDirection = opts.faceDirection ?? false // orient mesh along tangent
  }

  step(dt, mesh) {
    this.elapsed += dt
    let cycle = this.elapsed / this.duration

    if (this.pingPong) {
      const phase = cycle % 2
      cycle = phase <= 1 ? phase : 2 - phase
    } else if (this.loop) {
      cycle = cycle % 1
    } else {
      cycle = Math.min(cycle, 1)
    }

    const ease = EASE[this.easing] || EASE.linear
    const t = ease(Math.max(0, Math.min(1, cycle)))

    const pos = bezierPoint(this.p0, this.p1, this.p2, this.p3, t)
    mesh.position.set(pos.x, pos.y, pos.z)

    if (this.faceDirection) {
      const ahead = bezierPoint(this.p0, this.p1, this.p2, this.p3, Math.min(1, t + 0.01))
      mesh.lookAt(ahead.x, ahead.y, ahead.z)
    }
  }
}

// ════════════════════════════════════════════════════════════════
// CAMERA FLY-THROUGH — camera moves through a sequence of waypoints
// ════════════════════════════════════════════════════════════════
export class CameraFlyThroughAnimation extends Animation3D {
  constructor(opts = {}) {
    super(opts)
    this.type = 'cameraFlyThrough'
    this.targetId = 'camera'
    // waypoints: [{ position:{x,y,z}, lookAt:{x,y,z}, time }]
    this.waypoints = opts.waypoints ?? [
      { position:{x:0, y:2,  z:10}, lookAt:{x:0,y:0,z:0}, time:0 },
      { position:{x:8, y:4,  z:8 }, lookAt:{x:0,y:0,z:0}, time:2 },
      { position:{x:8, y:6,  z:-4}, lookAt:{x:0,y:0,z:0}, time:4 },
      { position:{x:0, y:10, z:-8}, lookAt:{x:0,y:0,z:0}, time:6 },
    ]
    this.loop   = opts.loop ?? true
    this.easing = opts.easing ?? 'easeInOut'
  }

  get duration() {
    if (this.waypoints.length === 0) return 1
    return this.waypoints[this.waypoints.length - 1].time
  }

  // step(dt, camera) — also needs orbitControls to update target, passed via 3rd arg
  step(dt, camera, orbitControls) {
    this.elapsed += dt
    let t = this.elapsed

    if (this.loop) {
      t = t % this.duration
    } else {
      t = Math.min(t, this.duration)
    }

    // find surrounding waypoints
    const wps = this.waypoints
    if (wps.length === 0) return

    if (wps.length === 1 || t <= wps[0].time) {
      this._applyWaypoint(wps[0], camera, orbitControls)
      return
    }
    if (t >= wps[wps.length - 1].time) {
      this._applyWaypoint(wps[wps.length - 1], camera, orbitControls)
      return
    }

    for (let i = 0; i < wps.length - 1; i++) {
      const a = wps[i], b = wps[i+1]
      if (t >= a.time && t <= b.time) {
        const span = b.time - a.time
        const raw = span > 0 ? (t - a.time) / span : 0
        const ease = EASE[this.easing] || EASE.linear
        const f = ease(raw)

        const pos = {
          x: a.position.x + (b.position.x - a.position.x) * f,
          y: a.position.y + (b.position.y - a.position.y) * f,
          z: a.position.z + (b.position.z - a.position.z) * f,
        }
        const look = {
          x: a.lookAt.x + (b.lookAt.x - a.lookAt.x) * f,
          y: a.lookAt.y + (b.lookAt.y - a.lookAt.y) * f,
          z: a.lookAt.z + (b.lookAt.z - a.lookAt.z) * f,
        }

        camera.position.set(pos.x, pos.y, pos.z)
        camera.lookAt(look.x, look.y, look.z)
        if (orbitControls) {
          orbitControls.target.set(look.x, look.y, look.z)
        }
        return
      }
    }
  }

  _applyWaypoint(wp, camera, orbitControls) {
    camera.position.set(wp.position.x, wp.position.y, wp.position.z)
    camera.lookAt(wp.lookAt.x, wp.lookAt.y, wp.lookAt.z)
    if (orbitControls) orbitControls.target.set(wp.lookAt.x, wp.lookAt.y, wp.lookAt.z)
  }
}

// ════════════════════════════════════════════════════════════════
// CONTROLLER — manages active animations and steps them each frame
// ════════════════════════════════════════════════════════════════
export const ANIMATION_TYPES = {
  orbit:  OrbitAnimation,
  bounce: BounceAnimation,
  spin:   SpinAnimation,
  float:  FloatAnimation,
  path:   PathAnimation,
  cameraFlyThrough: CameraFlyThroughAnimation,
}

export class Animation3DController {
  constructor() {
    this.animations = new Map() // id -> Animation3D instance
  }

  add(animation) {
    this.animations.set(animation.id, animation)
    return animation
  }

  create(type, opts = {}) {
    const Cls = ANIMATION_TYPES[type]
    if (!Cls) throw new Error(`Unknown animation type: ${type}`)
    const anim = new Cls(opts)
    this.add(anim)
    return anim
  }

  remove(id) {
    this.animations.delete(id)
  }

  removeForTarget(targetId) {
    for (const [id, anim] of this.animations.entries()) {
      if (anim.targetId === targetId) this.animations.delete(id)
    }
  }

  get(id) {
    return this.animations.get(id)
  }

  getForTarget(targetId) {
    return Array.from(this.animations.values()).filter(a => a.targetId === targetId)
  }

  clear() {
    this.animations.clear()
  }

  resetAll() {
    for (const a of this.animations.values()) a.reset()
  }

  // ── Step all enabled animations ──
  // meshMap: { [bodyId]: THREE.Mesh }, camera + orbitControls for camera anims
  step(dt, meshMap, camera, orbitControls) {
    for (const anim of this.animations.values()) {
      if (!anim.enabled) continue

      if (anim.type === 'cameraFlyThrough') {
        if (camera) anim.step(dt, camera, orbitControls)
        continue
      }

      const mesh = meshMap[anim.targetId]
      if (!mesh) continue
      anim.step(dt, mesh)
    }
  }

  serialize() {
    return Array.from(this.animations.values()).map(a => ({ type: a.type, ...a }))
  }

  static deserialize(data = []) {
    const controller = new Animation3DController()
    for (const entry of data) {
      const { type, ...opts } = entry
      try {
        controller.create(type, opts)
      } catch { /* skip unknown types */ }
    }
    return controller
  }
}
