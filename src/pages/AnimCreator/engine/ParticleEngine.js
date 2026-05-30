// ParticleEngine.js — NEW (Feature 9)
// CPU-friendly canvas particle system
// Presets: smoke · stars · sparks · rain · snow · fire · dust · energy · confetti

// ─── Particle preset definitions ─────────────────────────────
export const PARTICLE_PRESETS = {
  stars: {
    label:'⭐ Stars',      count:80,  color:'#ffffff', size:[1,3],
    speed:[0.1,0.4],       life:[4,8], gravity:0,      spread:360,
    opacity:[0.4,1],       fade:true,  twinkle:true,   shape:'circle',
    emitMode:'area',       burst:false,
  },
  sparks: {
    label:'✨ Sparks',     count:40,  color:'#fbbf24', size:[1,4],
    speed:[1.5,4],         life:[0.4,1.2], gravity:0.15, spread:360,
    opacity:[0.7,1],       fade:true,  twinkle:false,  shape:'circle',
    emitMode:'point',      burst:true,
  },
  smoke: {
    label:'💨 Smoke',      count:25,  color:'#9ca3af', size:[6,18],
    speed:[0.3,0.8],       life:[2,4], gravity:-0.04,  spread:40,
    opacity:[0.08,0.22],   fade:true,  twinkle:false,  shape:'circle',
    emitMode:'point',      burst:false, growOnLife:true,
  },
  fire: {
    label:'🔥 Fire',       count:50,  color:'#f97316', size:[4,12],
    speed:[0.8,2],         life:[0.6,1.4], gravity:-0.12, spread:30,
    opacity:[0.6,0.9],     fade:true,  twinkle:false,  shape:'circle',
    emitMode:'point',      burst:false, colorShift:['#f97316','#ef4444','#fbbf24'],
  },
  rain: {
    label:'🌧 Rain',       count:60,  color:'#93c5fd', size:[1,2],
    speed:[4,7],           life:[0.6,1.2], gravity:0.3, spread:8,
    opacity:[0.3,0.7],     fade:false, twinkle:false,  shape:'line',
    emitMode:'top',        burst:false, angle:85,
  },
  snow: {
    label:'❄ Snow',        count:50,  color:'#e2e8f0', size:[2,5],
    speed:[0.3,0.9],       life:[3,7], gravity:0.03,   spread:20,
    opacity:[0.5,0.9],     fade:true,  twinkle:true,   shape:'circle',
    emitMode:'top',        burst:false, wobble:true,
  },
  dust: {
    label:'🌫 Dust',       count:35,  color:'#d97706', size:[1,3],
    speed:[0.2,0.6],       life:[3,6], gravity:-0.01,  spread:360,
    opacity:[0.1,0.35],    fade:true,  twinkle:false,  shape:'circle',
    emitMode:'area',       burst:false,
  },
  energy: {
    label:'⚡ Energy',     count:45,  color:'#7c3aed', size:[2,5],
    speed:[1,3],           life:[0.5,1.5], gravity:0,  spread:360,
    opacity:[0.6,1],       fade:true,  twinkle:true,   shape:'circle',
    emitMode:'point',      burst:false, colorShift:['#7c3aed','#06b6d4','#a78bfa'],
  },
  confetti: {
    label:'🎊 Confetti',   count:60,  color:'#f97316', size:[4,8],
    speed:[1,3],           life:[2,4], gravity:0.08,   spread:360,
    opacity:[0.8,1],       fade:true,  twinkle:false,  shape:'rect',
    emitMode:'point',      burst:true, colorShift:['#f97316','#ec4899','#7c3aed','#06b6d4','#10b981','#fbbf24'],
  },
  magic: {
    label:'🪄 Magic',      count:55,  color:'#a78bfa', size:[2,6],
    speed:[0.5,2],         life:[1,3], gravity:-0.03,  spread:360,
    opacity:[0.5,1],       fade:true,  twinkle:true,   shape:'star',
    emitMode:'area',       burst:false, colorShift:['#a78bfa','#f9a8d4','#67e8f9'],
  },
}

export const PRESET_NAMES = Object.keys(PARTICLE_PRESETS)

// ─── Single particle factory ──────────────────────────────────
function makeParticle(preset, emitterX, emitterY, stageW, stageH,
                      speedMult=1, sizeMult=1, opacMult=1, lifeMult=1) {
  const p  = preset
  const angle = p.emitMode === 'top'
    ? (p.angle || 90) + (Math.random()-0.5) * p.spread
    : Math.random() * 360
  const rad   = angle * Math.PI / 180
  let sx = emitterX, sy = emitterY

  if (p.emitMode === 'area') {
    sx = Math.random() * stageW
    sy = Math.random() * stageH
  } else if (p.emitMode === 'top') {
    sx = Math.random() * stageW
    sy = -10
  }

  const life   = _rand(p.life[0],    p.life[1])    * lifeMult
  const size   = _rand(p.size[0],    p.size[1])    * sizeMult
  const spd    = _rand(p.speed[0],   p.speed[1])   * speedMult
  const opBase = _rand(p.opacity[0], p.opacity[1]) * opacMult
  const color  = p.colorShift
    ? p.colorShift[Math.floor(Math.random()*p.colorShift.length)]
    : p.color

  return {
    x:    sx, y: sy,
    vx:   Math.cos(rad) * spd,
    vy:   Math.sin(rad) * spd,
    size, color,
    maxLife: life, life,
    opacity: Math.min(1, opBase),
    maxOpacity: Math.min(1, opBase),
    wobblePhase: Math.random() * Math.PI * 2,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random()-0.5) * 4,
    scale: 1,
  }
}

