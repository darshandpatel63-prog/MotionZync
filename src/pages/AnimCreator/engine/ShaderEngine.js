// ShaderEngine.js — NEW
// CSS + canvas-overlay "shader" effects for canvas elements
// Pure CSS animations — no WebGL needed, GPU-light

// ─── Shader definitions ───────────────────────────────────────
export const SHADERS = {
  none: {
    label: 'None', icon: '—',
    css: () => '',
    overlay: false,
  },
  hologram: {
    label: 'Hologram', icon: '🔷',
    css: (intensity=0.8) => `
      filter: hue-rotate(180deg) saturate(${200*intensity}%) brightness(${120*intensity}%);
      animation: sh-holo ${1.5}s linear infinite;
      mix-blend-mode: screen;
    `,
    overlay: 'hologram',
    overlayOpacity: (i) => i * 0.55,
  },
  glitch: {
    label: 'Glitch',    icon: '⚡',
    css: (intensity=0.8) => `
      animation: sh-glitch ${0.4 + (1-intensity)*0.6}s steps(2) infinite;
    `,
    overlay: 'glitch',
    overlayOpacity: (i) => i * 0.4,
  },
  scanlines: {
    label: 'Scanlines', icon: '📺',
    css: (intensity=0.6) => `
      animation: sh-scan-flicker ${3}s ease-in-out infinite;
    `,
    overlay: 'scanlines',
    overlayOpacity: (i) => i * 0.6,
  },
  chromatic: {
    label: 'Chromatic',  icon: '🌈',
    css: (intensity=0.8) => `
      animation: sh-chroma ${0.8}s ease-in-out infinite alternate;
      filter: saturate(${150*intensity}%);
    `,
    overlay: 'chromatic',
    overlayOpacity: (i) => i * 0.5,
  },
  vhs: {
    label: 'VHS',        icon: '📼',
    css: (intensity=0.7) => `
      animation: sh-vhs ${2}s steps(4) infinite;
      filter: contrast(${110*intensity}%) saturate(${130*intensity}%);
    `,
    overlay: 'vhs',
    overlayOpacity: (i) => i * 0.5,
  },
  matrix: {
    label: 'Matrix',     icon: '💚',
    css: (intensity=0.8) => `
      filter: hue-rotate(100deg) saturate(${250*intensity}%) brightness(${80*intensity}%);
      animation: sh-matrix ${1.2}s steps(3) infinite;
    `,
    overlay: false,
  },
  neon: {
    label: 'Neon',       icon: '💜',
    css: (intensity=0.8) => `
      filter: saturate(${300*intensity}%) brightness(${130*intensity}%) contrast(110%);
      animation: sh-neon-flicker ${1.8}s steps(3) infinite;
    `,
    overlay: false,
  },
  xray: {
    label: 'X-Ray',      icon: '🔆',
    css: (intensity=0.8) => `
      filter: invert(${intensity}) hue-rotate(180deg) brightness(${110}%);
    `,
    overlay: false,
  },
}

export const SHADER_NAMES = Object.keys(SHADERS)

// ─── CSS keyframes for all shaders ───────────────────────────
export const SHADER_KEYFRAMES = `
@keyframes sh-holo {
  0%   { filter: hue-rotate(0deg)   saturate(200%) brightness(120%); opacity: 0.85; }
  25%  { filter: hue-rotate(90deg)  saturate(250%) brightness(140%); opacity: 0.95; }
  50%  { filter: hue-rotate(180deg) saturate(200%) brightness(110%); opacity: 0.80; }
  75%  { filter: hue-rotate(270deg) saturate(180%) brightness(130%); opacity: 0.90; }
  100% { filter: hue-rotate(360deg) saturate(200%) brightness(120%); opacity: 0.85; }
}
@keyframes sh-glitch {
  0%   { transform: translate(0,0)      skewX(0);   clip-path: none; }
  20%  { transform: translate(-4px,1px) skewX(3deg); clip-path: inset(20% 0 30% 0); }
  40%  { transform: translate(4px,-1px) skewX(-2deg); clip-path: inset(60% 0 10% 0); }
  60%  { transform: translate(-2px,2px) skewX(1deg); clip-path: inset(40% 0 50% 0); }
  80%  { transform: translate(3px,0)   skewX(-1deg); clip-path: none; }
  100% { transform: translate(0,0)      skewX(0);   clip-path: none; }
}
@keyframes sh-scan-flicker {
  0%,98%,100% { opacity: 1; }
  99%          { opacity: 0.85; }
}
@keyframes sh-chroma {
  0%   { text-shadow: -2px 0 #ff0080, 2px 0 #00ffff; filter: saturate(150%); }
  100% { text-shadow: 2px 0 #ff0080, -2px 0 #00ffff; filter: saturate(180%); }
}
@keyframes sh-vhs {
  0%  { transform: translate(0,0);   filter: contrast(110%) saturate(130%); }
  25% { transform: translate(-1px,0); filter: contrast(115%) hue-rotate(5deg); }
  50% { transform: translate(1px,0);  filter: contrast(108%) saturate(140%); }
  75% { transform: translate(0,1px);  filter: contrast(112%) hue-rotate(-5deg); }
}
@keyframes sh-matrix {
  0%   { filter: hue-rotate(100deg) saturate(250%) brightness(80%); }
  33%  { filter: hue-rotate(110deg) saturate(300%) brightness(90%); }
  66%  { filter: hue-rotate(95deg)  saturate(200%) brightness(75%); }
  100% { filter: hue-rotate(100deg) saturate(250%) brightness(80%); }
}
@keyframes sh-neon-flicker {
  0%,100% { opacity: 1;    filter: saturate(300%) brightness(130%) contrast(110%); }
  33%      { opacity: 0.85; filter: saturate(250%) brightness(110%); }
  66%      { opacity: 0.95; filter: saturate(350%) brightness(145%); }
}
`

// ─── Build shader CSS for an element ─────────────────────────
export function buildShaderStyle(el) {
  if (!el.shader?.name || el.shader.name === 'none') return ''
  const def = SHADERS[el.shader.name]
  if (!def) return ''
  return def.css(el.shader.intensity ?? 0.8)
}

// ─── Overlay component props ──────────────────────────────────
// Returns overlay type string or false
export function getShaderOverlay(el) {
  if (!el.shader?.name || el.shader.name === 'none') return null
  const def = SHADERS[el.shader.name]
  if (!def?.overlay) return null
  return { type: def.overlay, opacity: (def.overlayOpacity?.(el.shader.intensity ?? 0.8) ?? 0.5) }
}

