# ✦ AnimateX — Live Animation Playground

## Project Structure
```
animatex/
├── index.html                        ← Entry point
├── vite.config.js                    ← Vite config
├── package.json                      ← Dependencies
├── vercel.json                       ← Vercel routing + security headers
├── .env.example                      ← Env variables template (GitHub par push karo)
├── .gitignore                        ← .env ignore karo
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                      ← React entry
    ├── App.jsx                       ← Router
    ├── index.css                     ← Global styles + CSS variables
    ├── components/
    │   ├── Navbar/                   ← Top navigation
    │   ├── Footer/                   ← Bottom footer
    │   ├── AdSense/                  ← Google AdSense component
    │   ├── AnimationCard/            ← Gallery card
    │   ├── CodeEditor/               ← CSS + JS editor tabs
    │   └── LivePreview/              ← Sandboxed iframe preview
    ├── pages/
    │   ├── Home/                     ← Landing page
    │   ├── Gallery/                  ← Animation gallery
    │   ├── Playground/               ← Main editor + preview
    │   └── About/                    ← About page
    └── animations/
        ├── backgroundAnimations.js   ← Tamara background animations data
        └── frontAnimations.js        ← Tamara front animations data
```

---

## 🚀 Setup Steps

### Step 1: GitHub Repository Banavo
1. github.com par jao → "New repository" → name: `animatex`
2. Repository create karo (Private rakho)

### Step 2: Files Upload Karo
Mobile par: GitHub app download karo ya browser ma jao
- Drekh file eni sahi folder structure ma upload karo

### Step 3: Vercel Deploy Karo
1. vercel.com par jao → "New Project"
2. GitHub account connect karo
3. `animatex` repository select karo
4. Framework: **Vite** select karo
5. "Deploy" dabao

### Step 4: Environment Variables Set Karo
Vercel Dashboard → Your Project → Settings → Environment Variables ma add karo:
```
VITE_ADSENSE_CLIENT      = ca-pub-XXXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT_HOME   = XXXXXXXXXX
VITE_ADSENSE_SLOT_GALLERY = XXXXXXXXXX
VITE_ADSENSE_SLOT_PLAYGROUND = XXXXXXXXXX
```
Production + Preview + Development trano check karo

### Step 5: Redeploy
Vercel → Deployments → "Redeploy" karo env variables laagva mate

---

## 🎨 Navi Animation Kevi Rite Add Karo?

**backgroundAnimations.js** ya **frontAnimations.js** ma navo object add karo:

```js
{
  id: 'my-new-anim',          // Unique ID
  title: 'My Animation',
  description: 'Aa animation...',
  category: 'Background',      // 'Background' ya 'Front'
  previewBg: '#0a0a0f',
  cssCode: `/* CSS code yahan */`,
  jsCode: `// JS code yahan`
}
```

Bas! Gallery ma automatically dikhe.

---

## 💰 AdSense Setup
1. Google AdSense ma account banavo
2. Site add karo (tamari Vercel URL)
3. Approve thay pachhi Client ID aur Slot IDs malshe
4. `index.html` ma AdSense script uncomment karo
5. Vercel environment variables ma IDs set karo

---

## 🔒 Security Features
- User code sandboxed iframe ma run thay (`sandbox="allow-scripts"` only)
- Sensitive keys Vercel environment variables ma — GitHub par nahi
- Security headers vercel.json ma set chhe (XSS, clickjacking protection)
- `.env` files `.gitignore` ma chhe
