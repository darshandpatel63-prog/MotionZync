// Physics3DEngine.js
// UE5-inspired browser physics engine (no external deps)
// Features: Rigid Body, Soft Body, Cloth, Constraints, Forces, Materials

const GRAVITY_DEFAULT = { x: 0, y: -9.81, z: 0 }
const SUBSTEPS         = 8
const SLEEP_THRESHOLD  = 0.02
const MAX_VELOCITY     = 50

// ─── Utility ─────────────────────────────────────────────────
const vec3 = (x=0,y=0,z=0) => ({x,y,z})
const v3add = (a,b) => ({x:a.x+b.x, y:a.y+b.y, z:a.z+b.z})
const v3sub = (a,b) => ({x:a.x-b.x, y:a.y-b.y, z:a.z-b.z})
const v3mul = (v,s) => ({x:v.x*s, y:v.y*s, z:v.z*s})
const v3dot = (a,b) => a.x*b.x + a.y*b.y + a.z*b.z
const v3len = (v)   => Math.sqrt(v3dot(v,v))
const v3norm = (v)  => { const l=v3len(v)||1; return v3mul(v,1/l) }
const v3cross = (a,b) => ({
  x: a.y*b.z - a.z*b.y,
  y: a.z*b.x - a.x*b.z,
  z: a.x*b.y - a.y*b.x
})
const v3clone = (v) => ({...v})
const v3zero  = ()  => ({x:0,y:0,z:0})

let _bodyId = 0

// ─── Physics Material (like UE5 Physical Material) ────────────
export class PhysicsMaterial {
  constructor(opts = {}) {
    this.restitution   = opts.restitution   ?? 0.3   // bounce 0-1
    this.friction      = opts.friction      ?? 0.5   // 0=ice,1=rubber
    this.density       = opts.density       ?? 1.0   // kg/m³ factor
    this.linearDamp    = opts.linearDamp    ?? 0.01  // air resistance
    this.angularDamp   = opts.angularDamp   ?? 0.05
  }
}

// ─── Collision Shapes ─────────────────────────────────────────
export class BoxShape {
  constructor(hx=0.5, hy=0.5, hz=0.5) {
    this.type = 'box'
    this.halfExtents = {x:hx, y:hy, z:hz}
  }
}
export class SphereShape {
  constructor(radius=0.5) {
    this.type   = 'sphere'
    this.radius = radius
  }
}
export class CapsuleShape {
  constructor(radius=0.3, height=1) {
    this.type   = 'capsule'
    this.radius = radius
    this.height = height
  }
}
export class PlaneShape {
  constructor(normal={x:0,y:1,z:0}) {
    this.type   = 'plane'
    this.normal = v3norm(normal)
  }
}

// ─── Rigid Body (main physics object) ────────────────────────
export class RigidBody {
  constructor(opts = {}) {
    this.id   = `rb_${_bodyId++}`
    this.name = opts.name ?? `Body_${this.id}`

    // Transform
    this.position = opts.position ? v3clone(opts.position) : v3zero()
    this.rotation = opts.rotation ? v3clone(opts.rotation) : v3zero()
    this.scale    = opts.scale    ? v3clone(opts.scale)    : vec3(1,1,1)

    // Physics properties (UE5 Details panel equivalent)
    this.mass            = opts.mass            ?? 1.0
    this.gravityScale    = opts.gravityScale    ?? 1.0
    this.linearDamping   = opts.linearDamping   ?? 0.01
    this.angularDamping  = opts.angularDamping  ?? 0.05
    this.restitution     = opts.restitution     ?? 0.3
    this.friction        = opts.friction        ?? 0.5

    // Lock axes (like UE5 constraints)
    this.lockPosX = opts.lockPosX ?? false
    this.lockPosY = opts.lockPosY ?? false
    this.lockPosZ = opts.lockPosZ ?? false
    this.lockRotX = opts.lockRotX ?? false
    this.lockRotY = opts.lockRotY ?? false
    this.lockRotZ = opts.lockRotZ ?? false

    // CCD (Continuous Collision Detection)
    this.enableCCD = opts.enableCCD ?? false
    this.isStatic  = opts.isStatic  ?? false
    this.isTrigger = opts.isTrigger ?? false

    // Internal velocity state
    this.velocity        = v3zero()
    this.angularVelocity = v3zero()
    this.force           = v3zero()
    this.torque          = v3zero()

    // Sleep system
    this.sleeping        = false
    this._sleepTimer     = 0

    // Collision shape
    this.shape    = opts.shape ?? new BoxShape()
    this.material = opts.material ?? new PhysicsMaterial()

    // Previous position (for CCD)
    this._prevPosition = v3clone(this.position)

    // Inertia tensor (simplified: scalar)
    this._invMass = this.isStatic ? 0 : (1 / Math.max(this.mass, 0.001))

    // Callbacks
    this.onCollide  = opts.onCollide  ?? null
    this.onSleep    = opts.onSleep    ?? null
    this.onWake     = opts.onWake     ?? null
    this.userData   = opts.userData   ?? {}
  }

