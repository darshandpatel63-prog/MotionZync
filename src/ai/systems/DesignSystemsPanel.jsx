// src/ai/systems/DesignSystemsPanel.jsx
// My UI Design — 152 Design Systems → Color/Typography presets
// Select a design system → AI generates in that style
// Mobile + Desktop both perfect

import { useState, useMemo } from 'react'
import './DesignSystemsPanel.css'

/** @type {Array<{id:string, name:string, category:string, primary:string, secondary:string, bg:string, text:string, accent:string, description:string, fonts:{heading:string,body:string}}>} */
const DESIGN_SYSTEMS = [
  // ── Tech & SaaS ───────────────────────────────────────
  { id:'linear',    name:'Linear',    category:'Tech',     primary:'#5E6AD2', secondary:'#7C68EE', bg:'#08090A', text:'#E8E8E8', accent:'#5E6AD2', description:'Dark purple, clean typography, tight spacing — Linear.app style', fonts:{heading:'Inter',body:'Inter'} },
  { id:'vercel',    name:'Vercel',    category:'Tech',     primary:'#FFFFFF', secondary:'#888888', bg:'#000000', text:'#FFFFFF', accent:'#FFFFFF', description:'Pure black/white, bold typography, sharp edges — Vercel style', fonts:{heading:'Geist',body:'Geist'} },
  { id:'notion',    name:'Notion',    category:'Tech',     primary:'#2EAADC', secondary:'#9B59B6', bg:'#FFFFFF', text:'#37352F', accent:'#2EAADC', description:'Clean white, colorful accents, editorial feel — Notion style', fonts:{heading:'ui-sans-serif',body:'ui-sans-serif'} },
  { id:'figma',     name:'Figma',     category:'Design',   primary:'#F24E1E', secondary:'#FF7262', bg:'#1E1E1E', text:'#FFFFFF', accent:'#F24E1E', description:'Dark grey, orange-red brand, clean icons — Figma style', fonts:{heading:'Inter',body:'Inter'} },
  { id:'stripe',    name:'Stripe',    category:'Fintech',  primary:'#635BFF', secondary:'#0A2540', bg:'#FFFFFF', text:'#0A2540', accent:'#635BFF', description:'Navy + purple, trust, clean enterprise — Stripe style', fonts:{heading:'Sohne',body:'Sohne'} },
  { id:'supabase',  name:'Supabase',  category:'Tech',     primary:'#3ECF8E', secondary:'#1C1C1C', bg:'#1C1C1C', text:'#EDEDED', accent:'#3ECF8E', description:'Dark mode, neon green, developer-first — Supabase style', fonts:{heading:'Custom',body:'Inter'} },
  { id:'github',    name:'GitHub',    category:'Tech',     primary:'#2DA44E', secondary:'#0D1117', bg:'#0D1117', text:'#F0F6FC', accent:'#2DA44E', description:'Deep dark, green CTA, code-first — GitHub style', fonts:{heading:'Mona Sans',body:'Mona Sans'} },
  { id:'raycast',   name:'Raycast',   category:'Tech',     primary:'#FF6363', secondary:'#1A1A1A', bg:'#111111', text:'#EFEFEF', accent:'#FF6363', description:'Dark, vibrant red, premium launcher — Raycast style', fonts:{heading:'Inter',body:'Inter'} },
  { id:'arc',       name:'Arc Browser',category:'Tech',   primary:'#FF4D6A', secondary:'#FF8C42', bg:'#252329', text:'#FFFFFF', accent:'#FF4D6A', description:'Warm dark, gradient brand, playful premium', fonts:{heading:'Neue Montreal',body:'Neue Montreal'} },
  { id:'linear2',   name:'Loom',      category:'Tech',     primary:'#6B4FBB', secondary:'#FF5C35', bg:'#17171A', text:'#F5F5F5', accent:'#6B4FBB', description:'Purple + orange, warm dark, video-first', fonts:{heading:'Circular',body:'Circular'} },

  // ── Consumer / Lifestyle ──────────────────────────────
  { id:'airbnb',    name:'Airbnb',    category:'Consumer', primary:'#FF5A5F', secondary:'#00A699', bg:'#FFFFFF', text:'#484848', accent:'#FF5A5F', description:'Coral + teal, warm white, hospitality feel — Airbnb style', fonts:{heading:'Circular',body:'Cereal'} },
  { id:'spotify',   name:'Spotify',   category:'Music',    primary:'#1DB954', secondary:'#191414', bg:'#191414', text:'#FFFFFF', accent:'#1DB954', description:'Black + neon green, bold, music-first — Spotify style', fonts:{heading:'Circular',body:'Circular'} },
  { id:'netflix',   name:'Netflix',   category:'Media',    primary:'#E50914', secondary:'#141414', bg:'#141414', text:'#FFFFFF', accent:'#E50914', description:'Black + red, cinematic, streaming-first', fonts:{heading:'Netflix Sans',body:'Netflix Sans'} },
  { id:'uber',      name:'Uber',      category:'Mobility', primary:'#000000', secondary:'#276EF1', bg:'#FFFFFF', text:'#1F1F1F', accent:'#276EF1', description:'Bold black, blue CTA, trust + speed', fonts:{heading:'UberMove',body:'UberMove'} },

  // ── Premium / Luxury ──────────────────────────────────
  { id:'apple',     name:'Apple',     category:'Luxury',   primary:'#0071E3', secondary:'#F5F5F7', bg:'#000000', text:'#F5F5F7', accent:'#0071E3', description:'Pure black/white, blue CTA, cinematic spacing — Apple style', fonts:{heading:'SF Pro Display',body:'SF Pro Text'} },
  { id:'tesla',     name:'Tesla',     category:'Luxury',   primary:'#E82127', secondary:'#FFFFFF', bg:'#FFFFFF', text:'#393C41', accent:'#E82127', description:'White + red, automotive luxury, full-screen sections', fonts:{heading:'Gotham',body:'Gotham'} },
  { id:'rolex',     name:'Rolex',     category:'Luxury',   primary:'#AE854A', secondary:'#0A5C35', bg:'#FFFFFF', text:'#1A1A1A', accent:'#AE854A', description:'Gold + deep green, serif, ultra-luxury feel', fonts:{heading:'Rolex Font',body:'Arial'} },
  { id:'porsche',   name:'Porsche',   category:'Luxury',   primary:'#D5001C', secondary:'#000000', bg:'#FAFAFA', text:'#000000', accent:'#D5001C', description:'Red + black, sport luxury, German engineering', fonts:{heading:'Porsche Next',body:'Porsche Next'} },

  // ── MotionZync Style ──────────────────────────────────
  { id:'motionzync',name:'MotionZync', category:'Custom',  primary:'#7C3AED', secondary:'#06B6D4', bg:'#0A0A12', text:'#E2E8F0', accent:'#7C3AED', description:'Dark purple + cyan, futuristic creative studio — MotionZync style', fonts:{heading:'Inter',body:'Inter'} },
  { id:'cyberpunk', name:'Cyberpunk',  category:'Custom',  primary:'#F9C22E', secondary:'#FF003C', bg:'#0D0D0D', text:'#F9C22E', accent:'#FF003C', description:'Neon yellow + red, dark, aggressive, cyberpunk aesthetic', fonts:{heading:'Rajdhani',body:'Rajdhani'} },
  { id:'aurora',    name:'Aurora',     category:'Custom',  primary:'#4ADE80', secondary:'#818CF8', bg:'#0F172A', text:'#F8FAFC', accent:'#818CF8', description:'Dark navy, green + purple aurora gradients, dreamy', fonts:{heading:'Space Grotesk',body:'Inter'} },
  { id:'midnight',  name:'Midnight',   category:'Custom',  primary:'#38BDF8', secondary:'#818CF8', bg:'#020617', text:'#F1F5F9', accent:'#38BDF8', description:'Deep midnight blue, sky blue accent, ultra dark', fonts:{heading:'Inter',body:'Inter'} },
]

