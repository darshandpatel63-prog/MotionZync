import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'

// ─── ANIMCREATOR SECTIONS ────────────────────────────────────────────────────
const ANIM_SECTIONS = [
  {
    id:'ac-overview', icon:'🎬', title:'What is AnimCreator?',
    content: `AnimCreator is MotionZync's professional visual animation design suite — built directly in your browser with zero installation required. Think of it as a simplified Figma or Adobe Animate, specifically designed for creating CSS and JavaScript web animations.

You draw shapes on a canvas, assign animation behaviors, configure physics, add particle effects, build gradients, manage layers, and export production-ready CSS + JavaScript code. No deep coding experience required for Simple Mode. Pro Mode unlocks the full timeline and physics engine.`
  },
  {
    id:'ac-canvas', icon:'🖼️', title:'Canvas & Workspace',
    items: [
      { label:'Canvas Area', desc:'The main white workspace where you draw and preview animations. Drag elements directly on the canvas.' },
      { label:'Zoom Controls', desc:'Use + / − buttons or scroll wheel to zoom in/out. Click ⊡ to reset to 100%. Zoom range: 25% to 300%.' },
      { label:'Grid Toggle', desc:'Press G or click "⊞ Grid" to show/hide the alignment grid. Helps with precise element positioning.' },
      { label:'Guides Toggle', desc:'Click "⊟ Guides" to show/hide guide lines for alignment.' },
      { label:'Pan Canvas', desc:'Hold Space and drag to pan (scroll) the canvas in any direction.' },
      { label:'Background Color', desc:'Set the canvas background color in the Top Bar color picker. This becomes the exported animation\'s background.' },
    ]
  },
  {
    id:'ac-tools', icon:'🔧', title:'Drawing Tools (Top Bar)',
    items: [
      { label:'↖ Select (V)', desc:'Select, move, resize, and rotate elements. Click to select. Shift+Click to multi-select. Drag empty area for marquee selection.' },
      { label:'⬜ Rectangle (R)', desc:'Draw rectangles and squares. Hold Shift while drawing to constrain to perfect square.' },
      { label:'⭕ Circle (C)', desc:'Draw circles and ellipses. Hold Shift while drawing to constrain to perfect circle.' },
      { label:'△ Triangle (T)', desc:'Draw equilateral triangles. Fully customizable fill, stroke, and border radius.' },
      { label:'⭐ Star', desc:'Draw star shapes. Configure number of points (3–12) in the properties panel.' },
      { label:'T Text (X)', desc:'Add text elements. Customize font, size, weight, color, alignment, and letter spacing.' },
      { label:'╱ Line (L)', desc:'Draw straight lines. Configure stroke width, color, and dash pattern.' },
      { label:'✏️ Draw (D)', desc:'Freehand drawing tool. Draw custom paths and shapes directly on canvas.' },
      { label:'🖼️ Image (I)', desc:'Upload and place images on the canvas. Supports PNG, JPG, SVG, GIF, WebP.' },
    ]
  },
  {
    id:'ac-animations', icon:'✨', title:'Animation System (20+ Types)',
    items: [
      { label:'Float 〰️', desc:'Smooth up-down floating motion. Great for hero images, cards, icons.' },
      { label:'Pulse 💓', desc:'Scale in/out pulsing animation. Perfect for call-to-action buttons, notification badges.' },
      { label:'Spin 🔄', desc:'Continuous 360° rotation. Use for loaders, icons, decorative elements.' },
      { label:'Bounce ⬆️', desc:'Cubic-bezier bounce effect. Great for alerts, tooltips, playful UI elements.' },
      { label:'Shake 📳', desc:'Horizontal shake animation. Use for error states, attention-grabbing effects.' },
      { label:'Fade In 👁️', desc:'Opacity fade from 0 to 1. Classic entrance animation for any element.' },
      { label:'Glow ✨', desc:'Box-shadow glow pulse. Perfect for neon effects, premium buttons, badges.' },
      { label:'Slide ➡️', desc:'Horizontal sliding motion. Good for banners, carousels, content reveals.' },
      { label:'Morph 🔮', desc:'Border-radius morphing animation — creates organic blob shapes.' },
      { label:'Swing 🎵', desc:'Pendulum swing rotation. Fun animation for icons, characters, decorations.' },
      { label:'Zoom Pulse 🔍', desc:'Scale zoom in/out with opacity. Eye-catching for hero elements.' },
      { label:'Glitch ⚡', desc:'Digital glitch step animation. Great for tech/cyberpunk aesthetics.' },
      { label:'Neon Flicker 💡', desc:'Flickering neon light effect. Perfect for retro, cyberpunk designs.' },
      { label:'Cinematic 🎬', desc:'Smooth cinematic entrance with cubic-bezier easing. Premium feel.' },
      { label:'Wave 🌊', desc:'Wave-form animation. Works beautifully with multiple elements in sequence.' },
      { label:'Orbit 🪐', desc:'Circular orbit path animation. Great for decorative background elements.' },
      { label:'Typewriter ⌨️', desc:'Character-by-character text reveal. Classic typewriter effect for text elements.' },
      { label:'Spring In 🌱', desc:'Spring physics entrance — overshoots and settles. Feels alive and natural.' },
      { label:'Blur In 🌫️', desc:'Blur to sharp entrance animation. Premium, modern reveal effect.' },
    ]
  },
  {
    id:'ac-physics', icon:'⚙️', title:'Physics Engine (8 Modes)',
    items: [
      { label:'Off —', desc:'No physics applied. Element stays static or uses CSS animation only.' },
      { label:'Gravity ↓', desc:'Element falls due to gravity and rests on the floor. Configurable gravity strength and bounce elasticity.' },
      { label:'Float 〰️', desc:'Element floats continuously with configurable amplitude and frequency. Natural, organic motion.' },
      { label:'Spring 🌀', desc:'Element springs back to its origin when displaced. Configure spring tension and damping.' },
      { label:'Magnetic 🧲', desc:'Element is attracted to or repelled by the mouse cursor. Configurable attraction strength and range.' },
      { label:'Bounce ⬆', desc:'Element bounces around the canvas boundaries. Configure velocity and elasticity.' },
      { label:'Wind 💨', desc:'Constant directional force applied to element. Configure direction and strength.' },
      { label:'Cloth 🌊', desc:'Cloth-like fluid motion simulation. Creates flowing, fabric-style movement.' },
    ]
  },
  {
    id:'ac-particles', icon:'✨', title:'Particle Engine',
    content: `The Particle Panel (in Pro Mode) lets you add animated particle effects to any scene element.`,
    items: [
      { label:'Particle Count', desc:'Number of particles (1–500). More particles = more visual impact but higher CPU usage.' },
      { label:'Particle Size', desc:'Min and max size range for particles. Creates natural size variation.' },
      { label:'Speed', desc:'Particle movement speed. Higher = more energetic, lower = calm/ambient.' },
      { label:'Color', desc:'Particle color (single color or gradient). Alpha controls transparency.' },
      { label:'Shape', desc:'Circle, square, or star-shaped particles.' },
      { label:'Lifetime', desc:'How long each particle lives before respawning. Controls density.' },
      { label:'Emit Direction', desc:'Direction particles emit: all directions, upward, downward, left, right.' },
      { label:'Gravity Effect', desc:'Whether gravity affects particles. Creates falling/rising effects.' },
      { label:'Glow', desc:'Add bloom/glow to particles using shadowBlur. Creates luminous particle effects.' },
    ]
  },
  {
    id:'ac-shaders', icon:'🎨', title:'Shader System',
    items: [
      { label:'None', desc:'No shader applied. Clean, standard element rendering.' },
      { label:'Neon Glow', desc:'Applies a neon glow shader to the element using drop-shadow filters.' },
      { label:'Holographic', desc:'Rainbow holographic shimmer effect. Premium, iridescent appearance.' },
      { label:'Glitch', desc:'Digital distortion shader for cyberpunk / tech aesthetics.' },
      { label:'Vignette', desc:'Darkened corners shader for cinematic / dramatic effect.' },
      { label:'Chromatic', desc:'Chromatic aberration — slight RGB color splitting for a digital glitch look.' },
    ]
  },
  {
    id:'ac-gradient', icon:'🌈', title:'Gradient Builder',
    content: `The Gradient Builder lets you create beautiful multi-stop gradients for element backgrounds.`,
    items: [
      { label:'Linear Gradient', desc:'Direction-based gradient. Set the angle (0°–360°) and add up to 8 color stops.' },
      { label:'Radial Gradient', desc:'Center-outward circular gradient. Configure center position and stops.' },
      { label:'Conic Gradient', desc:'Angular/rotation-based gradient. Creates pie-chart and color wheel effects.' },
      { label:'Color Stops', desc:'Add, remove, and reorder color stops. Drag stops to change position. Click to change color.' },
      { label:'Opacity per Stop', desc:'Each color stop can have independent opacity for complex transparency effects.' },
    ]
  },
  {
    id:'ac-layers', icon:'📑', title:'Layer Panel',
    items: [
      { label:'Layer Order', desc:'Layers listed from top (front) to bottom (back). Click a layer to select its element.' },
      { label:'Visibility Toggle', desc:'Click the eye icon 👁 to show/hide individual layers without deleting.' },
      { label:'Lock Layer', desc:'Click lock icon 🔒 to prevent accidental selection/editing of a layer.' },
      { label:'Rename Layer', desc:'Double-click layer name to rename it. Helps organize complex multi-element scenes.' },
      { label:'Reorder Layers', desc:'Drag layers up/down to change z-order. Front layers appear on top.' },
      { label:'Delete Layer', desc:'Click trash icon to delete a layer and its element.' },
      { label:'Bring to Front', desc:'Ctrl+] or right-click → Layer → Bring to Front.' },
      { label:'Send to Back', desc:'Ctrl+[ or right-click → Layer → Send to Back.' },
    ]
  },
  {
    id:'ac-scenes', icon:'📁', title:'Scene Manager',
    items: [
      { label:'Save Scene', desc:'Click "📁 Scenes" in the top bar or press Ctrl+S to save the current scene with a name.' },
      { label:'Load Scene', desc:'Open Scene Manager and click any saved scene to restore it.' },
      { label:'Auto-save', desc:'AnimCreator auto-saves every 30 seconds to "⟳ Autosave" — visible in Scene Manager.' },
      { label:'Delete Scene', desc:'Click the delete icon next to any scene in the Scene Manager.' },
      { label:'Scene Count Badge', desc:'The "📁 Scenes" button shows a count badge with number of saved scenes.' },
    ]
  },
  {
    id:'ac-triggers', icon:'🎯', title:'Trigger System (Pro Mode)',
    items: [
      { label:'Hover Trigger', desc:'Animation plays when mouse hovers over the element. Great for interactive buttons and cards.' },
      { label:'Click Trigger', desc:'Animation plays when element is clicked. Perfect for button click effects.' },
      { label:'Scroll Trigger', desc:'Animation plays when element enters the viewport during scroll. Classic scroll-reveal effect.' },
      { label:'Auto Trigger', desc:'Animation plays automatically after a configurable delay. For entrance animations.' },
      { label:'Trigger Delay', desc:'Add a delay before the trigger activates. Creates staggered multi-element sequences.' },
    ]
  },
  {
    id:'ac-export', icon:'⬇️', title:'Export System',
    items: [
      { label:'Export CSS+JS', desc:'Exports clean, production-ready CSS animations + vanilla JavaScript code. Paste into any project.' },
      { label:'Export HTML', desc:'Exports a complete, self-contained HTML file with all CSS/JS inline. Open in browser immediately.' },
      { label:'Copy CSS', desc:'One-click copy of CSS-only code to clipboard.' },
      { label:'Copy JS', desc:'One-click copy of JavaScript-only code to clipboard.' },
      { label:'Minified Output', desc:'Option to export minified code for smaller file size in production.' },
    ]
  },
  {
    id:'ac-modes', icon:'🔄', title:'Simple vs Pro Mode',
    items: [
      { label:'Simple Mode', desc:'Streamlined interface showing only essential tools. Perfect for beginners and quick designs. Drag-and-drop focus, fewer options displayed.' },
      { label:'Pro Mode', desc:'Full feature set: timeline panel, FPS monitor, physics engine, particle panel, shader system, trigger system, mask/collision panel. For advanced users.' },
      { label:'FPS Monitor', desc:'Visible in Pro Mode only. Shows real-time frames-per-second of the animation. Target 60 FPS for smooth animations.' },
      { label:'Mode Switch', desc:'Click Simple / Pro buttons in the top-right corner of the Top Bar to switch modes instantly.' },
    ]
  },
  {
    id:'ac-context', icon:'🖱️', title:'Right-Click Context Menu',
    items: [
      { label:'Duplicate', desc:'Create an exact copy of the selected element.' },
      { label:'Delete', desc:'Remove the selected element from the scene.' },
      { label:'Bring Forward', desc:'Move element one layer up in z-order.' },
      { label:'Send Backward', desc:'Move element one layer down in z-order.' },
      { label:'Bring to Front', desc:'Move element to the topmost layer.' },
      { label:'Send to Back', desc:'Move element to the bottommost layer.' },
      { label:'Copy Style', desc:'Copy the visual style of the element to clipboard.' },
      { label:'Paste Style', desc:'Paste previously copied style onto selected element.' },
    ]
  },
  {
    id:'ac-library', icon:'📦', title:'Block Library',
    content:'Click "📦 Library" in the Top Bar to open the Block Library — a collection of pre-built animation blocks you can drag into your scene. Includes: hero sections, buttons, cards, loaders, text effects, background patterns, and more.'
  },
]

