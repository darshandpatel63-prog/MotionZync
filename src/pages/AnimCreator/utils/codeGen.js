// codeGen.js — generate clean production-ready code from scene elements

import { ANIMATIONS, KEYFRAMES_CSS, BORDER_KEYFRAMES } from '../engine/AnimEngine.js'

function slugify(str) { return (str||'el').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') }

// ─── HTML / CSS export ─────────────────────────────────────────
export function generateHTMLCSS(elements, bgColor = '#0a0a0f') {
  let html = ''
  let css  = ''

  const usedAnims = new Set()
  const usedBorderAnims = new Set()

  elements.filter(e => e.visible !== false).forEach((el, i) => {
    const cls = `el-${i+1}-${slugify(el.label)}`

    // Build CSS
    let elCss = `.${cls} {\n`
    elCss += `  position: absolute;\n`
    elCss += `  left: ${Math.round(el.x)}px;\n`
    elCss += `  top: ${Math.round(el.y)}px;\n`
    elCss += `  width: ${el.width}px;\n`
    elCss += `  height: ${el.height}px;\n`
    elCss += `  opacity: ${el.opacity};\n`
    if (el.rotation) elCss += `  transform: rotate(${el.rotation}deg);\n`

    // Background
    if (el.type !== 'text') {
      if (el.gradient) {
        const g = el.gradient
        if (g.type === 'linear')
          elCss += `  background: linear-gradient(${g.angle||135}deg, ${g.from}, ${g.to});\n`
        else
          elCss += `  background: radial-gradient(circle, ${g.from}, ${g.to});\n`
      } else {
        elCss += `  background: ${el.fill};\n`
      }
      elCss += `  border-radius: ${el.borderRadius || (el.type==='circle'?50:8)}%;\n`
    }

    // Text styles
    if (el.type === 'text') {
      elCss += `  color: ${el.fontColor || '#ffffff'};\n`
      elCss += `  font-size: ${el.fontSize || 20}px;\n`
      elCss += `  font-weight: ${el.fontWeight || 700};\n`
      elCss += `  display: flex;\n`
      elCss += `  align-items: center;\n`
      elCss += `  justify-content: center;\n`
    }

    // Shadow
    if (el.shadow?.enabled) {
      const s = el.shadow
      elCss += `  box-shadow: ${s.x||0}px ${s.y||0}px ${s.blur||20}px ${s.color||'#7c3aed'};\n`
    }

    // Glow
    if (el.glow?.enabled) {
      elCss += `  filter: drop-shadow(0 0 ${el.glow.intensity||20}px ${el.glow.color||'#7c3aed'});\n`
    }

    // Effects
    const fx = el.effects
    if (fx) {
      const filters = []
      if (fx.blur > 0) filters.push(`blur(${fx.blur}px)`)
      if (fx.brightness !== 100) filters.push(`brightness(${fx.brightness}%)`)
      if (fx.contrast !== 100) filters.push(`contrast(${fx.contrast}%)`)
      if (fx.saturate !== 100) filters.push(`saturate(${fx.saturate}%)`)
      if (fx.hueRotate > 0) filters.push(`hue-rotate(${fx.hueRotate}deg)`)
      if (filters.length) elCss += `  filter: ${filters.join(' ')};\n`
    }

    // Animation
    if (el.anim?.name && el.anim.name !== 'none') {
      const def = ANIMATIONS[el.anim.name]
      if (def?.css) {
        const animVal = typeof def.css === 'function'
          ? def.css(el.anim.duration||2, el.anim.delay||0, el.anim.loop!==false)
          : def.css
        elCss += `  animation: ${animVal};\n`
        usedAnims.add(el.anim.name)
      }
    }

    // Border animation
    if (el.borderAnim?.enabled) {
      const ba = el.borderAnim
      const BORDER_MAP = {
        neon:     `border: ${ba.thickness}px solid ${ba.color}; box-shadow: 0 0 ${ba.glow}px ${ba.color}; animation: ba-neon-pulse ${ba.speed}s ease-in-out infinite;`,
        electric: `border: ${ba.thickness}px solid ${ba.color}; animation: ba-electric ${ba.speed*0.3}s steps(2) infinite;`,
        pulse:    `border: ${ba.thickness}px solid ${ba.color}; animation: ba-border-pulse ${ba.speed}s ease-in-out infinite;`,
        dash:     `border: ${ba.thickness}px dashed ${ba.color}; animation: ba-dash-flow ${ba.speed}s linear infinite;`,
        fire:     `border: ${ba.thickness}px solid ${ba.color}; animation: ba-fire ${ba.speed*0.4}s ease-in-out infinite alternate;`,
        energy:   `border: ${ba.thickness}px solid transparent; outline: ${ba.thickness}px solid ${ba.color}; animation: ba-energy ${ba.speed}s ease-in-out infinite;`,
        scan:     `border: ${ba.thickness}px solid ${ba.color}; animation: ba-scan ${ba.speed}s linear infinite;`,
      }
      const borderRule = BORDER_MAP[ba.type]
      if (borderRule) {
        borderRule.split(';').forEach(r => { if(r.trim()) elCss += `  ${r.trim()};\n` })
        usedBorderAnims.add(ba.type)
      }
    }

    elCss += `}\n\n`
    css += elCss

    // HTML element
    const tag = el.type === 'text' ? 'p' : 'div'
    const content = el.type === 'text' ? el.label : ''
    html += `  <${tag} class="${cls}">${content}</${tag}>\n`
  })

  // Build keyframes CSS for used animations
  let keyframesCss = ''
  if (usedAnims.size > 0) {
    keyframesCss += '\n/* Animation Keyframes */\n'
    keyframesCss += KEYFRAMES_CSS
  }
  if (usedBorderAnims.size > 0) {
    keyframesCss += '\n/* Border Animation Keyframes */\n'
    keyframesCss += BORDER_KEYFRAMES
  }

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>MotionZync Creation</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${bgColor}; overflow: hidden; }
    .scene {
      position: relative;
      width: 900px;
      height: 580px;
      margin: 0 auto;
    }

${css}${keyframesCss}
  </style>
</head>
<body>
  <div class="scene">
${html}  </div>
</body>
</html>`

  return { html: fullHTML, cssOnly: css + keyframesCss }
}

// ─── React component export ────────────────────────────────────
export function generateReact(elements, bgColor = '#0a0a0f') {
  const imports = `import React from 'react'\nimport './Scene.css'\n\n`

  let componentBody = `export default function AnimScene() {\n  return (\n    <div className="scene" style={{background: '${bgColor}', position:'relative', width:900, height:580}}>\n`

  elements.filter(e => e.visible !== false).forEach((el, i) => {
    const style = buildInlineStyle(el)
    const styleStr = JSON.stringify(style, null, 6).replace(/"([^"]+)":/g, '$1:')
    if (el.type === 'text') {
      componentBody += `      <p style={${styleStr}}>${el.label}</p>\n`
    } else {
      componentBody += `      <div style={${styleStr}}/>\n`
    }
  })

  componentBody += `    </div>\n  )\n}`
  return imports + componentBody
}

function buildInlineStyle(el) {
  const style = {
    position: 'absolute',
    left: Math.round(el.x),
    top: Math.round(el.y),
    width: el.width,
    height: el.height,
    opacity: el.opacity,
    borderRadius: el.type === 'circle' ? '50%' : el.borderRadius || 8,
  }
  if (el.rotation) style.transform = `rotate(${el.rotation}deg)`
  if (el.type !== 'text') style.background = el.fill
  else { style.color = el.fontColor; style.fontSize = el.fontSize; style.fontWeight = el.fontWeight }
  if (el.shadow?.enabled) style.boxShadow = `${el.shadow.x||0}px ${el.shadow.y||0}px ${el.shadow.blur}px ${el.shadow.color}`
  if (el.anim?.name && el.anim.name !== 'none') {
    const def = ANIMATIONS[el.anim.name]
    if (def?.css) style.animation = typeof def.css === 'function' ? def.css(el.anim.duration||2, el.anim.delay||0, el.anim.loop!==false) : def.css
  }
  return style
}

// ─── JSON scene export ────────────────────────────────────────
export function generateJSON(elements, meta = {}) {
  return JSON.stringify({
    version: '1.0',
    created: new Date().toISOString(),
    tool: 'MotionZync Creator',
    meta,
    elements: elements.map(e => ({
      id: e.id, type: e.type, label: e.label,
      x: Math.round(e.x), y: Math.round(e.y),
      width: e.width, height: e.height,
      rotation: e.rotation, opacity: e.opacity,
      fill: e.fill, gradient: e.gradient,
      borderRadius: e.borderRadius,
      anim: e.anim, borderAnim: e.borderAnim,
      physics: e.physics, effects: e.effects,
      shadow: e.shadow, glow: e.glow,
    }))
  }, null, 2)
          }
          
