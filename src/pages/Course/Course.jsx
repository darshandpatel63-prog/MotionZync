import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './Course.css'

const modules = [
  {
    id:1, icon:'🎯', level:'Beginner', title:'Module 1: CSS Animation Basics',
    desc:'Learn the fundamentals of CSS animations from scratch. No prior experience required.',
    lessons:[
      { title:'What is CSS Animation?', content:`CSS animation allows HTML elements to gradually change from one style to another without JavaScript.\n\n<h3>Key Properties:</h3>\n<pre><code>animation-name: links to @keyframes\nanimation-duration: how long it runs\nanimation-timing-function: speed curve\nanimation-iteration-count: repeat times\nanimation-direction: forward/backward\nanimation-fill-mode: state before/after\n\n.box {\n  animation: myAnim 2s ease-in-out infinite;\n}\n\n@keyframes myAnim {\n  0%   { transform: scale(1); }\n  50%  { transform: scale(1.5); }\n  100% { transform: scale(1); }\n}</code></pre>\n\n<h3>Try it in Playground:</h3>\n<pre><code>/* CSS */\n.pulse {\n  width: 80px; height: 80px;\n  background: #7c3aed;\n  border-radius: 50%;\n  animation: pulse 1.5s ease-in-out infinite;\n}\n@keyframes pulse {\n  0%, 100% { transform: scale(1); opacity: 1; }\n  50%       { transform: scale(1.3); opacity: 0.7; }\n}\n\n/* JS */\nconst c = document.getElementById('container');\nc.style.cssText = 'display:flex;align-items:center;justify-content:center;';\nconst d = document.createElement('div');\nd.className = 'pulse';\nc.appendChild(d);</code></pre>` },
      { title:'Transform: Move, Scale, Rotate', content:`<h3>Transform Functions:</h3>\n<pre><code>transform: translate(100px, 50px);\ntransform: translateX(100px);\ntransform: scale(1.5);\ntransform: rotate(45deg);\ntransform: skew(20deg, 10deg);\ntransform: translate(50px) rotate(45deg) scale(1.2);</code></pre>\n\n<h3>Spinning Border Example:</h3>\n<pre><code>/* CSS */\n.spinner {\n  width: 80px; height: 80px;\n  border: 4px solid #2d2d44;\n  border-top-color: #7c3aed;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin { to { transform: rotate(360deg); } }\n\n/* JS */\nconst c = document.getElementById('container');\nc.style.cssText = 'display:flex;align-items:center;justify-content:center;';\nconst d = document.createElement('div');\nd.className = 'spinner';\nc.appendChild(d);</code></pre>` },
      { title:'Timing Functions & Easing', content:`<h3>Built-in Timing Functions:</h3>\n<pre><code>animation-timing-function: linear;\nanimation-timing-function: ease;\nanimation-timing-function: ease-in;\nanimation-timing-function: ease-out;\nanimation-timing-function: ease-in-out;\nanimation-timing-function: steps(4);\nanimation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);</code></pre>\n\n<h3>Bouncy Ball Example:</h3>\n<pre><code>/* CSS */\n.ball {\n  width: 60px; height: 60px;\n  background: radial-gradient(circle at 35% 35%, #a855f7, #7c3aed);\n  border-radius: 50%;\n  animation: bounce 1s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate;\n  box-shadow: 0 10px 20px rgba(124,58,237,0.4);\n}\n@keyframes bounce {\n  from { transform: translateY(80px); }\n  to   { transform: translateY(-80px); }\n}</code></pre>` },
    ]
  },
  {
    id:2, icon:'🎨', level:'Beginner', title:'Module 2: Advanced CSS Techniques',
    desc:'Gradients, filters, clip-path, and multi-element animations.',
    lessons:[
      { title:'Gradient Animations', content:`<h3>Animated Gradient Background:</h3>\n<pre><code>/* CSS */\n.gradient-bg {\n  position: absolute; inset: 0;\n  background: linear-gradient(-45deg, #7c3aed, #06b6d4, #10b981, #f59e0b);\n  background-size: 400% 400%;\n  animation: gradientShift 6s ease infinite;\n}\n@keyframes gradientShift {\n  0%   { background-position: 0% 50%; }\n  50%  { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}</code></pre>` },
      { title:'Filter & Blur Effects', content:`<h3>CSS Filter Functions:</h3>\n<pre><code>filter: blur(10px);\nfilter: brightness(1.5);\nfilter: contrast(2);\nfilter: hue-rotate(90deg);\nfilter: saturate(2);\nfilter: drop-shadow(0 0 10px #7c3aed);</code></pre>\n\n<h3>Glow Pulse Example:</h3>\n<pre><code>/* CSS */\n.glow-box {\n  width: 120px; height: 120px;\n  background: #7c3aed;\n  border-radius: 20px;\n  animation: glowPulse 2s ease-in-out infinite;\n}\n@keyframes glowPulse {\n  0%,100% { filter: drop-shadow(0 0 8px #7c3aed); }\n  50%     { filter: drop-shadow(0 0 30px #a855f7) drop-shadow(0 0 60px #7c3aed); }\n}</code></pre>` },
      { title:'Morphing Shapes with border-radius', content:`<h3>Morphing Blob:</h3>\n<pre><code>/* CSS */\n.blob {\n  width: 200px; height: 200px;\n  background: linear-gradient(135deg, #7c3aed, #06b6d4);\n  animation: morph 8s ease-in-out infinite;\n}\n@keyframes morph {\n  0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }\n  25%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }\n  50%  { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }\n  75%  { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }\n}</code></pre>` },
    ]
  },
  {
    id:3, icon:'⚡', level:'Intermediate', title:'Module 3: JavaScript Canvas Animations',
    desc:'Create advanced animations using HTML5 Canvas and requestAnimationFrame.',
    lessons:[
      { title:'Canvas Basics', content:`<h3>Canvas Setup (always start like this):</h3>\n<pre><code>const el = document.getElementById('container');\nconst canvas = document.createElement('canvas');\nconst ctx = canvas.getContext('2d');\ncanvas.width  = el.offsetWidth  || 400;\ncanvas.height = el.offsetHeight || 500;\nel.appendChild(canvas);\nconst W = canvas.width;\nconst H = canvas.height;</code></pre>\n\n<h3>Drawing Shapes:</h3>\n<pre><code>// Rectangle\nctx.fillStyle = '#7c3aed';\nctx.fillRect(50, 50, 100, 60);\n\n// Circle\nctx.beginPath();\nctx.arc(200, 150, 40, 0, Math.PI * 2);\nctx.fillStyle = '#06b6d4';\nctx.fill();</code></pre>` },
      { title:'requestAnimationFrame Loop', content:`<h3>Basic Animation Loop (60 FPS):</h3>\n<pre><code>const el = document.getElementById('container');\nconst c = document.createElement('canvas');\nconst ctx = c.getContext('2d');\nc.width = el.offsetWidth || 400;\nc.height = el.offsetHeight || 500;\nel.appendChild(c);\n\nlet x = 0;\n\nfunction animate() {\n  // 1. Clear canvas\n  ctx.clearRect(0, 0, c.width, c.height);\n  \n  // 2. Draw\n  ctx.beginPath();\n  ctx.arc(x, c.height/2, 20, 0, Math.PI * 2);\n  ctx.fillStyle = '#7c3aed';\n  ctx.shadowColor = '#a855f7';\n  ctx.shadowBlur = 20;\n  ctx.fill();\n  \n  // 3. Update\n  x = (x + 2) % c.width;\n  \n  // 4. Next frame\n  requestAnimationFrame(animate);\n}\nanimate();</code></pre>\n\n<h3>Trail Effect (partial clear):</h3>\n<pre><code>// Instead of clearRect, use semi-transparent fill:\nctx.fillStyle = 'rgba(10, 10, 15, 0.1)';\nctx.fillRect(0, 0, c.width, c.height);\n// Leaves a beautiful fading trail!</code></pre>` },
      { title:'Particle Systems', content:`<h3>100-Particle System:</h3>\n<pre><code>const el = document.getElementById('container');\nconst c = document.createElement('canvas');\nconst ctx = c.getContext('2d');\nc.width = el.offsetWidth || 400;\nc.height = el.offsetHeight || 500;\nel.appendChild(c);\nconst W = c.width, H = c.height;\n\nconst particles = Array.from({ length: 100 }, () => ({\n  x:    Math.random() * W,\n  y:    Math.random() * H,\n  vx:   (Math.random() - 0.5) * 2,\n  vy:   (Math.random() - 0.5) * 2,\n  size: Math.random() * 3 + 1,\n  hue:  Math.random() * 60 + 240,\n}));\n\nfunction draw() {\n  ctx.fillStyle = 'rgba(10,10,15,0.08)';\n  ctx.fillRect(0, 0, W, H);\n  \n  particles.forEach(p => {\n    p.x += p.vx; p.y += p.vy;\n    if (p.x < 0 || p.x > W) p.vx *= -1;\n    if (p.y < 0 || p.y > H) p.vy *= -1;\n    \n    ctx.beginPath();\n    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);\n    ctx.fillStyle = \`hsl(\${p.hue}, 90%, 70%)\`;\n    ctx.shadowColor = \`hsl(\${p.hue}, 90%, 60%)\`;\n    ctx.shadowBlur = 10;\n    ctx.fill();\n  });\n  requestAnimationFrame(draw);\n}\ndraw();</code></pre>` },
    ]
  },
  {
    id:4, icon:'🔧', level:'Intermediate', title:'Module 4: Animations in Your Projects',
    desc:'How to add animations to HTML, React, Vue, and Angular projects.',
    lessons:[
      { title:'Adding to HTML Website', content:`<h3>Method 1: Direct HTML (Simplest)</h3>\n<pre><code>&lt;div id="animation-container" style="width:100%;height:400px;position:relative;"&gt;&lt;/div&gt;\n\n&lt;style&gt;\n/* PASTE YOUR CSS HERE */\n&lt;/style&gt;\n\n&lt;script&gt;\n// PASTE YOUR JS HERE\n&lt;/script&gt;</code></pre>\n\n<h3>Method 2: As Full-Screen Background</h3>\n<pre><code>.animation-bg {\n  position: fixed;\n  top: 0; left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -1;\n  overflow: hidden;\n}</code></pre>` },
      { title:'Using in React', content:`<h3>React Component with useEffect:</h3>\n<pre><code>import { useEffect, useRef } from 'react';\n\nfunction AnimationBackground({ cssCode, jsCode }) {\n  const containerRef = useRef(null);\n  \n  useEffect(() => {\n    const style = document.createElement('style');\n    style.textContent = cssCode;\n    document.head.appendChild(style);\n    \n    // Only for trusted code from MotionZync\n    const fn = new Function(jsCode);\n    fn();\n    \n    return () => document.head.removeChild(style);\n  }, []);\n  \n  return &lt;div ref={containerRef} id="container" style={{width:'100%',height:'100%'}}/&gt;;\n}</code></pre>` },
      { title:'Making Animations Responsive', content:`<h3>Responsive Canvas:</h3>\n<pre><code>function resize() {\n  c.width  = el.offsetWidth;\n  c.height = el.offsetHeight;\n}\nresize();\nwindow.addEventListener('resize', resize);</code></pre>\n\n<h3>Mobile Performance:</h3>\n<pre><code>const isMobile = window.innerWidth < 768;\nconst particleCount = isMobile ? 30 : 100;\n\n// Use simpler animations on mobile\nconst animDuration = isMobile ? '2s' : '1.5s';</code></pre>` },
    ]
  },
  {
    id:5, icon:'🚀', level:'Advanced', title:'Module 5: Advanced Canvas Techniques',
    desc:'WebGL concepts, complex particle systems, mouse interaction, and performance optimization.',
    lessons:[
      { title:'Mouse Interaction', content:`<h3>Mouse-Reactive Particles:</h3>\n<pre><code>const el = document.getElementById('container');\nconst c = document.createElement('canvas');\nconst ctx = c.getContext('2d');\nc.width = el.offsetWidth || 400;\nc.height = el.offsetHeight || 500;\nel.appendChild(c);\nconst W = c.width, H = c.height;\n\nlet mouse = { x: W/2, y: H/2 };\nc.addEventListener('mousemove', e => {\n  const rect = c.getBoundingClientRect();\n  mouse.x = e.clientX - rect.left;\n  mouse.y = e.clientY - rect.top;\n});\n\nconst particles = Array.from({length:80},()=>({\n  x: Math.random()*W, y: Math.random()*H,\n  vx:0, vy:0, size: Math.random()*3+1,\n  hue: 240+Math.random()*60\n}));\n\nfunction draw() {\n  ctx.fillStyle='rgba(8,8,20,0.1)';\n  ctx.fillRect(0,0,W,H);\n  particles.forEach(p => {\n    const dx = mouse.x - p.x, dy = mouse.y - p.y;\n    const dist = Math.sqrt(dx*dx+dy*dy);\n    if(dist<100){ p.vx += dx/dist*0.5; p.vy += dy/dist*0.5; }\n    p.vx*=0.95; p.vy*=0.95;\n    p.x+=p.vx; p.y+=p.vy;\n    if(p.x<0||p.x>W) p.vx*=-1;\n    if(p.y<0||p.y>H) p.vy*=-1;\n    ctx.beginPath();\n    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);\n    ctx.fillStyle=\`hsl(\${p.hue},80%,65%)\`;\n    ctx.shadowBlur=8;ctx.shadowColor=\`hsl(\${p.hue},80%,60%)\`;\n    ctx.fill();ctx.shadowBlur=0;\n  });\n  requestAnimationFrame(draw);\n}\ndraw();</code></pre>` },
      { title:'Constellation Network Effect', content:`<h3>Connected Particles (Constellation):</h3>\n<pre><code>const el = document.getElementById('container');\nconst c = document.createElement('canvas');\nconst ctx = c.getContext('2d');\nc.width = el.offsetWidth || 400;\nc.height = el.offsetHeight || 500;\nel.appendChild(c);\nconst W=c.width,H=c.height;\n\nconst pts = Array.from({length:60},()=>({\n  x:Math.random()*W, y:Math.random()*H,\n  vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4\n}));\n\nfunction draw(){\n  ctx.clearRect(0,0,W,H);\n  ctx.fillStyle='#04040e'; ctx.fillRect(0,0,W,H);\n  \n  for(let i=0;i<pts.length;i++){\n    for(let j=i+1;j<pts.length;j++){\n      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;\n      const d=Math.sqrt(dx*dx+dy*dy);\n      if(d<100){\n        ctx.beginPath();\n        ctx.moveTo(pts[i].x,pts[i].y);\n        ctx.lineTo(pts[j].x,pts[j].y);\n        ctx.strokeStyle=\`rgba(124,58,237,\${1-d/100})\`;\n        ctx.lineWidth=.5; ctx.stroke();\n      }\n    }\n  }\n  \n  pts.forEach(p=>{\n    p.x+=p.vx; p.y+=p.vy;\n    if(p.x<0||p.x>W) p.vx*=-1;\n    if(p.y<0||p.y>H) p.vy*=-1;\n    ctx.beginPath(); ctx.arc(p.x,p.y,2,0,Math.PI*2);\n    ctx.fillStyle='#7c3aed'; ctx.fill();\n  });\n  requestAnimationFrame(draw);\n}\ndraw();</code></pre>` },
      { title:'Performance Optimization', content:`<h3>Key Performance Tips:</h3>\n<pre><code>// 1. Use offscreen canvas for complex operations\nconst offscreen = document.createElement('canvas');\nconst offCtx = offscreen.getContext('2d');\n// Draw complex stuff on offscreen, then:\nctx.drawImage(offscreen, 0, 0);\n\n// 2. Limit particle count based on device\nconst particleCount = navigator.hardwareConcurrency >= 4 ? 150 : 50;\n\n// 3. Use integer positions (faster rendering)\np.x = Math.round(p.x);\np.y = Math.round(p.y);\n\n// 4. Reduce shadowBlur on mobile\nconst blur = window.innerWidth < 768 ? 0 : 10;\nctx.shadowBlur = blur;\n\n// 5. Use will-change for CSS animations\n.animated-element {\n  will-change: transform, opacity;\n}</code></pre>` },
    ]
  },
  {
    id:6, icon:'💎', level:'Advanced', title:'Module 6: Professional Animation Patterns',
    desc:'Scroll animations, staggered reveals, timeline orchestration, and production patterns.',
    lessons:[
      { title:'Scroll Reveal Animations', content:`<h3>Intersection Observer for Scroll Animations:</h3>\n<pre><code>/* CSS */\n.reveal {\n  opacity: 0;\n  transform: translateY(30px);\n  transition: opacity 0.6s ease, transform 0.6s ease;\n}\n.reveal.visible {\n  opacity: 1;\n  transform: translateY(0);\n}\n\n/* JS */\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      entry.target.classList.add('visible');\n      observer.unobserve(entry.target); // Only trigger once\n    }\n  });\n}, { threshold: 0.1 });\n\ndocument.querySelectorAll('.reveal').forEach(el => {\n  observer.observe(el);\n});</code></pre>` },
      { title:'Staggered Animations', content:`<h3>CSS Stagger with animation-delay:</h3>\n<pre><code>/* CSS */\n.stagger-item {\n  opacity: 0;\n  transform: translateY(20px);\n  animation: slideUp 0.5s ease forwards;\n}\n\n/* JS - set delay per item */\ndocument.querySelectorAll('.stagger-item').forEach((el, i) => {\n  el.style.animationDelay = \`\${i * 0.1}s\`;\n});\n\n@keyframes slideUp {\n  to { opacity: 1; transform: translateY(0); }\n}</code></pre>` },
      { title:'AnimCreator Export Integration', content:`<h3>Using AnimCreator-Exported Code:</h3>\n<pre><code>// 1. Export from AnimCreator (click Export → CSS+JS)\n\n// 2. In your HTML file:\n&lt;div id="container" class="my-animation"&gt;&lt;/div&gt;\n\n&lt;style&gt;\n/* PASTE ANIMCREATOR CSS HERE */\n.my-animation {\n  width: 100%; height: 400px;\n  position: relative; overflow: hidden;\n}\n&lt;/style&gt;\n\n&lt;script&gt;\n// PASTE ANIMCREATOR JS HERE\n&lt;/script&gt;\n\n// 3. In React:\nimport { useEffect } from 'react';\nfunction MyAnimation() {\n  useEffect(() => {\n    // Paste exported JS here\n  }, []);\n  return &lt;div id="container" style={{height:400}}/&gt;;\n}</code></pre>` },
    ]
  },
  {
    id:7, icon:'🌐', level:'Advanced', title:'Module 7: Three.js & WebGL Basics',
    desc:'Introduction to 3D animations in the browser using Three.js.',
    lessons:[
      { title:'Three.js Setup in Browser', content:`<h3>Three.js via CDN (no install needed):</h3>\n<pre><code>&lt;script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"&gt;&lt;/script&gt;\n\n// Basic Three.js scene\nconst container = document.getElementById('container');\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });\nrenderer.setSize(container.offsetWidth, container.offsetHeight);\ncontainer.appendChild(renderer.domElement);\n\n// Add a rotating cube\nconst geometry = new THREE.BoxGeometry();\nconst material = new THREE.MeshPhongMaterial({ color: 0x7c3aed, wireframe: false });\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\n\n// Add light\nconst light = new THREE.DirectionalLight(0xffffff, 1);\nlight.position.set(5, 5, 5);\nscene.add(light);\n\ncamera.position.z = 3;\n\nfunction animate() {\n  requestAnimationFrame(animate);\n  cube.rotation.x += 0.01;\n  cube.rotation.y += 0.01;\n  renderer.render(scene, camera);\n}\nanimate();</code></pre>` },
      { title:'3D Particle Sphere', content:`<h3>3D Sphere of Particles:</h3>\n<pre><code>const container = document.getElementById('container');\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, container.offsetWidth/container.offsetHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });\nrenderer.setSize(container.offsetWidth, container.offsetHeight);\ncontainer.appendChild(renderer.domElement);\n\n// Create particle sphere\nconst count = 2000;\nconst positions = new Float32Array(count * 3);\nfor(let i = 0; i < count; i++) {\n  const theta = Math.random() * Math.PI * 2;\n  const phi = Math.acos(2 * Math.random() - 1);\n  const r = 2;\n  positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);\n  positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);\n  positions[i*3+2] = r * Math.cos(phi);\n}\n\nconst geometry = new THREE.BufferGeometry();\ngeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));\nconst material = new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.05 });\nconst points = new THREE.Points(geometry, material);\nscene.add(points);\n\ncamera.position.z = 5;\nfunction animate() {\n  requestAnimationFrame(animate);\n  points.rotation.y += 0.003;\n  renderer.render(scene, camera);\n}\nanimate();</code></pre>` },
      { title:'GSAP-Style Animations (CSS)', content:`<h3>Professional Motion Design (Pure CSS):</h3>\n<pre><code>/* Timeline-like animation using animation-delay */\n.hero-badge    { animation: fadeUp .5s .0s ease both; }\n.hero-title    { animation: fadeUp .6s .1s ease both; }\n.hero-subtitle { animation: fadeUp .6s .2s ease both; }\n.hero-cta      { animation: fadeUp .6s .3s ease both; }\n\n@keyframes fadeUp {\n  from { opacity:0; transform:translateY(20px); }\n  to   { opacity:1; transform:translateY(0); }\n}\n\n/* Cinematic entrance */\n.cinematic-reveal {\n  animation: cinematic 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;\n}\n@keyframes cinematic {\n  from { opacity:0; transform:scale(.95) translateY(30px); filter:blur(8px); }\n  to   { opacity:1; transform:scale(1) translateY(0); filter:blur(0); }\n}</code></pre>` },
    ]
  },
  {
    id:8, icon:'🏆', level:'Pro', title:'Module 8: Production-Ready Animation Systems',
    desc:'Build a complete animation system for a real-world SaaS or portfolio website.',
    lessons:[
      { title:'Animation System Architecture', content:`<h3>Professional Animation Setup:</h3>\n<pre><code>// animations.js — centralized animation system\n\nconst AnimSystem = {\n  // 1. Intersection observer for all reveals\n  initReveal() {\n    const io = new IntersectionObserver(entries => {\n      entries.forEach(e => {\n        if (e.isIntersecting) {\n          e.target.style.animationPlayState = 'running';\n          io.unobserve(e.target);\n        }\n      });\n    }, { threshold: 0.1 });\n    document.querySelectorAll('[data-reveal]').forEach(el => {\n      el.style.animationPlayState = 'paused';\n      io.observe(el);\n    });\n  },\n  \n  // 2. Stagger children of a container\n  stagger(selector, delay = 0.08) {\n    document.querySelectorAll(selector).forEach((el, i) => {\n      el.style.animationDelay = \`\${i * delay}s\`;\n    });\n  },\n  \n  // 3. Reduced motion support\n  respectMotionPreference() {\n    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {\n      document.documentElement.style.setProperty('--anim-duration', '0.01s');\n    }\n  },\n  \n  init() {\n    this.initReveal();\n    this.stagger('.feature-card');\n    this.respectMotionPreference();\n  }\n};\n\nAnimSystem.init();</code></pre>` },
      { title:'Accessibility: prefers-reduced-motion', content:`<h3>Always respect user motion preferences:</h3>\n<pre><code>/* CSS — wrap all animations */\n@media (prefers-reduced-motion: no-preference) {\n  .animated-element {\n    animation: myAnim 1s ease infinite;\n  }\n  .transition-element {\n    transition: transform 0.3s ease;\n  }\n}\n\n/* Minimal safe version for reduced motion */\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}</code></pre>` },
      { title:'Deploy Your Animated Website', content:`<h3>Deployment Checklist:</h3>\n<pre><code>// 1. Performance check\n- Chrome DevTools > Performance > Record page load\n- Target: 60 FPS, First Contentful Paint < 1.5s\n\n// 2. Reduce animation cost\n- Only animate: transform, opacity (GPU-accelerated)\n- Avoid animating: width, height, top, left (causes reflow)\n\n// 3. Lazy-load heavy animations\nconst observer = new IntersectionObserver(entries => {\n  entries.forEach(e => {\n    if (e.isIntersecting) {\n      // Load and start animation\n      import('./animations/hero.js').then(m => m.init());\n      observer.disconnect();\n    }\n  });\n});\nobserver.observe(document.querySelector('.hero'));\n\n// 4. Use will-change sparingly\n.heavy-animation {\n  will-change: transform; /* Only if needed */\n}\n\n// 5. Deploy to Vercel/Netlify (free)\n// Just push to GitHub — auto-deploys!</code></pre>` },
    ]
  },
]

