// codeGen.js — UPDATED (Feature 6)
// New: generateGSAP() · generateFramerMotion()
// Updated: gradient stops support in HTML/CSS export

import { ANIMATIONS, KEYFRAMES_CSS, BORDER_KEYFRAMES } from '../engine/AnimEngine.js'
import { buildGradientCSS } from '../panels/GradientBuilder.jsx'

function slugify(str) { return (str||'el').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') }

// ─── HTML / CSS export ─────────────────────────────────────────
export function generateHTMLCSS(elements, bgColor = '#0a0a0f') {
  let html = '', css = ''
  const usedAnims = new Set(), usedBorderAnims = new Set()

  elements.filter(e => e.visible !== false).forEach((el, i) => {
    const cls = `el-${i+1}-${slugify(el.label)}`
    let elCss = `.${cls} {\n`
    elCss += `  position: absolute;\n`
    elCss += `  left: ${Math.round(el.x)}px;\n`
    elCss += `  top: ${Math.round(el.y)}px;\n`
    elCss += `  width: ${el.width}px;\n`
    elCss += `  height: ${el.height}px;\n`
    elCss += `  opacity: ${el.opacity};\n`
    if (el.rotation) elCss += `  transform: rotate(${el.rotation}deg);\n`

    if (el.type !== 'text' && el.type !== 'image') {
      // Gradient (multi-stop aware)
      if (el.gradient?.stops?.length >= 2) {
        elCss += `  background: ${buildGradientCSS(el.gradient)};\n`
      } else if (el.gradient) {
        const g = el.gradient
        elCss += `  background: linear-gradient(${g.angle||135}deg, ${g.from||'#7c3aed'}, ${g.to||'#06b6d4'});\n`
      } else {
        elCss += `  background: ${el.fill};\n`
      }
      elCss += `  border-radius: ${el.borderRadius ?? (el.type==='circle'?50:8)}%;\n`
    }
    if (el.type === 'text') {
      elCss += `  color: ${el.fontColor || '#ffffff'};\n`
      elCss += `  font-size: ${el.fontSize || 20}px;\n`
      elCss += `  font-weight: ${el.fontWeight || 700};\n`
      elCss += `  display: flex;\n  align-items: center;\n  justify-content: center;\n`
    }
    if (el.shadow?.enabled) {
      const s = el.shadow
      elCss += `  box-shadow: ${s.x||0}px ${s.y||0}px ${s.blur||20}px ${s.color||'#7c3aed'};\n`
    }
    if (el.glow?.enabled) {
      elCss += `  filter: drop-shadow(0 0 ${el.glow.intensity||20}px ${el.glow.color||'#7c3aed'});\n`
    }
    const fx = el.effects
    if (fx) {
      const filters = []
      if (fx.blur>0)              filters.push(`blur(${fx.blur}px)`)
      if (fx.brightness!==100)    filters.push(`brightness(${fx.brightness}%)`)
      if (fx.contrast!==100)      filters.push(`contrast(${fx.contrast}%)`)
      if (fx.saturate!==100)      filters.push(`saturate(${fx.saturate}%)`)
      if (fx.hueRotate>0)         filters.push(`hue-rotate(${fx.hueRotate}deg)`)
      if (filters.length && !el.glow?.enabled) elCss += `  filter: ${filters.join(' ')};\n`
    }
    if (el.anim?.name && el.anim.name !== 'none') {
      const def = ANIMATIONS[el.anim.name]
      if (def?.css) {
        const animVal = typeof def.css==='function'
          ? def.css(el.anim.duration||2, el.anim.delay||0, el.anim.loop!==false)
          : def.css
        elCss += `  animation: ${animVal};\n`
        usedAnims.add(el.anim.name)
      }
    }
    if (el.borderAnim?.enabled) {
      const ba = el.borderAnim
      const BORDER_MAP = {
        neon:     `border:${ba.thickness}px solid ${ba.color};box-shadow:0 0 ${ba.glow}px ${ba.color};animation:ba-neon-pulse ${ba.speed}s ease-in-out infinite;`,
        electric: `border:${ba.thickness}px solid ${ba.color};animation:ba-electric ${ba.speed*0.3}s steps(2) infinite;`,
        pulse:    `border:${ba.thickness}px solid ${ba.color};animation:ba-border-pulse ${ba.speed}s ease-in-out infinite;`,
        dash:     `border:${ba.thickness}px dashed ${ba.color};animation:ba-dash-flow ${ba.speed}s linear infinite;`,
        fire:     `border:${ba.thickness}px solid ${ba.color};animation:ba-fire ${ba.speed*0.4}s ease-in-out infinite alternate;`,
        energy:   `border:${ba.thickness}px solid transparent;outline:${ba.thickness}px solid ${ba.color};animation:ba-energy ${ba.speed}s ease-in-out infinite;`,
        scan:     `border:${ba.thickness}px solid ${ba.color};animation:ba-scan ${ba.speed}s linear infinite;`,
      }
      const rule = BORDER_MAP[ba.type]
      if (rule) {
        rule.split(';').filter(Boolean).forEach(r => { elCss += `  ${r.trim()};\n` })
        usedBorderAnims.add(ba.type)
      }
    }
    elCss += `}\n\n`
    css += elCss

    const tag = el.type==='text' ? 'p' : 'div'
    html += `  <${tag} class="${cls}">${el.type==='text'?el.label:''}</${tag}>\n`
  })

  let kfCss = ''
  if (usedAnims.size)       kfCss += '\n/* Animation Keyframes */\n' + KEYFRAMES_CSS
  if (usedBorderAnims.size) kfCss += '\n/* Border Keyframes */\n'    + BORDER_KEYFRAMES

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>MotionZync Creation</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:${bgColor};overflow:hidden}
    .scene{position:relative;width:900px;height:580px;margin:0 auto}

${css}${kfCss}
  </style>
</head>
<body>
  <div class="scene">
${html}  </div>
</body>
</html>`

  return { html: fullHTML, cssOnly: css + kfCss }
}

// ─── React component export ────────────────────────────────────
export function generateReact(elements, bgColor = '#0a0a0f') {
  const visible = elements.filter(e => e.visible !== false)
  let out = `import React from 'react'\n\n`
  out += `// Generated by MotionZync Creator\n`
  out += `// Paste into your React project\n\n`
  out += `export default function AnimScene() {\n`
  out += `  return (\n`
  out += `    <div style={{background:'${bgColor}',position:'relative',width:900,height:580,overflow:'hidden'}}>\n`
  visible.forEach(el => {
    const s = _buildInlineStyle(el)
    const sStr = JSON.stringify(s, null, 6).replace(/"([^"]+)":/g,'$1:').replace(/"/g,"'")
    if (el.type==='text')
      out += `      <p style={${sStr}}>${el.label}</p>\n`
    else
      out += `      <div style={${sStr}}/>\n`
  })
  out += `    </div>\n  )\n}`
  return out
}

