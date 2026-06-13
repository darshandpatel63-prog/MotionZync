// Keyframe3DEngine.js
// Keyframe storage, interpolation (lerp + easing), and playback application
// for 3D objects (position + rotation) in MotionZync Studio3D.
//
// Usage:
//   const track = new Keyframe3DTrack(bodyId, bodyName)
//   track.addKeyframe(time, { position, rotation, easing })
//   const pose = track.sample(currentTime)
//   pose -> { position:{x,y,z}, rotation:{x,y,z} }

// ─── Easing functions ──────────────────────────────────────────
export const EASINGS = {
  linear:    (t) => t,
  easeIn:    (t) => t * t,
  easeOut:   (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
}

export function getEasing(name) {
  return EASINGS[name] || EASINGS.linear
}

// ─── Vector helpers ─────────────────────────────────────────────
function lerpVec3(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  }
}

// Shortest-path angle lerp (handles wraparound for rotation in radians)
function lerpAngle(a, b, t) {
  let diff = b - a
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return a + diff * t
}

function lerpRot3(a, b, t) {
  return {
    x: lerpAngle(a.x, b.x, t),
    y: lerpAngle(a.y, b.y, t),
    z: lerpAngle(a.z, b.z, t),
  }
}

// ─── Single object's keyframe track ─────────────────────────────
export class Keyframe3DTrack {
  constructor(bodyId, bodyName) {
    this.bodyId = bodyId
    this.bodyName = bodyName
    this.keyframes = [] // { id, time, position, rotation, scale, easing }
  }

  addKeyframe(time, data = {}) {
    const kf = {
      id: data.id || `kf_${this.bodyId}_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      time,
      position: data.position ? { ...data.position } : { x:0, y:0, z:0 },
      rotation: data.rotation ? { ...data.rotation } : { x:0, y:0, z:0 },
      scale:    data.scale    ? { ...data.scale }    : { x:1, y:1, z:1 },
      easing:   data.easing || 'easeInOut',
    }
    // Replace existing keyframe at same time (within tolerance)
    this.keyframes = this.keyframes.filter(k => Math.abs(k.time - time) > 0.001)
    this.keyframes.push(kf)
    this.keyframes.sort((a, b) => a.time - b.time)
    return kf
  }

  removeKeyframe(id) {
    this.keyframes = this.keyframes.filter(k => k.id !== id)
  }

  clear() {
    this.keyframes = []
  }

  // Get sorted keyframes
  sorted() {
    return this.keyframes
  }

  // ── Sample pose at given time (interpolated) ──────────────────
  sample(time) {
    const kfs = this.keyframes
    if (kfs.length === 0) return null
    if (kfs.length === 1) {
      return {
        position: { ...kfs[0].position },
        rotation: { ...kfs[0].rotation },
        scale:    { ...kfs[0].scale },
      }
    }

    // Before first keyframe -> clamp to first
    if (time <= kfs[0].time) {
      return {
        position: { ...kfs[0].position },
        rotation: { ...kfs[0].rotation },
        scale:    { ...kfs[0].scale },
      }
    }

    // After last keyframe -> clamp to last
    const last = kfs[kfs.length - 1]
    if (time >= last.time) {
      return {
        position: { ...last.position },
        rotation: { ...last.rotation },
        scale:    { ...last.scale },
      }
    }

    // Find surrounding pair
    for (let i = 0; i < kfs.length - 1; i++) {
      const a = kfs[i]
      const b = kfs[i + 1]
      if (time >= a.time && time <= b.time) {
        const span = b.time - a.time
        const rawT = span > 0 ? (time - a.time) / span : 0
        const ease = getEasing(b.easing)
        const t = ease(rawT)

        return {
          position: lerpVec3(a.position, b.position, t),
          rotation: lerpRot3(a.rotation, b.rotation, t),
          scale:    lerpVec3(a.scale, b.scale, t),
        }
      }
    }

    return null
  }

  serialize() {
    return {
      bodyId: this.bodyId,
      bodyName: this.bodyName,
      keyframes: this.keyframes.map(k => ({ ...k })),
    }
  }

  static deserialize(data) {
    const track = new Keyframe3DTrack(data.bodyId, data.bodyName)
    track.keyframes = (data.keyframes || []).map(k => ({ ...k }))
    return track
  }
}

// ─── Multi-object keyframe manager ──────────────────────────────
export class Keyframe3DAnimator {
  constructor() {
    this.tracks = new Map() // bodyId -> Keyframe3DTrack
    this.duration = 5
  }

  getTrack(bodyId, bodyName) {
    if (!this.tracks.has(bodyId)) {
      this.tracks.set(bodyId, new Keyframe3DTrack(bodyId, bodyName))
    }
    return this.tracks.get(bodyId)
  }

  addKeyframe(bodyId, bodyName, time, data) {
    const track = this.getTrack(bodyId, bodyName)
    return track.addKeyframe(time, data)
  }

  removeKeyframe(bodyId, kfId) {
    const track = this.tracks.get(bodyId)
    if (track) track.removeKeyframe(kfId)
  }

  removeKeyframeById(kfId) {
    for (const track of this.tracks.values()) {
      track.removeKeyframe(kfId)
    }
  }

  hasKeyframes(bodyId) {
    const track = this.tracks.get(bodyId)
    return !!track && track.keyframes.length > 0
  }

  getAllKeyframes() {
    const all = []
    for (const track of this.tracks.values()) {
      for (const kf of track.keyframes) {
        all.push({ ...kf, bodyId: track.bodyId, bodyName: track.bodyName })
      }
    }
    return all.sort((a, b) => a.time - b.time)
  }

  // ── Apply interpolated pose to all tracked meshes at given time ──
  // meshMap: { [bodyId]: THREE.Mesh }
  applyAtTime(time, meshMap) {
    for (const [bodyId, track] of this.tracks.entries()) {
      if (track.keyframes.length === 0) continue
      const mesh = meshMap[bodyId]
      if (!mesh) continue

      const pose = track.sample(time)
      if (!pose) continue

      mesh.position.set(pose.position.x, pose.position.y, pose.position.z)
      mesh.rotation.set(pose.rotation.x, pose.rotation.y, pose.rotation.z)
      if (pose.scale) mesh.scale.set(pose.scale.x, pose.scale.y, pose.scale.z)
    }
  }

  // ── Compute the max time across all keyframes ────────────────
  getMaxTime() {
    let max = 0
    for (const track of this.tracks.values()) {
      for (const kf of track.keyframes) {
        if (kf.time > max) max = kf.time
      }
    }
    return max
  }

  clearBody(bodyId) {
    this.tracks.delete(bodyId)
  }

  clearAll() {
    this.tracks.clear()
  }

  serialize() {
    return {
      duration: this.duration,
      tracks: Array.from(this.tracks.values()).map(t => t.serialize()),
    }
  }

  static deserialize(data) {
    const animator = new Keyframe3DAnimator()
    animator.duration = data.duration ?? 5
    for (const t of (data.tracks || [])) {
      const track = Keyframe3DTrack.deserialize(t)
      animator.tracks.set(track.bodyId, track)
    }
    return animator
  }
}