export default function Course() {
  const [openModule,  setOpenModule]  = useState(null)
  const [openLesson,  setOpenLesson]  = useState(null)

  const levelColors = {
    'Beginner':     { bg:'rgba(16,185,129,.1)',  border:'rgba(16,185,129,.25)', color:'#34d399' },
    'Intermediate': { bg:'rgba(245,158,11,.1)',  border:'rgba(245,158,11,.25)', color:'#fbbf24' },
    'Advanced':     { bg:'rgba(239,68,68,.1)',   border:'rgba(239,68,68,.25)',  color:'#f87171' },
    'Pro':          { bg:'rgba(124,58,237,.15)', border:'rgba(124,58,237,.4)', color:'#a78bfa' },
  }

  return (
    <div className="course-page page-section">
      <div className="container">
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1>CSS & JS Animation <span className="gradient-text">Course</span></h1>
          <p>Free complete course — from absolute beginner to production-ready professional. 8 modules, 24+ lessons, live examples.</p>
        </div>

        <div className="course-meta">
          <span>📚 {modules.length} Modules</span>
          <span>🎯 {modules.reduce((a,m)=>a+m.lessons.length,0)} Lessons</span>
          <span>💰 100% Free</span>
          <span>⚡ Live Examples</span>
          <span>🏆 Beginner → Pro</span>
        </div>

        {/* Level legend */}
        <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem',marginBottom:'1.5rem'}}>
          {Object.entries(levelColors).map(([level,{bg,border,color}])=>(
            <span key={level} style={{background:bg,border:`1px solid ${border}`,color,padding:'.25rem .7rem',borderRadius:'20px',fontSize:'.75rem',fontWeight:700}}>
              {level==='Beginner'?'🟢':level==='Intermediate'?'🟡':level==='Advanced'?'🔴':'💜'} {level}
            </span>
          ))}
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_COURSE}/></div>

        <div className="modules-list">
          {modules.map(mod => {
            const lc = levelColors[mod.level] || levelColors.Beginner
            return (
              <div key={mod.id} className={`module-card ${openModule===mod.id?'open':''}`}>
                <button className="module-header" onClick={() => setOpenModule(openModule===mod.id?null:mod.id)}>
                  <div className="module-info">
                    <span className="module-icon">{mod.icon}</span>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.2rem'}}>
                        <h3 style={{margin:0}}>{mod.title}</h3>
                        <span style={{background:lc.bg,border:`1px solid ${lc.border}`,color:lc.color,padding:'.15rem .5rem',borderRadius:'20px',fontSize:'.68rem',fontWeight:700,flexShrink:0}}>{mod.level}</span>
                      </div>
                      <p>{mod.desc}</p>
                    </div>
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
                      <Link to="/anim-creator" className="btn-secondary try-link">🎬 Open AnimCreator</Link>
                    </div>
                    {mod.id % 2 === 0 && <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_COURSE}/></div>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="ad-zone"><AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_COURSE}/></div>

        <div style={{marginTop:'2rem',padding:'2rem',background:'rgba(124,58,237,.07)',border:'1px solid rgba(124,58,237,.15)',borderRadius:'14px',textAlign:'center'}}>
          <h3 style={{fontSize:'1.1rem',fontWeight:800,marginBottom:'.5rem'}}>Ready to apply what you learned?</h3>
          <div style={{display:'flex',gap:'.7rem',justifyContent:'center',flexWrap:'wrap',marginTop:'1rem'}}>
            <Link to="/playground" className="btn-primary">⚡ Open Playground</Link>
            <Link to="/gallery" className="btn-secondary">🎨 Browse Gallery</Link>
            <Link to="/anim-creator" className="btn-secondary">🎬 AnimCreator</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
