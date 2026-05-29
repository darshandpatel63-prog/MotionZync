// MaskSystem.js — NEW (Feature 10)
// CSS clip-path + mask region system for canvas elements
// Pure CSS — no canvas 2D needed, works on all element types

// ─── Mask preset definitions ──────────────────────────────────
export const MASK_PRESETS = {
  none: {
    label: 'None',         icon: '—',
    clipPath: '',
  },
  circle: {
    label: 'Circle',       icon: '⭕',
    clipPath: 'circle(50% at 50% 50%)',
  },
  ellipse: {
    label: 'Ellipse',      icon: '🥚',
    clipPath: 'ellipse(50% 35% at 50% 50%)',
  },
  triangle: {
    label: 'Triangle',     icon: '△',
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  },
  diamond: {
    label: 'Diamond',      icon: '♦',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  },
  star: {
    label: 'Star',         icon: '⭐',
    clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
  },
  hexagon: {
    label: 'Hexagon',      icon: '⬡',
    clipPath: 'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)',
  },
  arrow: {
    label: 'Arrow',        icon: '➤',
    clipPath: 'polygon(0% 20%,60% 20%,60% 0%,100% 50%,60% 100%,60% 80%,0% 80%)',
  },
  heart: {
    label: 'Heart',        icon: '❤',
    clipPath: 'path("M 50 30 A 20 20 0 0 1 90 30 A 20 20 0 0 1 50 75 A 20 20 0 0 1 10 30 A 20 20 0 0 1 50 30")',
    // fallback to polygon for broader compat:
    clipPathFallback: 'polygon(20% 30%,50% 10%,80% 30%,80% 60%,50% 90%,20% 60%)',
  },
  slash: {
    label: 'Slash',        icon: '╱',
    clipPath: 'polygon(0% 100%,0% 60%,100% 0%,100% 40%)',
  },
  insetRound: {
    label: 'Rounded',      icon: '▢',
    clipPath: 'inset(8% 8% 8% 8% round 24px)',
  },
  custom: {
    label: 'Custom',       icon: '✏️',
    clipPath: '',  // user enters their own
  },
}

export const MASK_PRESET_NAMES = Object.keys(MASK_PRESETS)

// ─── Build clip-path CSS for an element ──────────────────────
export function buildMaskStyle(el) {
  if (!el.mask?.enabled || !el.mask.preset || el.mask.preset === 'none') return {}

  const def      = MASK_PRESETS[el.mask.preset]
  if (!def)      return {}

  let clip = ''
  if (el.mask.preset === 'custom') {
    clip = el.mask.customClip || ''
  } else {
    clip = def.clipPath || def.clipPathFallback || ''
  }

  // Scale / position inset from mask config
  if (el.mask.inset && clip.startsWith('inset')) {
    const i = el.mask.inset
    clip = `inset(${i}% ${i}% ${i}% ${i}% round ${el.mask.radius||24}px)`
  }

  return clip ? { clipPath: clip } : {}
}

// ─── Default mask config ──────────────────────────────────────
export function makeMaskConfig() {
  return {
    enabled:    false,
    preset:     'none',
    customClip: '',
    inset:      8,
    radius:     24,
  }
}

