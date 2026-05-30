// AnimEngine.js — animation definitions and CSS generation

// ─── Animation presets ────────────────────────────────────────
export const ANIMATIONS = {
  none:       { label:'None',          icon:'—',   css:'' },
  float:      { label:'Float',         icon:'〰️',  css:(d,delay,loop)=>`mz-float ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  pulse:      { label:'Pulse',         icon:'💓',  css:(d,delay,loop)=>`mz-pulse ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  spin:       { label:'Spin',          icon:'🔄',  css:(d,delay,loop)=>`mz-spin ${d}s linear ${loop?'infinite':1} ${delay}s` },
  bounce:     { label:'Bounce',        icon:'⬆️',  css:(d,delay,loop)=>`mz-bounce ${d}s cubic-bezier(0.36,0.07,0.19,0.97) ${loop?'infinite':1} ${delay}s` },
  shake:      { label:'Shake',         icon:'📳',  css:(d,delay,loop)=>`mz-shake ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  fadeIn:     { label:'Fade In',       icon:'👁️',  css:(d,delay,loop)=>`mz-fadeIn ${d}s ease ${loop?'infinite':'forwards'} ${delay}s` },
  glow:       { label:'Glow',          icon:'✨',   css:(d,delay,loop)=>`mz-glow ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  slide:      { label:'Slide',         icon:'➡️',  css:(d,delay,loop)=>`mz-slide ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  morph:      { label:'Morph',         icon:'🔮',  css:(d,delay,loop)=>`mz-morph ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  swing:      { label:'Swing',         icon:'🎵',  css:(d,delay,loop)=>`mz-swing ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  zoomPulse:  { label:'Zoom Pulse',    icon:'🔍',  css:(d,delay,loop)=>`mz-zoom-pulse ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  glitch:     { label:'Glitch',        icon:'⚡',   css:(d,delay,loop)=>`mz-glitch ${d}s steps(2) ${loop?'infinite':1} ${delay}s` },
  neonFlicker:{ label:'Neon Flicker',  icon:'💡',  css:(d,delay,loop)=>`mz-neon-flicker ${d}s steps(3) ${loop?'infinite':1} ${delay}s` },
  cinematic:  { label:'Cinematic',     icon:'🎬',  css:(d,delay,loop)=>`mz-cinematic ${d}s cubic-bezier(0.19,1,0.22,1) ${loop?'infinite':'forwards'} ${delay}s` },
  wave:       { label:'Wave',          icon:'🌊',  css:(d,delay,loop)=>`mz-wave ${d}s ease-in-out ${loop?'infinite':1} ${delay}s` },
  orbit:      { label:'Orbit',         icon:'🪐',  css:(d,delay,loop)=>`mz-orbit ${d}s linear ${loop?'infinite':1} ${delay}s` },
  typewriter: { label:'Typewriter',    icon:'⌨️',  css:(d,delay,loop)=>`mz-typewriter ${d}s steps(20) ${loop?'infinite':'forwards'} ${delay}s` },
  springIn:   { label:'Spring In',     icon:'🌱',  css:(d,delay,loop)=>`mz-spring-in ${d}s cubic-bezier(0.34,1.56,0.64,1) forwards ${delay}s` },
  blur:       { label:'Blur In',       icon:'🌫️',  css:(d,delay,loop)=>`mz-blur-in ${d}s ease ${loop?'infinite':'forwards'} ${delay}s` },
}

// ─── CSS keyframes string (inject once) ──────────────────────
export const KEYFRAMES_CSS = `
@keyframes mz-float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
@keyframes mz-pulse      { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.12);opacity:0.75} }
@keyframes mz-spin       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes mz-bounce     { 0%,100%{transform:translateY(0)} 35%{transform:translateY(-28px)} 65%{transform:translateY(-14px)} }
@keyframes mz-shake      { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
@keyframes mz-fadeIn     { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes mz-glow       { 0%,100%{filter:brightness(1) drop-shadow(0 0 4px currentColor)} 50%{filter:brightness(1.3) drop-shadow(0 0 18px currentColor)} }
@keyframes mz-slide      { 0%,100%{transform:translateX(0)} 50%{transform:translateX(32px)} }
@keyframes mz-morph      { 0%,100%{border-radius:50%} 50%{border-radius:8px} }
@keyframes mz-swing      { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(10deg)} }
@keyframes mz-zoom-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
@keyframes mz-glitch     { 0%{transform:translate(0)} 25%{transform:translate(-3px,1px) skewX(2deg)} 50%{transform:translate(3px,-1px) skewX(-2deg)} 75%{transform:translate(-2px,2px)} 100%{transform:translate(0)} }
@keyframes mz-neon-flicker{ 0%,100%{opacity:1} 33%{opacity:0.4} 66%{opacity:0.85} }
@keyframes mz-cinematic  { from{opacity:0;transform:scale(0.9) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes mz-wave       { 0%,100%{transform:skewX(0)} 25%{transform:skewX(4deg)} 75%{transform:skewX(-4deg)} }
@keyframes mz-orbit      { from{transform:rotate(0deg) translateX(30px) rotate(0deg)} to{transform:rotate(360deg) translateX(30px) rotate(-360deg)} }
@keyframes mz-typewriter { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
@keyframes mz-spring-in  { 0%{transform:scale(0) rotate(-10deg);opacity:0} 70%{transform:scale(1.1) rotate(2deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
@keyframes mz-blur-in    { from{filter:blur(12px);opacity:0} to{filter:blur(0);opacity:1} }
`

// ─── Border animation CSS ─────────────────────────────────────
export const BORDER_ANIMS = {
  neon:     { label:'Neon Glow',     css: (c,s,t,g) => `border: ${t}px solid ${c}; box-shadow: 0 0 ${g}px ${c}, inset 0 0 ${g/2}px ${c}; animation: ba-neon-pulse ${s}s ease-in-out infinite;` },
  electric: { label:'Electric',      css: (c,s,t,g) => `border: ${t}px solid ${c}; animation: ba-electric ${s*0.3}s steps(2) infinite; box-shadow: 0 0 ${g}px ${c};` },
  flow:     { label:'RGB Flow',      css: (c,s,t,g) => `border: ${t}px solid transparent; background-clip:padding-box; outline: ${t}px solid; outline-color: ${c}; animation: ba-rgb-flow ${s}s linear infinite;` },
  pulse:    { label:'Pulse',         css: (c,s,t,g) => `border: ${t}px solid ${c}; animation: ba-border-pulse ${s}s ease-in-out infinite;` },
  dash:     { label:'Dashed Flow',   css: (c,s,t,g) => `border: ${t}px dashed ${c}; animation: ba-dash-flow ${s}s linear infinite; box-shadow:0 0 ${g}px ${c};` },
  fire:     { label:'Fire',          css: (c,s,t,g) => `border: ${t}px solid ${c}; animation: ba-fire ${s*0.4}s ease-in-out infinite alternate; filter: drop-shadow(0 0 ${g}px ${c});` },
  energy:   { label:'Energy Wave',   css: (c,s,t,g) => `border: ${t}px solid transparent; outline: ${t}px solid ${c}; outline-offset:0; animation: ba-energy ${s}s ease-in-out infinite; box-shadow:0 0 ${g*1.5}px ${c};` },
  scan:     { label:'Scanline',      css: (c,s,t,g) => `border: ${t}px solid ${c}; animation: ba-scan ${s}s linear infinite; box-shadow:0 0 ${g}px ${c};` },
}

export const BORDER_KEYFRAMES = `
@keyframes ba-neon-pulse   { 0%,100%{box-shadow:0 0 6px currentColor,inset 0 0 4px currentColor} 50%{box-shadow:0 0 24px currentColor,inset 0 0 12px currentColor} }
@keyframes ba-electric     { 0%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.01) skewX(1deg)} 100%{opacity:1} }
@keyframes ba-rgb-flow     { 0%{outline-color:#ff0080} 25%{outline-color:#7c3aed} 50%{outline-color:#06b6d4} 75%{outline-color:#22c55e} 100%{outline-color:#ff0080} }
@keyframes ba-border-pulse { 0%,100%{border-width:2px;opacity:1} 50%{border-width:4px;opacity:0.6} }
@keyframes ba-dash-flow    { from{stroke-dashoffset:0} to{stroke-dashoffset:100} }
@keyframes ba-fire         { from{filter:drop-shadow(0 0 4px #f97316)} to{filter:drop-shadow(0 0 18px #ef4444)} }
@keyframes ba-energy       { 0%,100%{outline-offset:0;opacity:1} 50%{outline-offset:4px;opacity:0.5} }
@keyframes ba-scan         { from{box-shadow:0 -100% 0 2px currentColor inset} to{box-shadow:0 100% 0 2px currentColor inset} }
`

// ─── Build element style string ──────────────────────────────
export function buildAnimStyle(el) {
  const a = el.anim
  if (!a || a.name === 'none') return ''
  const def = ANIMATIONS[a.name]
  if (!def || !def.css) return ''
  return typeof def.css === 'function'
    ? def.css(a.duration || 2, a.delay || 0, a.loop !== false)
    : def.css
}

// ─── Build border animation style ────────────────────────────
export function buildBorderStyle(el) {
  if (!el.borderAnim?.enabled) return {}
  const ba = el.borderAnim
  const def = BORDER_ANIMS[ba.type]
  if (!def) return {}
  const cssStr = def.css(ba.color || '#06b6d4', ba.speed || 2, ba.thickness || 2, ba.glow || 15)
  // Parse the css string into style props (simple approach)
  const style = {}
  cssStr.split(';').forEach(rule => {
    const [prop, val] = rule.split(':').map(s => s.trim())
    if (!prop || !val) return
    // Convert to camelCase
    const camel = prop.replace(/-([a-z])/g, g => g[1].toUpperCase())
    style[camel] = val
  })
  return style
}

// ─── Effect filter string ─────────────────────────────────────
export function buildFilterStyle(el) {
  const e = el.effects
  if (!e) return ''
  const parts = []
  if (e.blur       > 0)   parts.push(`blur(${e.blur}px)`)
  if (e.brightness !== 100) parts.push(`brightness(${e.brightness}%)`)
  if (e.contrast   !== 100) parts.push(`contrast(${e.contrast}%)`)
  if (e.saturate   !== 100) parts.push(`saturate(${e.saturate}%)`)
  if (e.hueRotate  > 0)   parts.push(`hue-rotate(${e.hueRotate}deg)`)
  if (el.glow?.enabled) parts.push(`drop-shadow(0 0 ${el.glow.intensity}px ${el.glow.color})`)
  return parts.join(' ')
}

// ─── Shadow style ─────────────────────────────────────────────
export function buildShadowStyle(el) {
  if (!el.shadow?.enabled) return ''
  const s = el.shadow
  return `${s.x||0}px ${s.y||0}px ${s.blur||20}px ${s.color||'#7c3aed'}`
}

// ─── Gradient background ──────────────────────────────────────
export function buildGradient(el) {
  if (!el.gradient) return el.fill || '#7c3aed'
  const g = el.gradient

  // ── NEW multi-stop format from GradientBuilder ────────────
  if (g.stops && g.stops.length >= 2) {
    const sorted = [...g.stops].sort((a, b) => a.pos - b.pos)
    const stops  = sorted.map(s => `${s.color} ${s.pos}%`).join(', ')
    if (g.type === 'radial') return `radial-gradient(circle, ${stops})`
    if (g.type === 'conic')  return `conic-gradient(from ${g.angle||0}deg, ${stops})`
    return `linear-gradient(${g.angle||135}deg, ${stops})`
  }

  // ── Legacy {from, to} format (backward compat) ─────────────
  const from = g.from || el.fill || '#7c3aed'
  const to   = g.to   || '#06b6d4'
  if (g.type === 'linear') return `linear-gradient(${g.angle||135}deg, ${from}, ${to})`
  if (g.type === 'radial') return `radial-gradient(circle, ${from}, ${to})`
  return el.fill || '#7c3aed'
}

// ─── Get categories ───────────────────────────────────────────
export const ANIM_CATEGORIES = {
  'Basic':    ['none','fadeIn','slide','springIn','cinematic'],
  'Loop':     ['float','pulse','spin','bounce','swing','wave','orbit'],
  'Effects':  ['glow','glitch','neonFlicker','morph','blur','zoomPulse'],
  'Text':     ['typewriter','shake','wave'],
}

// ─── Easing options ───────────────────────────────────────────
export const EASINGS = [
  'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out',
  'cubic-bezier(0.34,1.56,0.64,1)',
  'cubic-bezier(0.19,1,0.22,1)',
  'cubic-bezier(0.68,-0.55,0.27,1.55)',
  'steps(4)',
]

                                           
