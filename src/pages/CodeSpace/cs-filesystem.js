// ============================================================
// cs-filesystem.js  –  Virtual file system & project templates
// ============================================================

export const LANG_MAP = {
  html: { label: 'HTML',       icon: '🌐', color: '#f97316', mime: 'text/html' },
  css:  { label: 'CSS',        icon: '🎨', color: '#06b6d4', mime: 'text/css' },
  js:   { label: 'JavaScript', icon: '⚡', color: '#f59e0b', mime: 'text/javascript' },
  ts:   { label: 'TypeScript', icon: '🔷', color: '#3178c6', mime: 'text/typescript' },
  jsx:  { label: 'React JSX',  icon: '⚛️', color: '#61dafb', mime: 'text/jsx' },
  tsx:  { label: 'React TSX',  icon: '⚛️', color: '#61dafb', mime: 'text/tsx' },
  vue:  { label: 'Vue',        icon: '💚', color: '#42b883', mime: 'text/vue' },
  svelte:{ label:'Svelte',     icon: '🔥', color: '#ff3e00', mime: 'text/svelte' },
  py:   { label: 'Python',     icon: '🐍', color: '#3572a5', mime: 'text/x-python' },
  rs:   { label: 'Rust',       icon: '🦀', color: '#dea584', mime: 'text/x-rust' },
  go:   { label: 'Go',         icon: '🐹', color: '#00add8', mime: 'text/x-go' },
  java: { label: 'Java',       icon: '☕', color: '#b07219', mime: 'text/x-java' },
  cpp:  { label: 'C++',        icon: '⚙️', color: '#f34b7d', mime: 'text/x-c++src' },
  c:    { label: 'C',          icon: '⚙️', color: '#555555', mime: 'text/x-csrc' },
  cs:   { label: 'C#',         icon: '🔵', color: '#178600', mime: 'text/x-csharp' },
  php:  { label: 'PHP',        icon: '🐘', color: '#4f5d95', mime: 'text/x-php' },
  rb:   { label: 'Ruby',       icon: '💎', color: '#701516', mime: 'text/x-ruby' },
  swift:{ label: 'Swift',      icon: '🍎', color: '#f05138', mime: 'text/x-swift' },
  kt:   { label: 'Kotlin',     icon: '🎯', color: '#a97bff', mime: 'text/x-kotlin' },
  json: { label: 'JSON',       icon: '📋', color: '#f59e0b', mime: 'application/json' },
  yaml: { label: 'YAML',       icon: '📄', color: '#cb171e', mime: 'text/yaml' },
  yml:  { label: 'YAML',       icon: '📄', color: '#cb171e', mime: 'text/yaml' },
  toml: { label: 'TOML',       icon: '📄', color: '#9c4221', mime: 'text/toml' },
  xml:  { label: 'XML',        icon: '📐', color: '#0060ac', mime: 'text/xml' },
  sql:  { label: 'SQL',        icon: '🗄️', color: '#e38c00', mime: 'text/x-sql' },
  md:   { label: 'Markdown',   icon: '📝', color: '#083fa1', mime: 'text/markdown' },
  sh:   { label: 'Shell',      icon: '🖥️', color: '#89e051', mime: 'text/x-sh' },
  bash: { label: 'Bash',       icon: '🖥️', color: '#89e051', mime: 'text/x-sh' },
  dockerfile:{ label:'Dockerfile', icon:'🐳', color:'#0db7ed', mime:'text/plain' },
  env:  { label: '.env',       icon: '🔐', color: '#ecd53f', mime: 'text/plain' },
  txt:  { label: 'Text',       icon: '📄', color: '#888',    mime: 'text/plain' },
  svg:  { label: 'SVG',        icon: '🖼️', color: '#ff9800', mime: 'image/svg+xml' },
  scss: { label: 'SCSS',       icon: '🎨', color: '#c6538c', mime: 'text/x-scss' },
}

export function getLangFromExt(filename) {
  const ext = filename.split('.').pop()?.toLowerCase() || 'txt'
  return LANG_MAP[ext] || LANG_MAP['txt']
}

export function getMonacoLang(filename) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const MAP = {
    js:'javascript', jsx:'javascript', ts:'typescript', tsx:'typescript',
    html:'html', css:'css', scss:'scss', json:'json', md:'markdown',
    py:'python', rs:'rust', go:'go', java:'java', cpp:'cpp', c:'c', cs:'csharp',
    php:'php', rb:'ruby', swift:'swift', kt:'kotlin', sql:'sql',
    yaml:'yaml', yml:'yaml', toml:'toml', xml:'xml', sh:'shell', bash:'shell',
    vue:'html', svelte:'html', dockerfile:'dockerfile', env:'plaintext', txt:'plaintext',
  }
  return MAP[ext] || 'plaintext'
}

