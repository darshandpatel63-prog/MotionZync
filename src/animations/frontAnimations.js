/**
 * animations/frontAnimations.js
 * Tamara front/UI animations yahan add karo
 */

export const frontAnimations = [
  {
    id: 'front-neon-pulse',
    title: 'Neon Glow Pulse',
    description: 'Purple neon glow thatu box.',
    category: 'Front',
    previewBg: '#0a0a0f',
    cssCode: `
.neon-box {
  width: 100px;
  height: 100px;
  border: 2px solid #a855f7;
  border-radius: 12px;
  animation: neonPulse 2s ease-in-out infinite;
}
@keyframes neonPulse {
  0%, 100% {
    box-shadow:
      0 0 5px #a855f7,
      0 0 20px #a855f7,
      0 0 40px #7c3aed;
  }
  50% {
    box-shadow:
      0 0 10px #a855f7,
      0 0 40px #a855f7,
      0 0 80px #7c3aed,
      0 0 120px #7c3aed;
  }
}`,
    jsCode: `
const container = document.getElementById('container');
container.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const box = document.createElement('div');
box.className = 'neon-box';
container.appendChild(box);`
  },

  {
    id: 'front-typewriter',
    title: 'Typewriter Effect',
    description: 'Text typewriter jemi type thay.',
    category: 'Front',
    previewBg: '#0a0a0f',
    cssCode: `
.typewriter {
  font-family: monospace;
  font-size: 1.6rem;
  color: #06b6d4;
  border-right: 2px solid #06b6d4;
  white-space: nowrap;
  overflow: hidden;
  animation:
    typing 3s steps(20) infinite alternate,
    blink 0.7s step-end infinite;
}
@keyframes typing {
  from { width: 0; }
  to   { width: 100%; }
}
@keyframes blink {
  50% { border-color: transparent; }
}`,
    jsCode: `
const container = document.getElementById('container');
container.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:2rem;';
const el = document.createElement('div');
el.className = 'typewriter';
el.textContent = 'Hello, AnimateX! ✦';
container.appendChild(el);`
  },

  {
    id: 'front-morphing-blob',
    title: 'Morphing Blob',
    description: 'Shape badlatu animated blob.',
    category: 'Front',
    previewBg: '#0a0a0f',
    cssCode: `
.blob {
  width: 160px;
  height: 160px;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  animation: morph 6s ease-in-out infinite;
  filter: blur(1px);
}
@keyframes morph {
  0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50%  { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
  75%  { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
}`,
    jsCode: `
const container = document.getElementById('container');
container.style.cssText = 'display:flex;align-items:center;justify-content:center;';
const blob = document.createElement('div');
blob.className = 'blob';
container.appendChild(blob);`
  },
]

export default frontAnimations