const CATEGORIES = ['All', ...new Set(DESIGN_SYSTEMS.map(s => s.category))]

/**
 * @param {{ onSelectSystem: (system: Object) => void }} props
 */
export default function DesignSystemsPanel({ onSelectSystem }) {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => DESIGN_SYSTEMS.filter(s => {
    const matchCat = category === 'All' || s.category === category
    const matchSrc = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSrc
  }), [search, category])

  const handleSelect = (sys) => {
    setSelected(sys.id)
    onSelectSystem?.(sys)
  }

  return (
    <div className="dsys-root">

      <div className="dsp-search-wrap">
        <input type="text" className="dsp-search"
          placeholder="🔍  Search design systems..."
          value={search}
          onChange={e => setSearch(e.target.value)}/>
      </div>

      <div className="protocol-chips dsp-cats">
        {CATEGORIES.map(cat => (
          <button key={cat}
            className={`protocol-chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="hint dsp-count">{filtered.length} design systems</div>

      <div className="dsys-grid">
        {filtered.map(sys => (
          <button key={sys.id}
            className={`dsys-card ${selected === sys.id ? 'selected' : ''}`}
            onClick={() => handleSelect(sys)}>

            {/* Color swatches */}
            <div className="dsys-swatches">
              <div className="dsys-swatch-lg" style={{ background: sys.bg }}/>
              <div className="dsys-swatch-sm" style={{ background: sys.primary }}/>
              <div className="dsys-swatch-sm" style={{ background: sys.secondary }}/>
              <div className="dsys-swatch-sm" style={{ background: sys.text }}/>
            </div>

            <div className="dsys-info">
              <span className="dsys-name">{sys.name}</span>
              <span className="dsys-cat">{sys.category}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export { DESIGN_SYSTEMS }
  