// ── File tree utilities ───────────────────────────────────────
export function buildTree(flatFiles) {
  // flatFiles = { 'src/index.js': '...', 'index.html': '...' }
  const root = { name: '', children: {}, type: 'dir' }
  for (const path of Object.keys(flatFiles)) {
    const parts = path.split('/')
    let node = root
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (i === parts.length - 1) {
        node.children[part] = { name: part, path, type: 'file' }
      } else {
        if (!node.children[part]) {
          node.children[part] = { name: part, children: {}, type: 'dir', path: parts.slice(0, i + 1).join('/') }
        }
        node = node.children[part]
      }
    }
  }
  return root
}

export function flattenTree(node, prefix = '') {
  const results = []
  for (const [name, child] of Object.entries(node.children || {})) {
    if (child.type === 'dir') {
      results.push(...flattenTree(child, prefix ? `${prefix}/${name}` : name))
    } else {
      results.push(child.path)
    }
  }
  return results
}

// ── Project templates ─────────────────────────────────────────
export const TEMPLATES = [
  {
    id: 'vanilla',
    name: 'Vanilla HTML/CSS/JS',
    icon: '🌐',
    description: 'Classic web starter with animations',
    category: 'Frontend',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>My App</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="scene">
    <div class="orb" id="orb"></div>
    <h1 class="title">Hello World</h1>
    <p class="sub">Edit me in CodeSpace ✨</p>
  </div>
  <script src="main.js"></script>
</body>
</html>`,
      'style.css': `.scene{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:1.5rem;background:radial-gradient(ellipse at center,#1a0533 0%,#0a0a0f 70%);}
.orb{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#06b6d4);animation:float 3s ease-in-out infinite;box-shadow:0 0 40px rgba(124,58,237,.5);cursor:pointer;}
@keyframes float{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-18px) scale(1.05);}}
.title{font-size:2.5rem;font-weight:900;background:linear-gradient(135deg,#a78bfa,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.sub{color:rgba(255,255,255,.4);font-size:.9rem;text-align:center;}`,
      'main.js': `const orb = document.getElementById('orb')
orb?.addEventListener('click', () => {
  orb.style.background = \`hsl(\${Math.random()*360},70%,60%)\`
  orb.style.transform = 'scale(1.3)'
  setTimeout(() => orb.style.transform = '', 300)
})`,
    },
    entry: 'index.html',
  },
  {
    id: 'react',
    name: 'React App',
    icon: '⚛️',
    description: 'React 18 with hooks and modern patterns',
    category: 'Frontend',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="main.jsx"></script>
</body>
</html>`,
      'main.jsx': `import { createRoot } from 'https://esm.sh/react-dom@18/client'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(<App />)`,
      'App.jsx': `import { useState } from 'https://esm.sh/react@18'

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',minHeight:'100vh',background:'#0a0a0f',color:'#e2e8f0',fontFamily:'system-ui'}}>
      <h1 style={{fontSize:'3rem',background:'linear-gradient(135deg,#a78bfa,#06b6d4)',
        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>React App ⚛️</h1>
      <p style={{color:'rgba(255,255,255,.5)',marginBottom:'2rem'}}>Built with CodeSpace</p>
      <button onClick={() => setCount(c => c+1)}
        style={{padding:'.75rem 2rem',background:'linear-gradient(135deg,#7c3aed,#06b6d4)',
          border:'none',borderRadius:'12px',color:'#fff',fontSize:'1rem',cursor:'pointer',
          transform:'scale(1)',transition:'transform .1s'}}
        onMouseDown={e => e.target.style.transform='scale(.95)'}
        onMouseUp={e => e.target.style.transform='scale(1)'}
      >
        Count: {count}
      </button>
    </div>
  )
}`,
    },
    entry: 'index.html',
  },
  {
    id: 'node-api',
    name: 'Node.js API',
    icon: '🟢',
    description: 'Express REST API with routes',
    category: 'Backend',
    files: {
      'server.js': `const express = require('express')
const app = express()
app.use(express.json())

const items = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' },
]

app.get('/', (req, res) => {
  res.json({ message: 'API is running 🚀', endpoints: ['/api/items'] })
})

app.get('/api/items', (req, res) => {
  res.json(items)
})

app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), ...req.body }
  items.push(item)
  res.status(201).json(item)
})

