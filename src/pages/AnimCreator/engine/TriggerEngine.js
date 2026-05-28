// TriggerEngine.js — NEW (Feature 8)
// Animation trigger system: hover · click · scroll · auto
// Injects event listeners onto canvas elements at runtime
// Pure JS — no React state overhead

// ─── Trigger definitions ──────────────────────────────────────
export const TRIGGERS = {
  auto:   { label:'Auto (loop)',    icon:'🔄', desc:'Plays automatically, loops forever' },
  hover:  { label:'On Hover',       icon:'🖱', desc:'Plays when mouse enters element' },
  click:  { label:'On Click',       icon:'👆', desc:'Plays each time element is clicked' },
  scroll: { label:'On Scroll',      icon:'📜', desc:'Plays when element scrolls into view' },
  once:   { label:'Play Once',      icon:'▶',  desc:'Plays once on page load, no loop' },
}
export const TRIGGER_NAMES = Object.keys(TRIGGERS)

// ─── Build animation CSS for a triggered element ─────────────
// Returns style object to apply / remove based on trigger state
export function getTriggerStyle(el, isTriggered) {
  const anim = el.anim
  if (!anim || anim.name === 'none') return {}
  if (!el.trigger || el.trigger === 'auto') return {} // handled by buildAnimStyle

  if (!isTriggered) {
    // Hidden / reset state
    if (['fadeIn','cinematic','springIn','blur','slideUp','slideDown'].includes(anim.name))
      return { opacity: 0 }
    return {}
  }

  // Triggered state — return animation CSS
  const ANIM_MAP = {
    fadeIn:     `mz-fadeIn    ${anim.duration||1.2}s ease forwards`,
    cinematic:  `mz-cinematic ${anim.duration||1.2}s cubic-bezier(0.19,1,0.22,1) forwards`,
    springIn:   `mz-spring-in ${anim.duration||0.8}s cubic-bezier(0.34,1.56,0.64,1) forwards`,
    blur:       `mz-blur-in   ${anim.duration||1}s ease forwards`,
    float:      `mz-float     ${anim.duration||3}s ease-in-out infinite`,
    pulse:      `mz-pulse     ${anim.duration||2}s ease-in-out infinite`,
    spin:       `mz-spin      ${anim.duration||2}s linear infinite`,
    bounce:     `mz-bounce    ${anim.duration||1}s cubic-bezier(0.36,0.07,0.19,0.97) infinite`,
    shake:      `mz-shake     ${anim.duration||0.5}s ease-in-out`,
    glitch:     `mz-glitch    ${anim.duration||0.4}s steps(2) infinite`,
    neonFlicker:`mz-neon-flicker ${anim.duration||1.5}s steps(3) infinite`,
    zoomPulse:  `mz-zoom-pulse ${anim.duration||1}s ease-in-out infinite`,
    glow:       `mz-glow      ${anim.duration||2}s ease-in-out infinite`,
    wave:       `mz-wave      ${anim.duration||2.5}s ease-in-out infinite`,
    morph:      `mz-morph     ${anim.duration||3}s ease-in-out infinite`,
    swing:      `mz-swing     ${anim.duration||2}s ease-in-out infinite`,
  }
  const animVal = ANIM_MAP[anim.name]
  if (!animVal) return {}
  return { animation: animVal }
}

// ─── Scroll observer (singleton) ─────────────────────────────
let _scrollObserver = null
const _scrollCallbacks = new Map()  // elId → callback

export function observeScroll(domEl, elId, onVisible) {
  if (!_scrollObserver) {
    _scrollObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cb = _scrollCallbacks.get(entry.target.dataset?.id)
          if (cb) cb()
        }
      })
    }, { threshold: 0.2 })
  }
  _scrollCallbacks.set(elId, onVisible)
  if (domEl) _scrollObserver.observe(domEl)
}

export function unobserveScroll(domEl, elId) {
  _scrollCallbacks.delete(elId)
  if (domEl && _scrollObserver) _scrollObserver.unobserve(domEl)
}

// ─── Default trigger config ───────────────────────────────────
export function makeTriggerConfig(name = 'auto') {
  return {
    name,
    resetOnLeave: name === 'hover',   // hover: reset when mouse leaves
    delay:        0,
  }
}

