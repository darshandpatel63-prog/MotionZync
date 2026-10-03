// MotionZync Design Intelligence — server-only special-effects capability.
// This is a bounded API capability, not a catalog/database. Definitions stay server-only
// so the API-only Ultra Premium+ contract cannot be bypassed through the public browser bundle.

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value))
const numberOption=(value,fallback,min,max)=>{
  const numeric=Number(value)
  return Number.isFinite(numeric)?clamp(numeric,min,max):fallback
}

const EFFECTS=Object.freeze({
  shimmer:{
    id:'shimmer',
    name:'Shimmer',
    description:'A moving highlight sweep for loading placeholders, cards or featured surfaces.',
    build:({duration,angle})=>({
      className:'mzfx-shimmer',
      css:[
        '.mzfx-shimmer{position:relative;overflow:hidden;background-image:linear-gradient('+(angle)+'deg,transparent 0%,rgba(255,255,255,.08) 42%,rgba(255,255,255,.46) 50%,rgba(255,255,255,.08) 58%,transparent 100%);background-size:220% 100%;animation:mzfx-shimmer '+duration+'s linear infinite;}',
        '@keyframes mzfx-shimmer{0%{background-position:200% 0}100%{background-position:-20% 0}}',
        '@media (prefers-reduced-motion:reduce){.mzfx-shimmer{animation:none;background-position:50% 0}}',
      ].join('\n'),
    }),
    defaults:{duration:1.8,angle:12},
    options:{duration:[.6,6],angle:[-180,180]},
  },
  float:{
    id:'float',
    name:'Float',
    description:'A gentle vertical drift for elevated cards, decorative objects or hero elements.',
    build:({duration,distance})=>({
      className:'mzfx-float',
      css:[
        '.mzfx-float{animation:mzfx-float '+duration+'s ease-in-out infinite;}',
        '@keyframes mzfx-float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-'+distance+'px,0)}}',
        '@media (prefers-reduced-motion:reduce){.mzfx-float{animation:none}}',
      ].join('\n'),
    }),
    defaults:{duration:4,distance:10},
    options:{duration:[1,10],distance:[2,32]},
  },
  glowPulse:{
    id:'glowPulse',
    name:'Glow Pulse',
    description:'A restrained ambient glow that pulses around an element without changing layout.',
    build:({duration,blur})=>({
      className:'mzfx-glow-pulse',
      css:[
        '.mzfx-glow-pulse{animation:mzfx-glow-pulse '+duration+'s ease-in-out infinite;}',
        '@keyframes mzfx-glow-pulse{0%,100%{box-shadow:0 0 '+Math.round(blur*.55)+'px rgba(99,102,241,.16)}50%{box-shadow:0 0 '+blur+'px rgba(99,102,241,.46)}}',
        '@media (prefers-reduced-motion:reduce){.mzfx-glow-pulse{animation:none;box-shadow:0 0 '+Math.round(blur*.55)+'px rgba(99,102,241,.16)}}',
      ].join('\n'),
    }),
    defaults:{duration:3,blur:22},
    options:{duration:[1,8],blur:[4,48]},
  },
  gradientShift:{
    id:'gradientShift',
    name:'Gradient Shift',
    description:'A slow ambient gradient movement for backgrounds, banners or visual focal areas.',
    build:({duration})=>({
      className:'mzfx-gradient-shift',
      css:[
        '.mzfx-gradient-shift{background-size:240% 240%;background-image:linear-gradient(120deg,#312e81,#0f766e,#7c3aed,#0f172a);animation:mzfx-gradient-shift '+duration+'s ease-in-out infinite;}',
        '@keyframes mzfx-gradient-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',
        '@media (prefers-reduced-motion:reduce){.mzfx-gradient-shift{animation:none;background-position:50% 50%}}',
      ].join('\n'),
    }),
    defaults:{duration:8},
    options:{duration:[2,20]},
  },
  spin:{
    id:'spin',
    name:'Spin',
    description:'A full-turn rotation for icons, indicators or decorative circular elements.',
    build:({duration})=>({
      className:'mzfx-spin',
      css:[
        '.mzfx-spin{transform-origin:center;animation:mzfx-spin '+duration+'s linear infinite;}',
        '@keyframes mzfx-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
        '@media (prefers-reduced-motion:reduce){.mzfx-spin{animation:none}}',
      ].join('\n'),
    }),
    defaults:{duration:4},
    options:{duration:[.8,20]},
  },
})

export const SPECIAL_EFFECTS_API_VERSION='1.0'

export function listSpecialEffects(){
  return Object.values(EFFECTS).map(effect=>({
    id:effect.id,
    name:effect.name,
    description:effect.description,
    optionRanges:Object.fromEntries(Object.entries(effect.options).map(([key,[min,max]])=>[key,{min,max}]))
  }))
}

export function createSpecialEffect(effectId,options={}){
  const effect=EFFECTS[String(effectId||'')]
  if(!effect){
    const error=new Error('Unknown special effect')
    error.status=400
    throw error
  }
  const safe={}
  for(const [key,[min,max]] of Object.entries(effect.options)){
    const fallback=effect.defaults[key]
    safe[key]=numberOption(options?.[key],fallback,min,max)
  }
  const result=effect.build(safe)
  return {
    apiVersion:SPECIAL_EFFECTS_API_VERSION,
    effect:{
      id:effect.id,
      name:effect.name,
      description:effect.description,
    },
    options:safe,
    output:{
      className:result.className,
      format:'css',
      css:result.css,
      executableScript:false,
    },
    accessibility:{
      reducedMotionFallback:true,
      guidance:'Respect prefers-reduced-motion and do not use animation as the sole source of meaning or state.',
    },
  }
}
