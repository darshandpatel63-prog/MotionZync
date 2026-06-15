// src/ai/skills/DesignSkillsPanel.jsx
// My UI Design — 134 Design Skills → AI Prompt Templates
// User selects a skill → AI generates content for that skill
// Mobile + Desktop both perfect

import { useState, useMemo } from 'react'
import './DesignSkillsPanel.css'

/** @type {Array<{id:string, category:string, icon:string, label:string, prompt:string, tags:string[]}>} */
const DESIGN_SKILLS = [
  // ── Web & UI Design ──────────────────────────────────
  { id:'web-landing',    category:'Web',       icon:'🌐', label:'Landing Page',       tags:['web','ui'],       prompt:'Design a premium SaaS landing page with hero section, features grid, testimonials, pricing table, and CTA. Use glassmorphism and dark theme.' },
  { id:'web-saas',       category:'Web',       icon:'⚡', label:'SaaS Dashboard',     tags:['web','dashboard'], prompt:'Create a modern SaaS admin dashboard with sidebar nav, KPI cards, data charts, recent activity, and dark theme with purple accent.' },
  { id:'web-portfolio',  category:'Web',       icon:'💼', label:'Portfolio',           tags:['web','creative'],  prompt:'Design a creative developer/designer portfolio with animated hero, project grid, skills section, and contact form. Premium dark theme.' },
  { id:'web-ecomm',      category:'Web',       icon:'🛒', label:'E-Commerce',         tags:['web','ecomm'],    prompt:'Create a premium e-commerce product page with image gallery, size selector, reviews, related products, and sticky add-to-cart.' },
  { id:'web-blog',       category:'Web',       icon:'📝', label:'Blog/Magazine',      tags:['web','content'],  prompt:'Design a premium editorial blog layout with featured article hero, category grid, author cards, and newsletter signup.' },
  { id:'web-auth',       category:'Web',       icon:'🔐', label:'Auth Pages',         tags:['web','auth'],     prompt:'Create beautiful login/signup pages with glassmorphism card, social auth buttons, and animated background gradient.' },
  { id:'web-pricing',    category:'Web',       icon:'💰', label:'Pricing Page',       tags:['web','marketing'],prompt:'Design a premium pricing page with 3-tier comparison cards, feature checklist, annual/monthly toggle, and FAQ section.' },

  // ── Mobile App Design ─────────────────────────────────
  { id:'mob-onboard',    category:'Mobile',    icon:'📱', label:'Onboarding Screens', tags:['mobile','ux'],    prompt:'Design 3 mobile onboarding screens with illustrations, feature highlights, progress dots, and CTA buttons. Premium dark theme.' },
  { id:'mob-home',       category:'Mobile',    icon:'🏠', label:'App Home Screen',    tags:['mobile','ui'],    prompt:'Create a premium mobile app home screen with greeting header, quick actions grid, featured cards, bottom nav bar.' },
  { id:'mob-profile',    category:'Mobile',    icon:'👤', label:'Profile Screen',     tags:['mobile','social'],prompt:'Design a beautiful mobile profile screen with cover image, avatar, stats row, post grid, and follow button.' },
  { id:'mob-feed',       category:'Mobile',    icon:'📰', label:'Social Feed',        tags:['mobile','social'],prompt:'Create a premium social media feed screen with story row, post cards, like/comment/share actions, and bottom navigation.' },
  { id:'mob-chat',       category:'Mobile',    icon:'💬', label:'Chat Screen',        tags:['mobile','social'],prompt:'Design a premium mobile chat screen with message bubbles, reactions, voice note, attachment picker, and typing indicator.' },
  { id:'mob-settings',   category:'Mobile',    icon:'⚙️', label:'Settings Screen',   tags:['mobile','ux'],    prompt:'Create a clean mobile settings screen with grouped sections, toggle switches, chevron links, and destructive danger zone.' },
  { id:'mob-payment',    category:'Mobile',    icon:'💳', label:'Payment Flow',       tags:['mobile','fintech'],prompt:'Design a premium mobile payment screen with card display, amount input, payment methods, biometric auth, and success animation.' },

  // ── Motion Graphics ───────────────────────────────────
  { id:'motion-intro',   category:'Motion',    icon:'🎬', label:'Intro Animation',    tags:['motion','brand'],  prompt:'Create a cinematic brand intro animation with logo reveal, particle effects, glitch transition, and dynamic title card.' },
  { id:'motion-lower',   category:'Motion',    icon:'📺', label:'Lower Third',        tags:['motion','video'],  prompt:'Design an animated lower third graphic with name/title reveal, accent line animation, and smooth exit transition.' },
  { id:'motion-transition',category:'Motion',  icon:'✨', label:'Scene Transition',   tags:['motion','video'],  prompt:'Create 5 unique scene transition animations: wipe, glitch, zoom blur, shatter, and light sweep. CSS + JS code.' },
  { id:'motion-title',   category:'Motion',    icon:'🎯', label:'Kinetic Title',      tags:['motion','text'],   prompt:'Create kinetic typography animation with each letter animating independently. Stagger, bounce, and glow effects.' },
  { id:'motion-ui',      category:'Motion',    icon:'🔄', label:'UI Microanimations', tags:['motion','ui'],     prompt:'Generate 8 premium UI microanimations: button click, form focus, card hover, loader, success check, error shake, menu open, modal enter.' },
  { id:'motion-logo',    category:'Motion',    icon:'🌟', label:'Logo Animation',     tags:['motion','brand'],  prompt:'Design a premium logo animation with draw-on stroke effect, particle burst, color shift, and settle with glow.' },

  // ── Illustrations ─────────────────────────────────────
  { id:'illus-hero',     category:'Illustration',icon:'🎨',label:'Hero Illustration', tags:['illustration','web'],prompt:'Describe and create an SVG hero illustration for a tech startup: isometric 3D office, floating UI elements, gradient background.' },
  { id:'illus-icons',    category:'Illustration',icon:'🔷',label:'Icon System',       tags:['illustration','ui'],prompt:'Design a consistent 24-icon system for a SaaS app. Outline style, 24x24, rounded corners, 2px stroke, purple accent.' },
  { id:'illus-empty',    category:'Illustration',icon:'📭',label:'Empty States',      tags:['illustration','ux'],prompt:'Create 4 charming empty state illustrations: no results, no notifications, no files, success. Friendly, modern, SVG.' },
  { id:'illus-char',     category:'Illustration',icon:'👾',label:'Character Design',  tags:['illustration','brand'],prompt:'Design a brand mascot character: friendly robot/creature, multiple expressions (happy, thinking, error), SVG style.' },

  // ── Brand Design ──────────────────────────────────────
  { id:'brand-identity', category:'Brand',     icon:'✦',  label:'Brand Identity',    tags:['brand','logo'],   prompt:'Create a complete brand identity system: logo concept, color palette, typography pairing, usage guidelines, mockups.' },
  { id:'brand-palette',  category:'Brand',     icon:'🎨', label:'Color System',       tags:['brand','design'], prompt:'Design a 5-scale color system (primary, secondary, neutral, success, error) with exact hex values, accessibility ratios, usage rules.' },
  { id:'brand-type',     category:'Brand',     icon:'Aa',  label:'Typography System', tags:['brand','design'], prompt:'Create a premium typography system: heading font + body font pairing, scale (h1-h6 + body + caption), weight, line-height.' },
  { id:'brand-voice',    category:'Brand',     icon:'📢', label:'Brand Voice',        tags:['brand','content'],prompt:'Define brand voice and tone guidelines: personality traits, do/don\'t examples, taglines, content principles.' },

  // ── CSS Effects ───────────────────────────────────────
  { id:'css-glass',      category:'CSS',       icon:'💎', label:'Glassmorphism',      tags:['css','effect'],   prompt:'Generate a stunning glassmorphism card component with blur, transparency layers, border glow, and floating elements. Pure CSS.' },
  { id:'css-neuro',      category:'CSS',       icon:'🔘', label:'Neumorphism',        tags:['css','effect'],   prompt:'Create a neumorphic UI element with soft shadow inset/outset system, dark mode version, and interactive states.' },
  { id:'css-gradient',   category:'CSS',       icon:'🌈', label:'Gradient System',    tags:['css','design'],   prompt:'Generate 10 premium gradient combinations: mesh, linear, radial, conic, animated. CSS code with hex values.' },
  { id:'css-animation',  category:'CSS',       icon:'⚡', label:'Animation Pack',     tags:['css','animation'],prompt:'Create a 12-animation CSS pack: fade, slide, zoom, flip, bounce, shake, pulse, spin, wave, glitch, neon flicker, morph.' },
  { id:'css-particle',   category:'CSS',       icon:'✨', label:'Particle Effect',    tags:['css','animation'],prompt:'Generate a pure CSS/JS particle system with 50 floating dots, mouse interaction, color shift, and smooth performance.' },

  // ── AI Art Prompts ────────────────────────────────────
  { id:'ai-concept',     category:'AI Art',    icon:'🤖', label:'Concept Art',        tags:['ai','art'],       prompt:'Create a detailed AI art prompt for futuristic concept art: cyberpunk city, neon lights, rain reflection, cinematic composition.' },
  { id:'ai-product',     category:'AI Art',    icon:'📦', label:'Product Mockup',     tags:['ai','art'],       prompt:'Generate an AI prompt for premium product photography: floating device mockup, gradient background, soft shadow, studio lighting.' },
  { id:'ai-portrait',    category:'AI Art',    icon:'🖼', label:'Digital Portrait',   tags:['ai','art'],       prompt:'Create a detailed AI portrait prompt: stylized character, painterly style, dramatic lighting, detailed textures, bokeh background.' },
  { id:'ai-bg',          category:'AI Art',    icon:'🌌', label:'Background Scene',   tags:['ai','background'],prompt:'Generate 5 premium AI background prompts: aurora borealis, deep ocean, cosmic nebula, misty forest, desert sunrise.' },

  // ── 3D Design ─────────────────────────────────────────
  { id:'3d-scene',       category:'3D',        icon:'🌎', label:'3D Scene',           tags:['3d','design'],    prompt:'Design a complete Three.js 3D scene: floating crystal objects, HDR lighting, subtle particle system, camera orbit animation. Include full code.' },
  { id:'3d-logo',        category:'3D',        icon:'💠', label:'3D Logo',            tags:['3d','brand'],     prompt:'Create Three.js code for a spinning 3D logo: extruded text geometry, metallic material, point light, orbit controls.' },
  { id:'3d-product',     category:'3D',        icon:'📱', label:'3D Product Viewer',  tags:['3d','ecomm'],     prompt:'Build a Three.js 3D product viewer: GLTF model loader, drag to rotate, pinch to zoom, environment lighting, mobile touch.' },
  { id:'3d-bg',          category:'3D',        icon:'🌐', label:'3D Background',      tags:['3d','web'],       prompt:'Generate Three.js animated background: floating geometric shapes, wireframe sphere, gradient fog, mouse parallax effect.' },

  // ── Game Design ───────────────────────────────────────
  { id:'game-ui',        category:'Game',      icon:'🎮', label:'Game HUD',           tags:['game','ui'],      prompt:'Design a premium game HUD: health/mana bars, minimap, inventory slots, ability icons, kill counter. Dark fantasy theme.' },
  { id:'game-menu',      category:'Game',      icon:'🕹', label:'Main Menu',          tags:['game','ui'],      prompt:'Create a cinematic game main menu with animated background, title logo, menu options, particle effects, ambient sound note.' },
  { id:'game-loading',   category:'Game',      icon:'⏳', label:'Loading Screen',     tags:['game','ui'],      prompt:'Design a premium game loading screen: progress bar, rotating emblem, loading tips, animated background, percentage.' },
]