app.delete('/api/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id == req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  items.splice(idx, 1)
  res.json({ ok: true })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`))`,
      'package.json': `{
  "name": "node-api",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}`,
      '.env': `PORT=3000
NODE_ENV=development`,
      'README.md': `# Node.js API

## Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

## Endpoints
- GET  /api/items
- POST /api/items
- DELETE /api/items/:id`,
    },
    entry: 'server.js',
  },
  {
    id: 'python',
    name: 'Python Script',
    icon: '🐍',
    description: 'Python with type hints and modern patterns',
    category: 'Backend',
    files: {
      'main.py': `#!/usr/bin/env python3
"""
Main entry point
"""
from dataclasses import dataclass
from typing import List, Optional
import json


@dataclass
class Item:
    id: int
    name: str
    done: bool = False

    def to_dict(self) -> dict:
        return {'id': self.id, 'name': self.name, 'done': self.done}


class TodoApp:
    def __init__(self):
        self.items: List[Item] = []
        self._next_id = 1

    def add(self, name: str) -> Item:
        item = Item(id=self._next_id, name=name)
        self.items.append(item)
        self._next_id += 1
        return item

    def complete(self, item_id: int) -> Optional[Item]:
        for item in self.items:
            if item.id == item_id:
                item.done = True
                return item
        return None

    def list(self) -> List[dict]:
        return [i.to_dict() for i in self.items]


def main():
    app = TodoApp()
    app.add("Learn Python")
    app.add("Build something cool")
    app.add("Ship it!")
    app.complete(1)
    print(json.dumps(app.list(), indent=2))


if __name__ == '__main__':
    main()`,
      'requirements.txt': `# Add your dependencies here
# e.g.:
# requests==2.31.0
# fastapi==0.104.0`,
    },
    entry: 'main.py',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: '🌊',
    description: 'Tailwind via CDN with premium design',
    category: 'Frontend',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Tailwind App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: { brand: '#7c3aed' }
        }
      }
    }
  </script>
</head>
<body class="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
  <div class="max-w-md w-full">
    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
      <div class="w-12 h-12 bg-gradient-to-br from-violet-600 to-cyan-400 rounded-xl mb-6 flex items-center justify-center text-2xl">✨</div>
      <h1 class="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
        Tailwind App
      </h1>
      <p class="text-gray-400 mb-6">Built with CodeSpace. Edit me!</p>
      <button class="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity">
        Get Started →
      </button>
    </div>
  </div>
