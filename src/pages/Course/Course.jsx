import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './Course.css'

const modules = [
  {
    id:1, icon:'🎯', title:'Module 1: CSS Animation Basics',
    desc:'Learn the fundamentals of CSS animations from scratch.',
    lessons:[
      { title:'What is CSS Animation?', content:`CSS animation allows HTML elements to gradually change from one style to another without JavaScript.

<h3>Key Properties:</h3>
<pre><code>/* animation-name: links to @keyframes */
/* animation-duration: how long */
/* animation-timing-function: speed curve */
/* animation-iteration-count: repeat times */

.box {
  animation: myAnim 2s ease-in-out infinite;
}

@keyframes myAnim {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.5); }
  100% { transform: scale(1); }
}</code></pre>

<h3>Try it:</h3>
<pre><code>/* CSS */
.pulse {
  width: 80px; height: 80px;
  background: #7c3aed;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.3); opacity: 0.7; }
}

/* JS */
const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const d = document.createElement('div');
d.className = 'pulse';
c.appendChild(d);</code></pre>` },
      { title:'Transform: Move, Scale, Rotate', content:`The CSS <code>transform</code> property lets you move, scale, rotate and skew elements.

<h3>Transform Functions:</h3>
<pre><code>/* Translate (move) */
transform: translate(100px, 50px);
transform: translateX(100px);
transform: translateY(50px);

/* Scale (size) */
transform: scale(1.5);     /* 1.5x larger */
transform: scaleX(2);      /* 2x wider */

/* Rotate */
transform: rotate(45deg);  /* 45 degree rotation */
transform: rotate(1turn);  /* full 360° */

/* Skew */
transform: skew(20deg, 10deg);

/* Combine multiple */
transform: translate(50px) rotate(45deg) scale(1.2);</code></pre>

<h3>Example — Spinning Border:</h3>
<pre><code>/* CSS */
.spinner {
  width: 80px; height: 80px;
  border: 4px solid #2d2d44;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* JS */
const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const d = document.createElement('div');
d.className = 'spinner';
c.appendChild(d);</code></pre>` },
      { title:'Timing Functions & Easing', content:`Timing functions control the speed curve of your animation.

<h3>Built-in Timing Functions:</h3>
<pre><code>animation-timing-function: linear;      /* constant speed */
animation-timing-function: ease;        /* slow-fast-slow (default) */
animation-timing-function: ease-in;     /* slow start */
animation-timing-function: ease-out;    /* slow end */
animation-timing-function: ease-in-out; /* slow start and end */
animation-timing-function: steps(4);    /* 4 discrete steps */

/* Custom cubic-bezier */
animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); /* bouncy */</code></pre>

<h3>Example — Bouncy Ball:</h3>
<pre><code>/* CSS */
.ball {
  width: 60px; height: 60px;
  background: radial-gradient(circle at 35% 35%, #a855f7, #7c3aed);
  border-radius: 50%;
  animation: bounce 1s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate;
  box-shadow: 0 10px 20px rgba(124,58,237,0.4);
}
@keyframes bounce {
  from { transform: translateY(80px); }
  to   { transform: translateY(-80px); }
}

/* JS */
const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const d = document.createElement('div');
d.className = 'ball';
c.appendChild(d);</code></pre>` },
    ]
  },
  {
    id:2, icon:'🎨', title:'Module 2: Advanced CSS Techniques',
    desc:'Gradients, filters, clip-path, and multi-element animations.',
    lessons:[
      { title:'Gradient Animations', content:`Animating gradients creates stunning liquid color effects.

<h3>Gradient Background Animation:</h3>
<pre><code>/* CSS */
.gradient-bg {
  position: absolute; inset: 0;
  background: linear-gradient(
    -45deg,
    #7c3aed, #06b6d4, #10b981, #f59e0b
  );
  background-size: 400% 400%;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* JS */
const c = document.getElementById('container');
const d = document.createElement('div');
d.className = 'gradient-bg';
c.appendChild(d);</code></pre>` },
      { title:'Filter & Blur Effects', content:`CSS filters add visual effects like blur, glow, and color shifts.

<h3>Filter Functions:</h3>
<pre><code>filter: blur(10px);           /* blur effect */
filter: brightness(1.5);      /* brighter */
filter: contrast(2);          /* more contrast */
filter: hue-rotate(90deg);    /* shift colors */
filter: saturate(2);          /* more vivid */
filter: drop-shadow(0 0 10px #7c3aed); /* glow */

/* Combine filters */
filter: blur(2px) brightness(1.2) hue-rotate(45deg);</code></pre>

<h3>Glow Pulse Example:</h3>
<pre><code>/* CSS */
.glow-box {
  width: 120px; height: 120px;
  background: #7c3aed;
  border-radius: 20px;
  animation: glowPulse 2s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% { filter: drop-shadow(0 0 8px #7c3aed); }
  50%       { filter: drop-shadow(0 0 30px #a855f7) drop-shadow(0 0 60px #7c3aed); }
}

/* JS */
const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const d = document.createElement('div');
d.className = 'glow-box';
c.appendChild(d);</code></pre>` },
      { title:'Morphing Shapes with border-radius', content:`Using border-radius creatively creates organic morphing shapes.

<h3>Morphing Blob:</h3>
<pre><code>/* CSS */
.blob {
  width: 200px; height: 200px;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  animation: morph 8s ease-in-out infinite;
}
@keyframes morph {
  0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50%  { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
  75%  { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
}

/* JS */
const c = document.getElementById('container');
c.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const d = document.createElement('div');
d.className = 'blob';
c.appendChild(d);</code></pre>

<h3>Tip — Customize the Blob:</h3>
<ul>
<li>Change gradient colors for different vibes</li>
<li>Add <code>filter: blur(2px)</code> for a softer look</li>
<li>Add a second blob with <code>mix-blend-mode: screen</code></li>
</ul>` },
    ]
  },
  {
    id:3, icon:'⚡', title:'Module 3: JavaScript Canvas Animations',
    desc:'Create advanced animations using HTML5 Canvas and requestAnimationFrame.',
    lessons:[
      { title:'Canvas Basics', content:`HTML Canvas lets you draw graphics using JavaScript.

<h3>Canvas Setup:</h3>
<pre><code>/* JS - always start like this */
const el = document.getElementById('container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size = container size
canvas.width  = el.offsetWidth  || 400;
canvas.height = el.offsetHeight || 500;
el.appendChild(canvas);

const W = canvas.width;
const H = canvas.height;</code></pre>

<h3>Drawing Shapes:</h3>
<pre><code>// Rectangle
ctx.fillStyle = '#7c3aed';
ctx.fillRect(50, 50, 100, 60);

// Circle
ctx.beginPath();
ctx.arc(200, 150, 40, 0, Math.PI * 2);
ctx.fillStyle = '#06b6d4';
ctx.fill();

// Line
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(400, 400);
ctx.strokeStyle = '#a855f7';
ctx.lineWidth = 2;
ctx.stroke();</code></pre>` },
      { title:'Animation Loop with requestAnimationFrame', content:`requestAnimationFrame creates smooth 60fps animations.

<h3>Basic Animation Loop:</h3>
<pre><code>const el = document.getElementById('container');
const c = document.createElement('canvas');
const ctx = c.getContext('2d');
c.width = el.offsetWidth || 400;
c.height = el.offsetHeight || 500;
el.appendChild(c);

let x = 0; // position

function animate() {
  // 1. Clear canvas
  ctx.clearRect(0, 0, c.width, c.height);
  
  // 2. Draw
  ctx.beginPath();
  ctx.arc(x, c.height/2, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#7c3aed';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 20;
  ctx.fill();
  
  // 3. Update position
  x = (x + 2) % c.width;
  
  // 4. Next frame
  requestAnimationFrame(animate);
}

animate(); // Start!</code></pre>

<h3>Trail Effect (don't fully clear):</h3>
<pre><code>// Instead of clearRect, use semi-transparent fill:
ctx.fillStyle = 'rgba(10, 10, 15, 0.1)'; // 10% opacity
ctx.fillRect(0, 0, c.width, c.height);
// This leaves a fading trail!</code></pre>` },
      { title:'Particle Systems', content:`Particle systems create effects like stars, fire, snow and more.

<h3>Basic Particle System:</h3>
<pre><code>const el = document.getElementById('container');
const c = document.createElement('canvas');
const ctx = c.getContext('2d');
c.width = el.offsetWidth || 400;
c.height = el.offsetHeight || 500;
el.appendChild(c);
const W = c.width, H = c.height;

// Create particles array
const particles = Array.from({ length: 100 }, () => ({
  x:     Math.random() * W,
  y:     Math.random() * H,
  vx:    (Math.random() - 0.5) * 2,  // velocity X
  vy:    (Math.random() - 0.5) * 2,  // velocity Y
  size:  Math.random() * 3 + 1,
  hue:   Math.random() * 60 + 240,   // blue-purple range
}));

function draw() {
  ctx.fillStyle = 'rgba(10,10,15,0.08)';
  ctx.fillRect(0, 0, W, H);
  
  particles.forEach(p => {
    // Move
    p.x += p.vx;
    p.y += p.vy;
    
    // Bounce off walls
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    
    // Draw
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = \`hsl(\${p.hue}, 90%, 70%)\`;
    ctx.shadowColor = \`hsl(\${p.hue}, 90%, 60%)\`;
    ctx.shadowBlur = 10;
    ctx.fill();
  });
  
  requestAnimationFrame(draw);
}
draw();</code></pre>

<h3>Pro Tips:</h3>
<ul>
<li>Use <code>shadowBlur</code> for glow effects</li>
<li>Use <code>Math.sin()</code> for wave-like motion</li>
<li>Connect nearby particles with lines for constellation effect</li>
</ul>` },
    ]
  },
  {
    id:4, icon:'🔧', title:'Module 4: Using Animations in Your Project',
    desc:'How to add animations to your website or app, resize them, and replace placeholder content.',
    lessons:[
      { title:'Adding Animation to Your Website', content:`Once you have your CSS and JS code from MotionZync, here's how to add it to your project.

<h3>Method 1: Direct HTML (Simplest)</h3>
<pre><code>&lt;!-- In your HTML file --&gt;
&lt;div id="animation-container" style="width:100%;height:400px;position:relative;overflow:hidden;"&gt;&lt;/div&gt;

&lt;style&gt;
/* PASTE YOUR CSS HERE */
.particle { ... }
@keyframes float { ... }
&lt;/style&gt;

&lt;script&gt;
// PASTE YOUR JS HERE
const container = document.getElementById('animation-container');
// ... animation code
&lt;/script&gt;</code></pre>

<h3>Method 2: As Background</h3>
<pre><code>&lt;div class="hero-section"&gt;
  &lt;div id="bg-animation" style="position:absolute;inset:0;z-index:0;"&gt;&lt;/div&gt;
  &lt;div class="hero-content" style="position:relative;z-index:1;"&gt;
    &lt;h1&gt;Your Content Here&lt;/h1&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>

<h3>Method 3: React Component</h3>
<pre><code>import { useEffect, useRef } from 'react';

function AnimationBackground({ cssCode, jsCode }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Add CSS
    const style = document.createElement('style');
    style.textContent = cssCode;
    document.head.appendChild(style);
    
    // Run JS
    const fn = new Function(jsCode); // only for trusted code!
    fn();
    
    return () => document.head.removeChild(style);
  }, []);
  
  return &lt;div ref={containerRef} id="container" style={{width:'100%',height:'100%'}}/&gt;;
}</code></pre>` },
      { title:'Resizing Animation to Your Screen', content:`Animations need to adapt to different screen sizes.

<h3>Make Canvas Responsive:</h3>
<pre><code>const el = document.getElementById('container');
const c = document.createElement('canvas');
const ctx = c.getContext('2d');

// Use container size instead of fixed values
function resize() {
  c.width  = el.offsetWidth;
  c.height = el.offsetHeight;
}
resize();

// Update on window resize
window.addEventListener('resize', resize);
el.appendChild(c);</code></pre>

<h3>CSS Full-Screen Background:</h3>
<pre><code>.animation-bg {
  position: fixed;    /* or absolute */
  top: 0; left: 0;
  width: 100vw;       /* full viewport width */
  height: 100vh;      /* full viewport height */
  z-index: -1;        /* behind content */
  overflow: hidden;
}</code></pre>

<h3>Responsive for Mobile:</h3>
<pre><code>/* Reduce particle count on mobile for performance */
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 30 : 100;

const particles = Array.from({ length: particleCount }, () => ({
  // ... particle data
}));</code></pre>` },
      { title:'Replacing Dummy Text and Images', content:`Most animation examples use placeholder "dummy" content. Here's how to replace them.

<h3>Replace Text in JS Animations:</h3>
<pre><code>// Find this in code:
el.textContent = 'Hello, AnimateX!';

// Replace with your text:
el.textContent = 'Your Own Text Here';</code></pre>

<h3>Replace Colors:</h3>
<pre><code>/* Find all color values and replace with your brand colors */

/* Original: */
background: linear-gradient(135deg, #7c3aed, #06b6d4);

/* Your brand colors: */
background: linear-gradient(135deg, #ff6b6b, #ffd93d);</code></pre>

<h3>Replace Images in Canvas:</h3>
<pre><code>// Load your image in canvas
const img = new Image();
img.src = 'https://your-site.com/your-image.png';
img.onload = () => {
  ctx.drawImage(img, x, y, width, height);
};</code></pre>

<h3>Replace Animation Size:</h3>
<pre><code>/* Original fixed size */
.box { width: 100px; height: 100px; }

/* Your custom size */
.box { width: 200px; height: 80px; }  /* rectangular */
.box { width: 50vw; height: 50vh; }   /* viewport-relative */</code></pre>

<h3>Quick Find & Replace Tips:</h3>
<ul>
<li>Use <code>Ctrl+H</code> in your code editor for find & replace</li>
<li>Replace <code>#7c3aed</code> (purple) with your primary color</li>
<li>Replace <code>#06b6d4</code> (cyan) with your secondary color</li>
<li>Replace <code>#0a0a0f</code> (dark bg) with your background color</li>
</ul>` },
    ]
  },
]