  // Apply a force at body center (world space)
  applyForce(force) {
    this.force = v3add(this.force, force)
    this.wake()
  }

  // Apply instantaneous impulse
  applyImpulse(impulse) {
    if (this.isStatic) return
    this.velocity = v3add(this.velocity, v3mul(impulse, this._invMass))
    this.wake()
  }

  // Apply torque
  applyTorque(torque) {
    this.torque = v3add(this.torque, torque)
    this.wake()
  }

  // Wake from sleep
  wake() {
    if (this.sleeping) {
      this.sleeping   = false
      this._sleepTimer = 0
      this.onWake?.()
    }
  }

  // Reset accumulated forces
  clearForces() {
    this.force  = v3zero()
    this.torque = v3zero()
  }

  // Sync data to Three.js object
  syncToObject3D(obj3d) {
    if (!obj3d) return
    obj3d.position.set(this.position.x, this.position.y, this.position.z)
    obj3d.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
  }
}

// ─── Constraints ──────────────────────────────────────────────
export class HingeConstraint {
  constructor(bodyA, bodyB, opts = {}) {
    this.type   = 'hinge'
    this.bodyA  = bodyA
    this.bodyB  = bodyB
    this.pivot  = opts.pivot  ?? v3zero()
    this.axis   = opts.axis   ?? vec3(0,1,0)
    this.minAngle = opts.minAngle ?? -Math.PI
    this.maxAngle = opts.maxAngle ??  Math.PI
  }
}

export class BallSocketConstraint {
  constructor(bodyA, bodyB, opts = {}) {
    this.type  = 'ball'
    this.bodyA = bodyA
    this.bodyB = bodyB
    this.pivot = opts.pivot ?? v3zero()
  }
}

export class SpringConstraint {
  constructor(bodyA, bodyB, opts = {}) {
    this.type        = 'spring'
    this.bodyA       = bodyA
    this.bodyB       = bodyB
    this.restLength  = opts.restLength  ?? 1.0
    this.stiffness   = opts.stiffness   ?? 100
    this.damping     = opts.damping     ?? 0.5
  }
}

// ─── Wind Force Field ─────────────────────────────────────────
export class WindField {
  constructor(opts = {}) {
    this.direction = opts.direction ?? vec3(1,0,0)
    this.strength  = opts.strength  ?? 5
    this.turbulence= opts.turbulence?? 0.3
    this._t        = 0
  }
  getForceAt(pos, dt) {
    this._t += dt
    const noise = (Math.sin(this._t*2.1+pos.x) + Math.cos(this._t*1.7+pos.z)) * 0.5
    const f = this.strength + noise * this.turbulence * this.strength
    return v3mul(v3norm(this.direction), f)
  }
}

// ─── Explosion Force ──────────────────────────────────────────
export class ExplosionForce {
  constructor(opts = {}) {
    this.position = opts.position ?? v3zero()
    this.radius   = opts.radius   ?? 5
    this.force    = opts.force    ?? 500
    this.upward   = opts.upward   ?? 0.5
    this.applied  = false
  }
  applyTo(bodies) {
    if (this.applied) return
    this.applied = true
    for (const body of bodies) {
      if (body.isStatic) continue
      const diff = v3sub(body.position, this.position)
      const dist = v3len(diff)
      if (dist > this.radius) continue
      const falloff = 1 - (dist / this.radius)
      const dir = dist < 0.01 ? vec3(0,1,0) : v3norm(diff)
      const upDir = v3add(dir, vec3(0, this.upward, 0))
      body.applyImpulse(v3mul(v3norm(upDir), this.force * falloff))
    }
  }
}

