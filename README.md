# ⚡ CodeSpace IDE — Drop-in Upgrade

VS Code + GitHub + Vercel fully inside your browser.
Local-first architecture — zero server code storage.

---

## 📦 Files Included

```
src/
├── App.jsx                          ← Updated (adds fullscreen route)
└── pages/CodeSpace/
    ├── CodeSpace.jsx                ← Main IDE orchestrator
    ├── CodeSpace.css                ← Premium VS Code theme
    ├── CsEditor.jsx                 ← Monaco Editor wrapper
    ├── CsFileExplorer.jsx           ← VS Code-style file tree
    ├── CsTerminal.jsx               ← Full terminal emulator
    ├── CsPreview.jsx                ← Live preview + console
    ├── CsGitPanel.jsx               ← Git source control panel
    ├── cs-storage.js                ← IndexedDB storage engine
    ├── cs-filesystem.js             ← File system + templates
    └── cs-git.js                    ← Browser Git simulation
```

---

## 🚀 Installation (2 steps)

### Step 1 — Replace the CodeSpace folder

Delete your existing:
```
src/pages/CodeSpace/
```

Copy in the new folder:
```
src/pages/CodeSpace/   (all 8 files inside)
```

### Step 2 — Replace App.jsx

Replace your existing `src/App.jsx` with the one from this zip.

The only change is:
```js
// Before
const FULLSCREEN_ROUTES = ['/admin', '/anim-creator']

// After
const FULLSCREEN_ROUTES = ['/admin', '/anim-creator', '/codespace']
```

This makes CodeSpace take the full screen (no Navbar/Footer),
which is required for the IDE layout to work correctly.

---

## ✅ That's it!

Run your dev server:
```bash
npm run dev
```

Visit: `http://localhost:5173/codespace`

---

## 🎯 Features

### Editor
- Monaco Editor (same engine as VS Code)
- Syntax highlighting for 30+ languages
- IntelliSense, autocomplete, hover docs
- Multi-tab editing
- Split editor (side by side)
- Code folding, bracket colorization
- Find & Replace (Ctrl+H in editor)
- Format document (Ctrl+Shift+F)
- Minimap, breadcrumbs
- Ctrl+S to save

### File System (IndexedDB — stays on your device)
- File tree with nested folders
- Create / rename / delete files & folders
- Upload files from disk
- Export project as ZIP
- Right-click context menu
- In-editor file search

### Terminal
- Full shell emulator (ls, cd, cat, touch, mkdir, rm, cp, mv, echo)
- npm / git command simulation
- Command history (↑ ↓ arrows)
- Tab autocomplete
- Ctrl+C, Ctrl+L
- Colored ANSI output

### Git (Browser simulation)
- Commit, branch, checkout, merge, stash
- Visual diff viewer (line-by-line)
- Commit history timeline
- Branch manager
- Changed files tracker

### Preview
- Live preview with auto-refresh
- Responsive / Mobile / Tablet / Desktop viewports
- Console panel with error overlay
- Inline JS/CSS injection (no server needed)

### Project Templates
- Vanilla HTML/CSS/JS
- React 18 (via ESM CDN)
- Node.js API (Express)
- Python Script
- Tailwind CSS
- AI Chat App
- Full Stack App

### Settings
- 4 editor themes (Dark, VS Dark, Light, High Contrast)
- Font size slider
- Minimap toggle
- Word wrap toggle
- Auto save toggle
- Auto preview toggle

### Other
- Command Palette (Ctrl+P)
- Environment variables editor (.env)
- Share project via URL
- Zen mode (distraction-free editing)
- Animated aurora background
- Status bar (cursor pos, language, branch)
- Toast notifications
- Keyboard shortcuts

---

## 🔒 Storage & Privacy

All code is stored in your browser's **IndexedDB**.
Nothing is sent to any server. Your files never leave your device.

Future cloud sync (if added) will be opt-in and encrypted.

---

## 🛠 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Editor   | Monaco Editor 0.45 (CDN)          |
| Storage  | IndexedDB (via native API)        |
| Preview  | sandboxed iframe                  |
| Terminal | Custom shell emulator             |
| Git      | Browser simulation                |
| UI       | React 18, CSS variables           |

---

## ⚠️ Notes

- Monaco Editor loads from CDN (`cdn.jsdelivr.net`) on first open.
  After that it's cached by the browser.
- The terminal simulates shell commands — actual Node.js/Python execution
  requires a WebContainer runtime (future upgrade path).
- Git operations are simulated in browser storage — not connected to
  GitHub/GitLab (future upgrade path via GitHub API).
  
# MotionZync 🎨

Live CSS + JS Animation Playground with Firestore backend.

## Vercel Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=you@gmail.com
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXX
VITE_ADSENSE_SLOT_HOME=
VITE_ADSENSE_SLOT_GALLERY=
VITE_ADSENSE_SLOT_PLAYGROUND=
```

## Firebase Setup

1. Firebase Console → New Project → "MotionZync"
2. Firestore Database → Create (production mode)
3. Authentication → Sign-in method → Google → Enable
4. Project Settings → Web App → Config values copy karo

## Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /animations/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "YOUR_GMAIL";
    }
    match /categories/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "YOUR_GMAIL";
    }
  }
}
```

## Admin Access

- Logo par 7 tap karo → /admin khulshe
- Ya seedha /admin URL kholvo
- Google thi login karo (sirf VITE_ADMIN_EMAIL valo access milshe)
- 
