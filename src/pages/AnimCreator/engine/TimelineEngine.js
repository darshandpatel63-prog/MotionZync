// TimelineEngine.js — NEW
// Keyframe data model + interpolation engine for Timeline Editor
// CPU-only, no WebGL — works on low-end devices

// ─── Easing functions ─────────────────────────────────────────
const EASE = {
  linear:     t => t,
  easeIn:     t => t * t,
  easeOut:    t => t * (2 - t),
  easeInOut:  t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
  bounce:     t => {
    if (t < 1/2.75) return 7.5625*t*t
    if (t < 2/2.75) return 7.5625*(t-=1.5/2.75)*t+0.75
    if (t < 2.5/2.75) return 7.5625*(t-=2.25/2.75)*t+0.9375
    return 7.5625*(t-=2.625/2.75)*t+0.984375
  },
  elastic:    t => t===0||t===1 ? t : -Math.pow(2,10*(t-1))*Math.sin((t-1.075)*(2*Math.PI)/0.3),
  spring:     t => 1 - Math.cos(t * Math.PI * 4.5) * Math.pow(1-t, 3),
  back:       t => { const c=1.70158; return t*t*((c+1)*t - c) },
}

export const EASING_NAMES = Object.keys(EASE)

// ─── Interpolate a single numeric value ───────────────────────
function interp(a, b, t, easing='easeInOut') {
  const fn = EASE[easing] || EASE.easeInOut
  const et = fn(Math.max(0, Math.min(1, t)))
  return a + (b - a) * et
}

// ─── Animatable properties per element type ───────────────────
export const ANIMATABLE_PROPS = ['x','y','width','height','opacity','rotation','borderRadius']

// ─── Create a new keyframe ─────────────────────────────────────
export function makeKeyframe(time, el) {
  return {
    id:      'kf_' + Date.now() + '_' + Math.random().toString(36).slice(2,5),
    time,    // seconds
    props: {
      x:            el.x,
      y:            el.y,
      width:        el.width,
      height:       el.height,
      opacity:      el.opacity,
      rotation:     el.rotation || 0,
      borderRadius: el.borderRadius || 0,
    },
    easing: 'easeInOut',
  }
}

// ─── Get interpolated element state at time T ─────────────────
export function getStateAtTime(keyframes, t) {
  if (!keyframes || keyframes.length === 0) return {}
  const sorted = [...keyframes].sort((a,b) => a.time - b.time)

  // Before first keyframe
  if (t <= sorted[0].time) return { ...sorted[0].props }

  // After last keyframe
  if (t >= sorted[sorted.length-1].time) return { ...sorted[sorted.length-1].props }

  // Find surrounding keyframes
  let prev = sorted[0], next = sorted[sorted.length-1]
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].time <= t && sorted[i+1].time >= t) {
      prev = sorted[i]; next = sorted[i+1]; break
    }
  }

  const span = next.time - prev.time
  const localT = span > 0 ? (t - prev.time) / span : 1
  const easing = next.easing || 'easeInOut'

  const result = {}
  ANIMATABLE_PROPS.forEach(prop => {
    const a = prev.props[prop]
    const b = next.props[prop]
    if (a !== undefined && b !== undefined)
      result[prop] = interp(a, b, localT, easing)
  })
  return result
}

// ─── Build timeline tracks from elements ─────────────────────
// Each element gets one track; keyframes stored in el._keyframes
export function getElementTrack(el) {
  return {
    id:         el.id,
    label:      el.label || el.type,
    type:       el.type,
    color:      el.fill || '#7c3aed',
    keyframes:  el._keyframes || [],
    visible:    el.visible !== false,
    locked:     el.locked || false,
  }
}

// ─── Snap time to grid ────────────────────────────────────────
export function snapTime(t, duration, fps=24) {
  const frame = 1/fps
  return Math.max(0, Math.min(duration, Math.round(t/frame)*frame))
}

// ─── Format time as mm:ss:ff ──────────────────────────────────
export function formatTime(t, fps=24) {
  const s  = Math.floor(t)
  const f  = Math.floor((t - s) * fps)
  const m  = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}:${String(f).padStart(2,'0')}`
}