// ─── CODESPACE SECTIONS ─────────────────────────────────────────────────────
const CODE_SECTIONS = [
  {
    id:'cs-overview', icon:'💻', title:'What is CodeSpace?',
    content:`CodeSpace is MotionZync's browser-based IDE — a full code editor and development environment that runs entirely in your browser. No installation, no setup, no terminal access required.

It's similar to VS Code but runs 100% client-side. Your files are stored in IndexedDB (browser local storage). You can write HTML, CSS, JavaScript, TypeScript, React, Vue, Python, and more — with syntax highlighting, autocomplete, and live preview.`
  },
  {
    id:'cs-projects', icon:'📁', title:'Project Management',
    items: [
      { label:'Create Project', desc:'Click "New Project" from the Welcome Screen. Give it a name, then start adding files.' },
      { label:'Switch Projects', desc:'Click the project name in the Title Bar to switch between projects.' },
      { label:'Delete Project', desc:'Right-click project → Delete. This permanently removes all project files.' },
      { label:'Import ZIP', desc:'Drag a .zip file into CodeSpace to import an existing project. Preserves folder structure.' },
      { label:'Export ZIP', desc:'Use Command Palette (Ctrl+P) → "Export ZIP" to download your entire project.' },
      { label:'Share Project', desc:'Use "Share" to generate a URL containing your project code (small projects only).' },
      { label:'Templates', desc:'Use the Template Picker to start from pre-built templates: HTML+CSS+JS, React, Vue, Landing Page, Portfolio, and more.' },
      { label:'Last Project', desc:'CodeSpace automatically reopens your last active project on next visit.' },
    ]
  },
  {
    id:'cs-files', icon:'📄', title:'File Explorer (VS Code Style)',
    items: [
      { label:'New File', desc:'Click the 📄 icon or right-click in the file tree → New File. Type file name and press Enter.' },
      { label:'New Folder', desc:'Click the 📁 icon or right-click → New Folder. Type folder name and press Enter.' },
      { label:'Rename', desc:'Right-click any file/folder → Rename, or slow double-click the name.' },
      { label:'Delete', desc:'Right-click → Delete. Confirms before permanently removing.' },
      { label:'Drag & Drop Move', desc:'Drag files and folders to reorganize your project structure.' },
      { label:'File Icons', desc:'Each file type has its own colored icon (🟡 JS, 🔵 HTML, 🟣 CSS, 🟢 Python, etc.).' },
      { label:'Supported Types', desc:'HTML, CSS, JS, TS, JSX, TSX, JSON, MD, YAML, Python, Bash, SQL, TXT and more.' },
    ]
  },
  {
    id:'cs-editor', icon:'✏️', title:'Monaco Code Editor',
    items: [
      { label:'Syntax Highlighting', desc:'Full syntax highlighting for all supported languages. Colors match VS Code Dark theme.' },
      { label:'Autocomplete', desc:'IntelliSense-style autocomplete for HTML, CSS, JavaScript, and TypeScript.' },
      { label:'Multiple Tabs', desc:'Open multiple files in tabs. Switch between them instantly. Right-click tab to close.' },
      { label:'Split Editor', desc:'Open two files side-by-side using split view from the Command Palette.' },
      { label:'Tab Bar', desc:'File tabs at the top show open files. Modified files show a dot indicator.' },
      { label:'Breadcrumb', desc:'Shows the current file path below the tab bar for quick navigation.' },
      { label:'Font Size', desc:'Adjust font size in Settings (Ctrl+Shift+P → Settings). Range: 10–24px.' },
      { label:'Word Wrap', desc:'Toggle word wrap in Settings. Choose: off, on, bounded, or wordWrapColumn.' },
      { label:'Minimap', desc:'Toggle the code minimap (file overview) in Settings.' },
      { label:'Theme', desc:'Choose editor theme in Settings. Options: cs-dark (default), cs-light, cs-monokai.' },
    ]
  },
  {
    id:'cs-preview', icon:'👁️', title:'Live Preview Panel',
    items: [
      { label:'Auto Preview', desc:'When enabled in Settings, preview updates automatically as you save. Toggle with the preview button.' },
      { label:'Manual Refresh', desc:'Click the refresh 🔄 button to manually refresh the preview.' },
      { label:'Open in New Tab', desc:'Click the external link icon to open the preview in a full browser tab.' },
      { label:'Responsive Toggle', desc:'Toggle between full-width and responsive (device-frame) preview modes.' },
      { label:'HTML Files', desc:'HTML files preview directly. JS/CSS files require an HTML file that references them.' },
      { label:'React Preview', desc:'JSX/TSX files with React are bundled and previewed in real-time.' },
    ]
  },
  {
    id:'cs-terminal', icon:'⚡', title:'Terminal Simulation',
    items: [
      { label:'Toggle Terminal', desc:'Press Ctrl+` or click the terminal icon in the status bar to open/close.' },
      { label:'Simulated Commands', desc:'The terminal simulates common development commands for educational use.' },
      { label:'ls', desc:'List files and directories in the current project.' },
      { label:'mkdir', desc:'Create a new directory (e.g., mkdir components).' },
      { label:'touch', desc:'Create a new file (e.g., touch index.js).' },
      { label:'cat', desc:'Show file contents in terminal (e.g., cat index.html).' },
      { label:'cd', desc:'Change directory (simulated navigation in file tree).' },
      { label:'clear', desc:'Clear the terminal output.' },
      { label:'npm install', desc:'Shows simulated npm install feedback (educational).' },
      { label:'git status', desc:'Shows Git status of the current project (integrates with Git Panel).' },
    ]
  },
  {
    id:'cs-git', icon:'⎇', title:'Git Panel',
    items: [
      { label:'Initialize Repo', desc:'Click "Init" to initialize a Git repository for the current project.' },
      { label:'Stage Files', desc:'Click the + icon next to files to stage them for commit.' },
      { label:'Commit', desc:'Enter a commit message and click "Commit" to create a snapshot.' },
      { label:'Branch View', desc:'See the current branch name and commit history in the Git Panel.' },
      { label:'Diff View', desc:'Click any changed file to see what changed since the last commit.' },
      { label:'Note', desc:'Git in CodeSpace is a local simulation. It does not connect to GitHub/GitLab without a real backend.' },
    ]
  },
  {
    id:'cs-palette', icon:'🔍', title:'Command Palette',
    content: 'Open with Ctrl+P. Type any command or file name to quickly jump to it.',
    items: [
      { label:'Save File', desc:'Save the currently active file (Ctrl+S).' },
      { label:'New File', desc:'Create a new file in the current project.' },
      { label:'Toggle Terminal', desc:'Open or close the terminal panel.' },
      { label:'Toggle Preview', desc:'Show or hide the live preview panel.' },
      { label:'Toggle Git Panel', desc:'Open or close the Git version control panel.' },
      { label:'Zen Mode', desc:'Enter distraction-free fullscreen coding mode.' },
      { label:'Export ZIP', desc:'Download the entire project as a .zip archive.' },
      { label:'Share Project', desc:'Generate a shareable URL for the current project.' },
      { label:'Open Settings', desc:'Open the CodeSpace settings panel.' },
      { label:'Split Editor', desc:'Open the current file in split-view side-by-side.' },
    ]
  },
  {
    id:'cs-settings', icon:'⚙️', title:'Settings Panel',
    items: [
      { label:'Theme', desc:'Editor color theme: cs-dark (default), cs-light, cs-monokai.' },
      { label:'Font Size', desc:'Editor font size from 10px to 24px.' },
      { label:'Minimap', desc:'Toggle the code minimap on the right side of the editor.' },
      { label:'Word Wrap', desc:'How long lines are handled: off, on, bounded, or wordWrapColumn.' },
      { label:'Auto Save', desc:'Automatically save files as you type (every 2 seconds of inactivity).' },
      { label:'Auto Preview', desc:'Automatically refresh live preview when files are saved.' },
    ]
  },
  {
    id:'cs-templates', icon:'📋', title:'Project Templates',
    items: [
      { label:'Blank HTML', desc:'Clean HTML + CSS + JS starter template. Perfect for any web page.' },
      { label:'Landing Page', desc:'Pre-built professional landing page template with hero, features, and footer.' },
      { label:'Portfolio', desc:'Personal portfolio template with about, projects, and contact sections.' },
      { label:'React App', desc:'React + JSX starter with component structure and CSS modules.' },
      { label:'Vue App', desc:'Vue 3 Composition API starter template.' },
      { label:'CSS Animation', desc:'Starter focused on CSS animation with live preview setup.' },
      { label:'Canvas App', desc:'HTML5 Canvas starter with animation loop and resize handling.' },
      { label:'API Dashboard', desc:'Dashboard template with fetch API integration example.' },
    ]
  },
  {
    id:'cs-shortcuts', icon:'⌨️', title:'All Keyboard Shortcuts',
    items: [
      { label:'Ctrl+P', desc:'Open Command Palette — search files and commands.' },
      { label:'Ctrl+S', desc:'Save the current file immediately.' },
      { label:'Ctrl+`', desc:'Toggle the terminal panel.' },
      { label:'Ctrl+/', desc:'Toggle line comment for selected lines.' },
      { label:'Ctrl+D', desc:'Select the next occurrence of the current selection.' },
      { label:'Ctrl+F', desc:'Open Find dialog to search within the current file.' },
      { label:'Ctrl+H', desc:'Open Find & Replace dialog.' },
      { label:'Ctrl+Z / Ctrl+Shift+Z', desc:'Undo / Redo editing actions.' },
      { label:'Alt+↑ / Alt+↓', desc:'Move the current line up or down.' },
      { label:'Ctrl+G', desc:'Go to a specific line number.' },
      { label:'Tab / Shift+Tab', desc:'Indent / Unindent selected lines.' },
      { label:'F1', desc:'Open the Monaco editor internal command palette.' },
      { label:'F11', desc:'Enter fullscreen mode.' },
      { label:'Ctrl+Shift+P', desc:'Open CodeSpace Settings panel.' },
    ]
  },
]