const CATEGORIES = ['All', ...new Set(DESIGN_SKILLS.map(s => s.category))]

/**
 * @param {{ onSelectSkill: (skill: Object) => void }} props
 */
export default function DesignSkillsPanel({ onSelectSkill }) {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return DESIGN_SKILLS.filter(s => {
      const matchCat = category === 'All' || s.category === category
      const matchSrc = !search ||
        s.label.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchSrc
    })
  }, [search, category])

  const handleSelect = (skill) => {
    setSelected(skill.id)
    onSelectSkill?.(skill)
  }

  return (
    <div className="dsp-root">

      {/* Search */}
      <div className="dsp-search-wrap">
        <input type="text" className="dsp-search"
          placeholder="🔍  Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* Category chips — My UI Design protocol-chips pattern */}
      <div className="protocol-chips dsp-cats">
        {CATEGORIES.map(cat => (
          <button key={cat}
            className={`protocol-chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="dsp-count hint">
        {filtered.length} skills
      </div>

      {/* Skills grid */}
      <div className="dsp-grid">
        {filtered.map(skill => (
          <button key={skill.id}
            className={`dsp-skill-card ${selected === skill.id ? 'selected' : ''}`}
            onClick={() => handleSelect(skill)}>
            <span className="dsp-skill-icon">{skill.icon}</span>
            <span className="dsp-skill-label">{skill.label}</span>
            <span className="dsp-skill-cat">{skill.category}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="empty-card" style={{ gridColumn:'1/-1' }}>
            No skills found for "{search}"
          </div>
        )}
      </div>
    </div>
  )
}

// Export skill list for use in AIStudio
export { DESIGN_SKILLS }
   