// ─── ✦ GSAP export (NEW) ──────────────────────────────────────
export function generateGSAP(elements, bgColor = '#0a0a0f') {
  const visible = elements.filter(e => e.visible !== false)
  let out = `// Generated by MotionZync Creator\n`
  out += `// Requires: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>\n\n`
  out += `const scene = document.querySelector('.scene')\n\n`
  out += `// Create elements\n`

  visible.forEach((el, i) => {
    const id   = `el${i+1}`
    const bg   = el.gradient?.stops?.length >= 2
      ? buildGradientCSS(el.gradient)
      : (el.fill || '#7c3aed')
    out += `const ${id} = document.createElement('${el.type==='text'?'p':'div'}')\n`
    out += `${id}.id = '${id}'\n`
    out += `Object.assign(${id}.style, {\n`
    out += `  position:'absolute', left:'${Math.round(el.x)}px', top:'${Math.round(el.y)}px',\n`
    out += `  width:'${el.width}px', height:'${el.height}px',\n`
    if (el.type !== 'text') {
      out += `  background:'${bg}',\n`
      out += `  borderRadius:'${el.borderRadius ?? (el.type==='circle'?50:8)}%',\n`
    } else {
      out += `  color:'${el.fontColor||'#fff'}', fontSize:'${el.fontSize||20}px',\n`
      out += `  fontWeight:'${el.fontWeight||700}', display:'flex', alignItems:'center', justifyContent:'center',\n`
    }
    out += `})\n`
    if (el.type==='text') out += `${id}.textContent = '${el.label}'\n`
    out += `scene.appendChild(${id})\n\n`
  })

  out += `// GSAP Animations\n`
  out += `const tl = gsap.timeline({ repeat:-1, yoyo:true })\n\n`

  visible.forEach((el, i) => {
    const id = `el${i+1}`
    if (el.anim?.name && el.anim.name !== 'none') {
      const dur = el.anim.duration || 2
      const delay = el.anim.delay || 0
      const ease  = _gsapEase(el.anim.easing)
      out += `// ${el.label} — ${el.anim.name}\n`
      out += `tl.from('#${id}', { opacity:0, y:30, duration:${dur}, delay:${delay}, ease:'${ease}' }, '<')\n`
    } else {
      out += `// ${el.label} — no animation\n`
    }
  })

  out += `\n// HTML Setup\n`
  out += `// <div class="scene" style="position:relative;width:900px;height:580px;background:${bgColor}"></div>\n`
  return out
}