export default function Course() {
  const [openModule,  setOpenModule]  = useState(null)
  const [openLesson,  setOpenLesson]  = useState(null)
  return (
    <div className="course-page page-section">
      <div className="container">
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1>CSS & JS Animation <span className="gradient-text">Course</span></h1>
          <p>Free complete course — from beginner to advanced. Learn to create stunning animations with live examples.</p>
        </div>
        <div className="course-meta">
          <span>📚 {modules.length} Modules</span>
          <span>🎯 {modules.reduce((a,m)=>a+m.lessons.length,0)} Lessons</span>
          <span>💰 100% Free</span>
          <span>⚡ Live Examples</span>
        </div>
        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_COURSE}/></div>
        <div className="modules-list">
          {modules.map(mod => (
            <div key={mod.id} className={`module-card ${openModule===mod.id?'open':''}`}>
              <button className="module-header" onClick={() => setOpenModule(openModule===mod.id?null:mod.id)}>
                <div className="module-info">
                  <span className="module-icon">{mod.icon}</span>
                  <div><h3>{mod.title}</h3><p>{mod.desc}</p></div>
                </div>
                <span className="module-chevron">{openModule===mod.id?'▲':'▼'}</span>
              </button>
              {openModule===mod.id && (
                <div className="lessons-list">
                  {mod.lessons.map((lesson,i) => (
                    <div key={i} className="lesson-item">
                      <button className="lesson-header" onClick={() => setOpenLesson(openLesson===`${mod.id}-${i}`?null:`${mod.id}-${i}`)}>
                        <span className="lesson-num">{mod.id}.{i+1}</span>
                        <span className="lesson-title">{lesson.title}</span>
                        <span>{openLesson===`${mod.id}-${i}`?'▲':'▼'}</span>
                      </button>
                      {openLesson===`${mod.id}-${i}` && (
                        <div className="lesson-content prose" dangerouslySetInnerHTML={{__html:lesson.content}}/>
                      )}
                    </div>
                  ))}
                  <div className="try-link-row">
                    <Link to="/playground" className="btn-primary try-link">⚡ Try in Playground</Link>
                  </div>
                  {mod.id % 2 === 0 && <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_COURSE}/></div>}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_COURSE}/></div>
      </div>
    </div>
  )
}
