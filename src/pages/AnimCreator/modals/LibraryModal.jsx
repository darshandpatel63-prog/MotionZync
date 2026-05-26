import { useCreator } from '../store/CreatorContext.jsx'
import './LibraryModal.css'

// Pre-built blocks — sets of elements
const BLOCKS = [
  {
    id:'hero-glow',
    label:'Glow Hero',
    category:'Hero',
    preview:'✨',
    elements:[
      { type:'rect',   x:300, y:180, width:300, height:200, fill:'#7c3aed', gradient:{type:'radial',from:'#7c3aed',to:'#0a0a0f'}, borderRadius:20, opacity:0.4, anim:{name:'pulse',duration:3,loop:true}, borderAnim:{enabled:true,type:'neon',color:'#a78bfa',speed:2,thickness:2,glow:20} },
      { type:'text',   x:280, y:245, width:340, height:60,  label:'HERO TITLE', fontSize:36, fontWeight:'900', fontColor:'#ffffff', anim:{name:'fadeIn',duration:1,loop:false} },
      { type:'text',   x:310, y:310, width:280, height:30,  label:'Subtitle text here', fontSize:14, fontColor:'#a78bfa', anim:{name:'fadeIn',duration:1.5,delay:0.3,loop:false} },
    ]
  },
  {
    id:'neon-card',
    label:'Neon Card',
    category:'Cards',
    preview:'🃏',
    elements:[
      { type:'rect', x:320, y:200, width:260, height:180, fill:'rgba(15,15,30,0.9)', borderRadius:16, shadow:{enabled:true,color:'#7c3aed',blur:30,x:0,y:0}, borderAnim:{enabled:true,type:'neon',color:'#06b6d4',speed:2,thickness:1.5,glow:12} },
      { type:'circle', x:360, y:220, width:50, height:50, fill:'#7c3aed', gradient:{type:'radial',from:'#a78bfa',to:'#5b21b6'}, glow:{enabled:true,color:'#7c3aed',intensity:15} },
      { type:'text',   x:330, y:280, width:240, height:28, label:'Card Title',    fontSize:16, fontWeight:'700', fontColor:'#e2e8f0' },
      { type:'text',   x:330, y:310, width:240, height:22, label:'Card subtitle', fontSize:12, fontColor:'#6b7280' },
    ]
  },
  {
    id:'orbit-system',
    label:'Orbit System',
    category:'Effects',
    preview:'🪐',
    elements:[
      { type:'circle', x:400, y:230, width:80, height:80, fill:'#7c3aed', gradient:{type:'radial',from:'#a78bfa',to:'#5b21b6'}, glow:{enabled:true,color:'#7c3aed',intensity:25} },
      { type:'circle', x:340, y:250, width:24, height:24, fill:'#06b6d4', anim:{name:'orbit',duration:3,loop:true} },
      { type:'circle', x:440, y:200, width:16, height:16, fill:'#f59e0b', anim:{name:'orbit',duration:5,loop:true} },
      { type:'circle', x:370, y:180, width:12, height:12, fill:'#10b981', anim:{name:'orbit',duration:7,loop:true} },
    ]
  },
  {
    id:'glitch-text',
    label:'Glitch Text',
    category:'Text',
    preview:'⚡',
    elements:[
      { type:'text', x:250, y:250, width:400, height:80, label:'GLITCH', fontSize:56, fontWeight:'900', fontColor:'#7c3aed', anim:{name:'glitch',duration:0.4,loop:true}, glow:{enabled:true,color:'#7c3aed',intensity:12} },
    ]
  },
  {
    id:'floating-orbs',
    label:'Floating Orbs',
    category:'Background',
    preview:'🫧',
    elements:[
      { type:'circle', x:80,  y:80,  width:120, height:120, fill:'#7c3aed', opacity:0.3, anim:{name:'float',duration:4,loop:true},  glow:{enabled:true,color:'#7c3aed',intensity:20} },
      { type:'circle', x:650, y:300, width:80,  height:80,  fill:'#06b6d4', opacity:0.25,anim:{name:'float',duration:3,delay:1,loop:true}, glow:{enabled:true,color:'#06b6d4',intensity:15} },
      { type:'circle', x:200, y:380, width:60,  height:60,  fill:'#f59e0b', opacity:0.2, anim:{name:'float',duration:5,delay:2,loop:true}, glow:{enabled:true,color:'#f59e0b',intensity:10} },
    ]
  },
  {
    id:'neon-button',
    label:'Neon Button',
    category:'UI',
    preview:'🔲',
    elements:[
      { type:'rect', x:340, y:255, width:220, height:50, fill:'rgba(124,58,237,0.15)', borderRadius:25, borderAnim:{enabled:true,type:'neon',color:'#7c3aed',speed:2,thickness:2,glow:16} },
      { type:'text', x:340, y:255, width:220, height:50, label:'CLICK ME', fontSize:14, fontWeight:'800', fontColor:'#c4b5fd' },
    ]
  },
  {
    id:'cyber-grid',
    label:'Cyber Grid',
    category:'Background',
    preview:'🌐',
    elements:[
      { type:'rect', x:0, y:0, width:900, height:580, fill:'#0a0a0f', gradient:{type:'linear',from:'#0a0a1f',to:'#0a0a0f',angle:180} },
      { type:'rect', x:200, y:160, width:500, height:260, fill:'transparent', borderRadius:4, borderAnim:{enabled:true,type:'scan',color:'#06b6d4',speed:3,thickness:1,glow:8}, opacity:0.5 },
      { type:'text', x:280, y:255, width:340, height:70, label:'CYBER SYSTEM', fontSize:40, fontWeight:'900', fontColor:'#06b6d4', anim:{name:'neonFlicker',duration:2,loop:true}, glow:{enabled:true,color:'#06b6d4',intensity:20} },
    ]
  },
  {
    id:'physics-demo',
    label:'Physics Demo',
    category:'Physics',
    preview:'⚛️',
    elements:[
      { type:'circle', x:400, y:100, width:60, height:60, fill:'#7c3aed', gradient:{type:'radial',from:'#a78bfa',to:'#5b21b6'}, physics:{enabled:true,mode:'gravity',gravity:0.4,bounce:0.7,mass:1,friction:0.05,vx:2,vy:0,sleeping:false} },
      { type:'circle', x:200, y:150, width:40, height:40, fill:'#06b6d4', physics:{enabled:true,mode:'bounce',gravity:0.2,bounce:0.8,mass:0.8,friction:0.03,sleeping:false,_bvx:3,_bvy:-2} },
      { type:'rect',   x:350, y:200, width:70, height:70, fill:'#f59e0b', gradient:{type:'linear',from:'#f59e0b',to:'#ef4444',angle:135}, physics:{enabled:true,mode:'float',gravity:0.3,mass:1,wind:0.5,sleeping:false} },
    ]
  },
]

const CATEGORIES = [...new Set(BLOCKS.map(b => b.category))]

export default function LibraryModal({ onClose }) {
  const { addElement, dispatch } = useCreator()

  function insertBlock(block) {
    block.elements.forEach((el, i) => {
      setTimeout(() => {
        const { type, x, y, ...rest } = el
        addElement(type, x, y, { ...rest, label: rest.label || type })
      }, i * 30)
    })
    onClose()
  }

  return (
    <div className="lm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="lm-modal">
        <div className="lm-header">
          <span className="lm-title">📦 Block Library</span>
          <span className="lm-sub">Click to add to canvas</span>
          <button className="lm-close" onClick={onClose}>✕</button>
        </div>

        {CATEGORIES.map(cat => (
          <div key={cat} className="lm-section">
            <div className="lm-cat-title">{cat}</div>
            <div className="lm-grid">
              {BLOCKS.filter(b => b.category === cat).map(block => (
                <button
                  key={block.id}
                  className="lm-block-btn"
                  onClick={() => insertBlock(block)}
                >
                  <span className="lm-block-icon">{block.preview}</span>
                  <span className="lm-block-label">{block.label}</span>
                  <span className="lm-block-count">{block.elements.length} el</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
      }
    