// ─── ✦ Framer Motion export (NEW) ─────────────────────────────
export function generateFramerMotion(elements, bgColor = '#0a0a0f') {
  const visible = elements.filter(e => e.visible !== false)
  let out = `// Generated by MotionZync Creator\n`
  out += `// Requires: npm install framer-motion\n\n`
  out += `import { motion } from 'framer-motion'\n\n`
  out += `export default function AnimScene() {\n  return (\n`
  out += `    <div style={{background:'${bgColor}',position:'relative',width:900,height:580,overflow:'hidden'}}>\n`

  visible.forEach((el, i) => {
    const bg = el.gradient?.stops?.length >= 2
      ? buildGradientCSS(el.gradient)
      : (el.fill || '#7c3aed')
    const base = {
      position:'absolute', left:Math.round(el.x), top:Math.round(el.y),
      width:el.width, height:el.height,
    }
    if (el.type !== 'text') {
      base.background = bg
      base.borderRadius = `${el.borderRadius ?? (el.type==='circle'?50:8)}%`
    }
    const initial  = _framerInitial(el.anim?.name)
    const animate  = _framerAnimate(el.anim?.name)
    const trans    = `{{ duration:${el.anim?.duration||2}, delay:${el.anim?.delay||0}, repeat:Infinity, repeatType:'reverse' }}`
    const styleStr = JSON.stringify(base).replace(/"([^"]+)":/g,'$1:').replace(/"/g,"'")
    const tag = el.type==='text' ? 'motion.p' : 'motion.div'
    out += `      <${tag}\n`
    out += `        style={${styleStr}}\n`
    out += `        initial={${JSON.stringify(initial)}}\n`
    out += `        animate={${JSON.stringify(animate)}}\n`
    out += `        transition={${trans}}\n`
    out += `      >${el.type==='text'?el.label:''}</${tag}>\n`
  })
  out += `    </div>\n  )\n}`
  return out
}

// ─── JSON export ──────────────────────────────────────────────
export function generateJSON(elements, meta = {}) {
  return JSON.stringify({
    version:'2.0', created:new Date().toISOString(), tool:'MotionZync Creator', meta,
    elements: elements.map(e => ({
      id:e.id, type:e.type, label:e.label,
      x:Math.round(e.x), y:Math.round(e.y),
      width:e.width, height:e.height,
      rotation:e.rotation, opacity:e.opacity,
      fill:e.fill, gradient:e.gradient,
      borderRadius:e.borderRadius,
      anim:e.anim, borderAnim:e.borderAnim,
      physics:{ enabled:e.physics?.enabled, mode:e.physics?.mode },
      effects:e.effects, shadow:e.shadow, glow:e.glow,
      shader:e.shader, visible:e.visible, locked:e.locked,
    })),
  }, null, 2)
}

// ─── Helpers ─────────────────────────────────────────────────
function _buildInlineStyle(el) {
  const s = {
    position:'absolute', left:Math.round(el.x), top:Math.round(el.y),
    width:el.width, height:el.height, opacity:el.opacity,
    borderRadius: el.type==='circle' ? '50%' : `${el.borderRadius||8}%`,
  }
  if (el.rotation) s.transform = `rotate(${el.rotation}deg)`
  if (el.type!=='text') s.background = el.fill
  else { s.color=el.fontColor; s.fontSize=el.fontSize; s.fontWeight=el.fontWeight; s.display='flex'; s.alignItems='center'; s.justifyContent='center' }
  if (el.shadow?.enabled) s.boxShadow=`${el.shadow.x||0}px ${el.shadow.y||0}px ${el.shadow.blur}px ${el.shadow.color}`
  if (el.anim?.name && el.anim.name!=='none') {
    const def = ANIMATIONS[el.anim.name]
    if (def?.css) s.animation = typeof def.css==='function' ? def.css(el.anim.duration||2,el.anim.delay||0,el.anim.loop!==false) : def.css
  }
  return s
}

function _gsapEase(e) {
  const map = { 'ease-in-out':'power2.inOut', 'ease-in':'power2.in', 'ease-out':'power2.out', linear:'none', bounce:'bounce.out', elastic:'elastic.out' }
  return map[e] || 'power2.inOut'
}

function _framerInitial(name) {
  const map = {
    fadeIn:    { opacity:0 },
    slideUp:   { opacity:0, y:40 },
    slideDown: { opacity:0, y:-40 },
    slideLeft: { opacity:0, x:40 },
    slideRight:{ opacity:0, x:-40 },
    scaleIn:   { opacity:0, scale:0.5 },
    bounceIn:  { opacity:0, scale:0 },
    rotateIn:  { opacity:0, rotate:-180 },
    flipX:     { opacity:0, rotateX:90 },
    flipY:     { opacity:0, rotateY:90 },
  }
  return map[name] || { opacity:0 }
}

function _framerAnimate(name) {
  const map = {
    fadeIn:    { opacity:1 },
    slideUp:   { opacity:1, y:0 },
    slideDown: { opacity:1, y:0 },
    slideLeft: { opacity:1, x:0 },
    slideRight:{ opacity:1, x:0 },
    scaleIn:   { opacity:1, scale:1 },
    bounceIn:  { opacity:1, scale:1 },
    rotateIn:  { opacity:1, rotate:0 },
    flipX:     { opacity:1, rotateX:0 },
    flipY:     { opacity:1, rotateY:0 },
  }
  return map[name] || { opacity:1 }
}
