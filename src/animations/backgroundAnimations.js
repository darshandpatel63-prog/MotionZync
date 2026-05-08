/**
 * animations/backgroundAnimations.js
 * Tamara background animations yahan add karo
 * Drek animation ma: id, title, description, category, cssCode, jsCode
 */

export const backgroundAnimations = [
  {
    id: 'bg-particles',
    title: 'Floating Particles',
    description: 'Dark background par sona particles fade in fade out thay chhe.',
    category: 'Background',
    previewBg: '#0a0a0f',
    cssCode: `
.particle {
  position: absolute;
  border-radius: 50%;
  animation: float linear infinite;
  opacity: 0;
}
@keyframes float {
  0%   { transform: translateY(100vh) scale(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}`,
    jsCode: `
const container = document.getElementById('container');
const colors = ['#7c3aed', '#06b6d4', '#a855f7', '#10b981', '#f59e0b'];

for (let i = 0; i < 40; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 6 + 2;
  p.style.cssText = \`
    width: \${size}px;
    height: \${size}px;
    left: \${Math.random() * 100}%;
    background: \${colors[Math.floor(Math.random() * colors.length)]};
    animation-duration: \${Math.random() * 8 + 4}s;
    animation-delay: \${Math.random() * 6}s;
    box-shadow: 0 0 \${size * 2}px currentColor;
  \`;
  container.appendChild(p);
}`
  },

  {
    id: 'bg-aurora',
    title: 'Aurora Waves',
    description: 'Northern lights jevi slow gradient waves.',
    category: 'Background',
    previewBg: '#050510',
    cssCode: `
body { background: #050510; }
.aurora {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 50% at 20% 50%, rgba(124,58,237,0.4), transparent),
    radial-gradient(ellipse 60% 40% at 80% 30%, rgba(6,182,212,0.35), transparent),
    radial-gradient(ellipse 70% 60% at 50% 80%, rgba(16,185,129,0.3), transparent);
  animation: aurora 8s ease-in-out infinite alternate;
  filter: blur(40px);
}
@keyframes aurora {
  0%   { transform: scale(1) rotate(0deg); opacity: 0.7; }
  50%  { transform: scale(1.1) rotate(2deg); opacity: 1; }
  100% { transform: scale(0.95) rotate(-2deg); opacity: 0.8; }
}`,
    jsCode: `
const container = document.getElementById('container');
const div = document.createElement('div');
div.className = 'aurora';
container.appendChild(div);`
  },

  {
    id: 'bg-matrix',
    title: 'Matrix Rain',
    description: 'Classic matrix style falling characters.',
    category: 'Background',
    previewBg: '#000000',
    cssCode: `
canvas { display: block; }`,
    jsCode: `
const container = document.getElementById('container');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = container.offsetWidth || 400;
canvas.height = container.offsetHeight || 400;
container.appendChild(canvas);

const cols = Math.floor(canvas.width / 16);
const drops = Array(cols).fill(1);
const chars = 'アイウエオカキクケコ0123456789ABCDEF';

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00ff41';
  ctx.font = '14px monospace';
  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * 16, y * 16);
    if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(draw, 40);`
  },
]

export default backgroundAnimations