export default function ToolGuide() {
  const [activeTab, setActiveTab] = useState('anim')
  const [openSection, setOpenSection] = useState('ac-overview')

  const sections = activeTab === 'anim' ? ANIM_SECTIONS : CODE_SECTIONS

  return (
    <div className="page-section">
      <div className="container" style={{maxWidth:'1000px'}}>
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1><span className="gradient-text">Tool Guide</span> — A to Z</h1>
          <p>Complete documentation for AnimCreator and CodeSpace — every feature, panel, shortcut, and setting explained.</p>
        </div>

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>

        {/* TAB SWITCHER */}
        <div style={{display:'flex',gap:'.5rem',marginBottom:'2rem',background:'rgba(20,20,35,.5)',border:'1px solid rgba(124,58,237,.18)',borderRadius:'12px',padding:'.4rem'}}>
          {[
            { id:'anim', icon:'🎬', label:'AnimCreator — Visual Animation Suite' },
            { id:'code', icon:'💻', label:'CodeSpace — Browser IDE' },
          ].map(t=>(
            <button key={t.id} onClick={()=>{setActiveTab(t.id);setOpenSection(t.id==='anim'?'ac-overview':'cs-overview')}}
              style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'.5rem',padding:'.6rem 1rem',borderRadius:'8px',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:'.88rem',fontWeight:700,transition:'all .2s',background:activeTab===t.id?'linear-gradient(135deg,#7c3aed,#06b6d4)':'transparent',color:activeTab===t.id?'#fff':'#94a3b8'}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* QUICK NAV */}
        <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem',marginBottom:'1.5rem'}}>
          {sections.map(s=>(
            <button key={s.id} onClick={()=>setOpenSection(s.id)} style={{display:'inline-flex',alignItems:'center',gap:'.3rem',background:openSection===s.id?'rgba(124,58,237,.25)':'rgba(124,58,237,.07)',border:`1px solid ${openSection===s.id?'rgba(124,58,237,.6)':'rgba(124,58,237,.18)'}`,color:openSection===s.id?'#a78bfa':'#94a3b8',padding:'.3rem .7rem',borderRadius:'20px',cursor:'pointer',fontSize:'.78rem',fontWeight:600,transition:'all .2s',fontFamily:'inherit'}}>
              {s.icon} {s.title}
            </button>
          ))}
        </div>

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>

        {/* SECTIONS */}
        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          {sections.map(s=>(
            <div key={s.id} style={{background:'rgba(20,20,35,.7)',border:`1px solid ${openSection===s.id?'rgba(124,58,237,.5)':'rgba(124,58,237,.15)'}`,borderRadius:'14px',overflow:'hidden',transition:'border-color .2s'}}>
              <button onClick={()=>setOpenSection(openSection===s.id?null:s.id)}
                style={{width:'100%',display:'flex',alignItems:'center',gap:'.8rem',padding:'1.1rem 1.4rem',background:'none',border:'none',color:'inherit',cursor:'pointer',fontFamily:'inherit',textAlign:'left'}}>
                <span style={{fontSize:'1.3rem'}}>{s.icon}</span>
                <span style={{fontWeight:700,fontSize:'.97rem',flex:1}}>{s.title}</span>
                <span style={{color:'#64748b',fontSize:'.75rem'}}>{openSection===s.id?'▲':'▼'}</span>
              </button>
              {openSection===s.id && (
                <div style={{padding:'0 1.4rem 1.4rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>
                  {s.content && <p style={{color:'#cbd5e1',fontSize:'.9rem',lineHeight:1.7,margin:'1rem 0',whiteSpace:'pre-line'}}>{s.content}</p>}
                  {s.items && (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'.7rem',marginTop:'1rem'}}>
                      {s.items.map(item=>(
                        <div key={item.label} style={{background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.12)',borderRadius:'8px',padding:'.8rem 1rem'}}>
                          <div style={{fontWeight:700,fontSize:'.85rem',color:'#a78bfa',marginBottom:'.25rem',fontFamily:'monospace'}}>{item.label}</div>
                          <div style={{fontSize:'.83rem',color:'#94a3b8',lineHeight:1.5}}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>

        {/* CTA */}
        <div style={{display:'flex',gap:'.8rem',justifyContent:'center',flexWrap:'wrap',marginTop:'2rem',padding:'2rem',background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.15)',borderRadius:'14px',textAlign:'center'}}>
          <h3 style={{width:'100%',fontSize:'1.1rem',marginBottom:'.2rem'}}>Ready to start creating?</h3>
          <p style={{width:'100%',color:'#94a3b8',fontSize:'.88rem',marginBottom:'1rem'}}>Open the tool and explore — every feature is free.</p>
          <Link to="/anim-creator" className="btn-primary">🎬 Open AnimCreator</Link>
          <Link to="/codespace" className="btn-primary" style={{background:'linear-gradient(135deg,#06b6d4,#3b82f6)'}}>💻 Open CodeSpace</Link>
          <Link to="/how-to-use" className="btn-secondary">← Back to How to Use</Link>
        </div>

      </div>
    </div>
  )
}