// ─── Cloth Simulation (Spring-Mass System) ────────────────────
export class ClothBody {
  constructor(opts = {}) {
    this.type     = 'cloth'
    this.id       = `cloth_${_bodyId++}`
    this.rows     = opts.rows    ?? 10
    this.cols     = opts.cols    ?? 10
    this.spacing  = opts.spacing ?? 0.2
    this.mass     = opts.mass    ?? 0.1
    this.stiffness= opts.stiffness?? 200
    this.gravity  = opts.gravity ?? -9.81
    this.pinned   = opts.pinned  ?? [[0,0],[0,9]] // top corners pinned

    // Initialize particles
    this.particles = []
    this.springs   = []

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const isPinned = this.pinned.some(([pr,pc]) => pr===r && pc===c)
        this.particles.push({
          pos:    vec3(c * this.spacing, -r * this.spacing, 0),
          vel:    v3zero(),
          force:  v3zero(),
          pinned: isPinned,
          mass:   this.mass,
        })
      }
    }

    // Structural springs
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const i = r * this.cols + c
        if (c+1 < this.cols) this._addSpring(i, r*this.cols+(c+1), this.spacing)   // right
        if (r+1 < this.rows) this._addSpring(i, (r+1)*this.cols+c, this.spacing)   // down
        // Shear springs
        if (r+1<this.rows && c+1<this.cols) this._addSpring(i, (r+1)*this.cols+(c+1), this.spacing*Math.SQRT2)
        if (r+1<this.rows && c-1>=0) this._addSpring(i, (r+1)*this.cols+(c-1), this.spacing*Math.SQRT2)
        // Bend springs
        if (c+2<this.cols) this._addSpring(i, r*this.cols+(c+2), this.spacing*2)
        if (r+2<this.rows) this._addSpring(i, (r+2)*this.cols+c, this.spacing*2)
      }
    }
  }

  _addSpring(a, b, rest) {
    this.springs.push({ a, b, rest, stiffness: this.stiffness, damping: 0.1 })
  }

  step(dt) {
    // Reset forces
    for (const p of this.particles) { p.force = vec3(0, this.gravity * p.mass, 0) }

    // Spring forces
    for (const s of this.springs) {
      const pa = this.particles[s.a]
      const pb = this.particles[s.b]
      const diff = v3sub(pb.pos, pa.pos)
      const dist = v3len(diff) || 0.0001
      const ext  = dist - s.rest
      const dir  = v3mul(diff, 1/dist)
      const relV = v3sub(pb.vel, pa.vel)
      const dampF= v3dot(relV, dir) * s.damping
      const f    = v3mul(dir, s.stiffness * ext + dampF)
      if (!pa.pinned) pa.force = v3add(pa.force, f)
      if (!pb.pinned) pb.force = v3sub(pb.force, f)
    }

    // Integrate
    for (const p of this.particles) {
      if (p.pinned) continue
      const acc = v3mul(p.force, 1/p.mass)
      p.vel = v3add(p.vel, v3mul(acc, dt))
      p.vel = v3mul(p.vel, 0.99) // damping
      p.pos = v3add(p.pos, v3mul(p.vel, dt))
      // Floor collision
      if (p.pos.y < 0) { p.pos.y = 0; p.vel.y = -p.vel.y * 0.3 }
    }
  }
}

// ─── Main Physics World ───────────────────────────────────────
export class Physics3DWorld {
  constructor(opts = {}) {
    this.gravity     = opts.gravity     ?? v3clone(GRAVITY_DEFAULT)
    this.substeps    = opts.substeps    ?? SUBSTEPS
    this.bodies      = []
    this.clothBodies = []
    this.constraints = []
    this.forceFields = []
    this.explosions  = []
    this._time       = 0
    this._running    = false
    this._rafId      = null
    this.onStep      = opts.onStep ?? null   // callback after each step
    this._lastTime   = null
  }

  // ── Body management ─────────────────────────────────────────
  addBody(body) {
    this.bodies.push(body)
    return body
  }

  removeBody(body) {
    this.bodies = this.bodies.filter(b => b !== body)
  }

  addCloth(cloth) {
    this.clothBodies.push(cloth)
    return cloth
  }

  addConstraint(c) {
    this.constraints.push(c)
    return c
  }

  addForceField(f) {
    this.forceFields.push(f)
    return f
  }

  explode(opts) {
    const exp = new ExplosionForce(opts)
    exp.applyTo(this.bodies)
    return exp
  }

  // ── Simulation step ─────────────────────────────────────────
  step(totalDt) {
    const dt = totalDt / this.substeps
    for (let i = 0; i < this.substeps; i++) {
      this._substep(dt)
    }
    for (const cloth of this.clothBodies) cloth.step(totalDt)
    this._time += totalDt
    this.onStep?.(this._time)
  }