function _rand(a, b) { return a + Math.random() * (b - a) }

// ─── ParticleSystem class ─────────────────────────────────────
// Used by ParticleCanvas component
export class ParticleSystem {
  constructor(presetName, emitterX, emitterY, stageW, stageH, overrides = {}) {
    const base     = PARTICLE_PRESETS[presetName] || PARTICLE_PRESETS.stars
    // Apply panel fine-tune overrides
    this.preset    = {
      ...base,
      count:   overrides.count    !== undefined ? overrides.count    : base.count,
      gravity: overrides.gravity  !== undefined ? overrides.gravity  : base.gravity,
    }
    if (overrides.colorOverride) {
      this.preset.color      = overrides.colorOverride
      this.preset.colorShift = null  // disable color shift when custom color set
    }
    this.speedMult  = overrides.speed   ?? 1
    this.sizeMult   = overrides.size    ?? 1
    this.opacMult   = overrides.opacity ?? 1
    this.lifeMult   = overrides.life    ?? 1
    this.presetName= presetName
    this.emitterX  = emitterX
    this.emitterY  = emitterY
    this.stageW    = stageW
    this.stageH    = stageH
    this.particles = []
    this.active    = true
    this.elapsed   = 0
    this.emitAccum = 0

    // Spawn initial burst
    if (this.preset.burst) this._burst()
    else this._fillInitial()
  }

  _fillInitial() {
    for (let i = 0; i < this.preset.count; i++) {
      const p = makeParticle(this.preset, this.emitterX, this.emitterY,
        this.stageW, this.stageH, this.speedMult, this.sizeMult, this.opacMult, this.lifeMult)
      p.life = Math.random() * p.maxLife
      this.particles.push(p)
    }
  }

  _burst() {
    for (let i = 0; i < this.preset.count; i++)
      this.particles.push(makeParticle(this.preset, this.emitterX, this.emitterY,
        this.stageW, this.stageH, this.speedMult, this.sizeMult, this.opacMult, this.lifeMult))
  }

  update(dt) {
    if (!this.active) return
    const p   = this.preset
    const g   = p.gravity || 0
    const fps = 60

    // Emit new particles at steady rate
    if (!p.burst) {
      this.emitAccum += p.count * dt
      while (this.emitAccum >= 1 && this.particles.length < p.count * 2) {
        this.particles.push(makeParticle(p, this.emitterX, this.emitterY,
          this.stageW, this.stageH, this.speedMult, this.sizeMult, this.opacMult, this.lifeMult))
        this.emitAccum--
      }
    }

    // Update existing particles
    this.particles = this.particles.filter(pt => {
      pt.life -= dt
      if (pt.life <= 0) return false

      // Physics
      pt.vy  += g
      if (p.wobble) pt.vx += Math.sin(pt.wobblePhase + pt.life * 2) * 0.04
      pt.x   += pt.vx
      pt.y   += pt.vy
      pt.wobblePhase += 0.05

      // Fade
      const lifeRatio = pt.life / pt.maxLife
      if (p.fade) pt.opacity = pt.maxOpacity * Math.min(lifeRatio * 2, 1)
      if (p.growOnLife) pt.scale = 1 + (1 - lifeRatio) * 2

      // Rotation for rects
      pt.rotation += pt.rotSpeed

      // Wrap horizontally for rain/snow
      if (p.emitMode === 'top') {
        if (pt.x < -20)         pt.x = this.stageW + 20
        if (pt.x > this.stageW + 20) pt.x = -20
        if (pt.y > this.stageH + 20) return false
      }

      return true
    })
  }

  draw(ctx) {
    const p = this.preset
    ctx.save()

    this.particles.forEach(pt => {
      ctx.save()
      ctx.globalAlpha = Math.max(0, Math.min(1, pt.opacity))
      ctx.translate(pt.x, pt.y)
      if (pt.rotation) ctx.rotate(pt.rotation * Math.PI / 180)
      const s = pt.size * (pt.scale || 1)

      if (p.shape === 'circle' || !p.shape) {
        ctx.beginPath()
        ctx.arc(0, 0, s/2, 0, Math.PI*2)
        ctx.fillStyle = pt.color
        // Glow for energy/magic/sparks
        if (['energy','magic','sparks','fire'].includes(this.presetName)) {
          ctx.shadowColor = pt.color
          ctx.shadowBlur  = s * 2
        }
        ctx.fill()

      } else if (p.shape === 'rect') {
        ctx.fillStyle = pt.color
        ctx.fillRect(-s/2, -s/3, s, s*0.6)

      } else if (p.shape === 'line') {
        ctx.strokeStyle = pt.color
        ctx.lineWidth   = s * 0.4
        ctx.beginPath()
        ctx.moveTo(0, -s)
        ctx.lineTo(0,  s * 2)
        ctx.stroke()

      } else if (p.shape === 'star') {
        _drawStar(ctx, 0, 0, 3, s/2, s/4)
        ctx.fillStyle = pt.color
        ctx.shadowColor= pt.color
        ctx.shadowBlur = s
        ctx.fill()
      }

      ctx.restore()
    })

    ctx.restore()
  }
}

// ─── Draw a 5-point star ──────────────────────────────────────
function _drawStar(ctx, cx, cy, points, outer, inner) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const ang = (i * Math.PI) / points - Math.PI/2
    const r   = i % 2 === 0 ? outer : inner
    i === 0 ? ctx.moveTo(cx + r*Math.cos(ang), cy + r*Math.sin(ang))
            : ctx.lineTo(cx + r*Math.cos(ang), cy + r*Math.sin(ang))
  }
  ctx.closePath()
}

    