</body>
</html>`,
    },
    entry: 'index.html',
  },
  {
    id: 'ai-app',
    name: 'AI Chat App',
    icon: '🤖',
    description: 'AI-powered chat interface template',
    category: 'AI',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>AI Chat</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="chat-app">
    <div class="chat-header">
      <div class="ai-avatar">🤖</div>
      <div>
        <div class="ai-name">AI Assistant</div>
        <div class="ai-status">Online</div>
      </div>
    </div>
    <div class="messages" id="messages">
      <div class="message ai">
        <span>Hello! I'm your AI assistant. How can I help you today?</span>
      </div>
    </div>
    <div class="input-area">
      <input id="inp" type="text" placeholder="Type a message..." autocomplete="off"/>
      <button id="send">Send</button>
    </div>
  </div>
  <script src="chat.js"></script>
</body>
</html>`,
      'style.css': `*{box-sizing:border-box;margin:0;padding:0;}
body{background:#0a0a0f;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.chat-app{width:100%;max-width:480px;height:600px;display:flex;flex-direction:column;background:#111;border:1px solid #222;border-radius:20px;overflow:hidden;}
.chat-header{display:flex;align-items:center;gap:12px;padding:16px;background:#161616;border-bottom:1px solid #222;}
.ai-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#06b6d4);display:flex;align-items:center;justify-content:center;font-size:20px;}
.ai-name{font-weight:700;color:#fff;font-size:.95rem;}
.ai-status{font-size:.75rem;color:#22c55e;}
.messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;}
.message{max-width:80%;padding:10px 14px;border-radius:14px;font-size:.9rem;line-height:1.5;}
.message.ai{background:#1e1e2e;color:#e2e8f0;align-self:flex-start;border-bottom-left-radius:4px;}
.message.user{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}
.input-area{display:flex;gap:8px;padding:12px;border-top:1px solid #222;}
#inp{flex:1;background:#1a1a2e;border:1px solid #333;border-radius:10px;padding:10px 14px;color:#fff;font-size:.9rem;outline:none;}
#inp:focus{border-color:#7c3aed;}
#send{padding:10px 20px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border:none;border-radius:10px;color:#fff;cursor:pointer;font-weight:600;}`,
      'chat.js': `const messages = document.getElementById('messages')
const inp = document.getElementById('inp')
const send = document.getElementById('send')

const responses = [
  "That's an interesting question! Let me think...",
  "I understand. Here's what I think...",
  "Great point! You could try...",
  "Based on what you've shared, I'd suggest...",
  "That's a common challenge. A good approach would be...",
]

function addMessage(text, type) {
  const div = document.createElement('div')
  div.className = \`message \${type}\`
  div.innerHTML = \`<span>\${text}</span>\`
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
}

function reply(userText) {
  setTimeout(() => {
    const res = responses[Math.floor(Math.random() * responses.length)]
    addMessage(res + ' "' + userText.slice(0,20) + '..."', 'ai')
  }, 600)
}

send.addEventListener('click', () => {
  const text = inp.value.trim()
  if (!text) return
  addMessage(text, 'user')
  inp.value = ''
  reply(text)
})

inp.addEventListener('keydown', e => {
  if (e.key === 'Enter') send.click()
})`,
    },
    entry: 'index.html',
  },
  {
    id: 'fullstack',
    name: 'Full Stack App',
    icon: '🚀',
    description: 'Frontend + Backend + Database template',
    category: 'Full Stack',
    files: {
      'frontend/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Full Stack App</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="app">
    <h1>Full Stack App 🚀</h1>
    <div id="status">Loading...</div>
    <div class="form">
      <input id="nameInput" placeholder="Add item..." type="text"/>
      <button id="addBtn">Add</button>
    </div>
    <ul id="list"></ul>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      'frontend/style.css': `.app{max-width:500px;margin:4rem auto;padding:2rem;background:#111;border-radius:16px;color:#fff;font-family:system-ui;}
h1{font-size:1.8rem;margin-bottom:1rem;background:linear-gradient(135deg,#a78bfa,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
#status{font-size:.8rem;color:#22c55e;margin-bottom:1rem;}
.form{display:flex;gap:8px;margin-bottom:1.5rem;}
input{flex:1;background:#1a1a2e;border:1px solid #333;border-radius:8px;padding:8px 12px;color:#fff;}
button{padding:8px 16px;background:#7c3aed;border:none;border-radius:8px;color:#fff;cursor:pointer;}
li{background:#1e1e2e;padding:10px 14px;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;}`,
      'frontend/app.js': `const API = 'http://localhost:3000'
const list = document.getElementById('list')
const status = document.getElementById('status')

async function loadItems() {
  try {
    const res = await fetch(\`\${API}/api/items\`)
    const items = await res.json()
    list.innerHTML = items.map(i =>
      \`<li>\${i.name} <button onclick="del(\${i.id})">×</button></li>\`
    ).join('')
    status.textContent = \`✅ API connected · \${items.length} items\`
  } catch {
    status.textContent = '❌ API not connected — start backend'
    status.style.color = '#ef4444'
  }
}

async function del(id) {
  await fetch(\`\${API}/api/items/\${id}\`, { method: 'DELETE' })
  loadItems()
}

document.getElementById('addBtn').addEventListener('click', async () => {
  const name = document.getElementById('nameInput').value.trim()
  if (!name) return
  await fetch(\`\${API}/api/items\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
  document.getElementById('nameInput').value = ''
  loadItems()
})

loadItems()`,
      'backend/server.js': `const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

let items = [{ id: 1, name: 'Sample item' }]
let nextId = 2

app.get('/api/items', (req, res) => res.json(items))
app.post('/api/items', (req, res) => {
  const item = { id: nextId++, ...req.body }
  items.push(item)
  res.status(201).json(item)
})
app.delete('/api/items/:id', (req, res) => {
  items = items.filter(i => i.id != req.params.id)
  res.json({ ok: true })
})

app.listen(3000, () => console.log('API running on :3000'))`,
      'backend/package.json': `{
  "dependencies": { "express": "^4.18.2", "cors": "^2.8.5" },
  "scripts": { "start": "node server.js" }
}`,
      'README.md': `# Full Stack App\n\n## Start Backend\n\`\`\`bash\ncd backend && npm install && npm start\n\`\`\`\n\n## Open Frontend\nOpen frontend/index.html in a browser`,
    },
    entry: 'frontend/index.html',
  },
]

export function getTemplate(id) {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0]
                               }
          