  _substep(dt) {
    for (const body of this.bodies) {
      if (body.isStatic || body.sleeping) continue

      // Gravity
      body.force = v3add(body.force, v3mul(this.gravity, body.mass * body.gravityScale))

      // Force fields (wind, etc.)
      for (const field of this.forceFields) {
        if (field instanceof WindField) {
          body.applyForce(field.getForceAt(body.position, dt))
        }
      }

      // Integrate linear
      const linAcc = v3mul(body.force, body._invMass)
      body.velocity = v3add(body.velocity, v3mul(linAcc, dt))
      body.velocity = v3mul(body.velocity, Math.pow(1 - body.linearDamping, dt))

      // Integrate angular
      body.angularVelocity = v3add(body.angularVelocity, v3mul(body.torque, dt))
      body.angularVelocity = v3mul(body.angularVelocity, Math.pow(1 - body.angularDamping, dt))

      // Clamp velocity
      const speed = v3len(body.velocity)
      if (speed > MAX_VELOCITY) body.velocity = v3mul(body.velocity, MAX_VELOCITY / speed)

      // Lock axes
      if (body.lockPosX) body.velocity.x = 0
      if (body.lockPosY) body.velocity.y = 0
      if (body.lockPosZ) body.velocity.z = 0
      if (body.lockRotX) body.angularVelocity.x = 0
      if (body.lockRotY) body.angularVelocity.y = 0
      if (body.lockRotZ) body.angularVelocity.z = 0

      // Move
      body._prevPosition = v3clone(body.position)
      body.position = v3add(body.position, v3mul(body.velocity, dt))
      body.rotation = v3add(body.rotation, v3mul(body.angularVelocity, dt))

      // Sleep check
      const kinetic = speed + v3len(body.angularVelocity)
      if (kinetic < SLEEP_THRESHOLD) {
        body._sleepTimer += dt
        if (body._sleepTimer > 0.5) {
          body.sleeping = true
          body.velocity = v3zero()
          body.angularVelocity = v3zero()
          body.onSleep?.()
        }
      } else {
        body._sleepTimer = 0
      }

      body.clearForces()
    }

    // Simple floor collision
    for (const body of this.bodies) {
      if (body.isStatic) continue
      let floorY = 0
      if (body.shape.type === 'sphere')  floorY = body.shape.radius
      if (body.shape.type === 'box')     floorY = body.shape.halfExtents.y
      if (body.shape.type === 'capsule') floorY = body.shape.radius + body.shape.height / 2

      if (body.position.y < floorY) {
        body.position.y = floorY
        body.velocity.y = -body.velocity.y * body.restitution
        body.velocity.x *= (1 - body.friction * dt * 60)
        body.velocity.z *= (1 - body.friction * dt * 60)
        body.wake()
      }
    }

    // Spring constraints
    for (const c of this.constraints) {
      if (c.type === 'spring') {
        const pa = c.bodyA.position
        const pb = c.bodyB.position
        const diff = v3sub(pb, pa)
        const dist = v3len(diff) || 0.0001
        const ext  = dist - c.restLength
        const dir  = v3mul(diff, 1/dist)
        const f    = v3mul(dir, c.stiffness * ext)
        if (!c.bodyA.isStatic) c.bodyA.applyForce(v3mul(f,  1))
        if (!c.bodyB.isStatic) c.bodyB.applyForce(v3mul(f, -1))
      }
    }
  }

  // ── Real-time loop ─────────────────────────────────────────
  start() {
    this._running  = true
    this._lastTime = performance.now()
    const loop = (now) => {
      if (!this._running) return
      const dt = Math.min((now - this._lastTime) / 1000, 0.05) // cap at 50ms
      this._lastTime = now
      this.step(dt)
      this._rafId = requestAnimationFrame(loop)
    }
    this._rafId = requestAnimationFrame(loop)
  }

  stop() {
    this._running = false
    if (this._rafId) cancelAnimationFrame(this._rafId)
  }

  // ── Reset ─────────────────────────────────────────────────
  reset() {
    this.stop()
    for (const b of this.bodies) {
      b.velocity = v3zero()
      b.angularVelocity = v3zero()
      b.force = v3zero()
      b.torque = v3zero()
      b.sleeping = false
    }
  }

  // ── Serialize world state ─────────────────────────────────
  serialize() {
    return {
      gravity: this.gravity,
      bodies: this.bodies.map(b => ({
        id: b.id, name: b.name,
        position: b.position, rotation: b.rotation,
        velocity: b.velocity, mass: b.mass,
        isStatic: b.isStatic, gravityScale: b.gravityScale,
        restitution: b.restitution, friction: b.friction,
        linearDamping: b.linearDamping, angularDamping: b.angularDamping,
        shape: b.shape,
      }))
    }
  }
}

export { vec3, v3add, v3sub, v3mul, v3len, v3norm, v3zero }
      
