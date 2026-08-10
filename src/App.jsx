// src/App.jsx — MotionZync v3.0
// Lazy: ONLY Studio3D (Three.js ~1MB) + DrawingStudio (canvas) + CodeSpace (Monaco)
// Everything else: direct import — NO unnecessary lazy

import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import CenteredLoader  from './components/Loading/Loading.jsx'
import AuthGuard       from './components/AuthGuard/AuthGuard.jsx'
import FloatingAI      from './ai/floating/FloatingAI.jsx'
import PageBackground  from './components/PageBackground/PageBackground.jsx'
import Navbar          from './components/Navbar/Navbar.jsx'
import Footer          from './components/Footer/Footer.jsx'

// ── Direct imports (fast load — no lazy) ──────────────────
import Home            from './pages/Home/Home.jsx'
import Gallery         from './pages/Gallery/Gallery.jsx'
import Playground      from './pages/Playground/Playground.jsx'
import AnimationDetail from './pages/AnimationDetail/AnimationDetail.jsx'
import Compare         from './pages/Compare/Compare.jsx'
import Course          from './pages/Course/Course.jsx'
import HowToUse        from './pages/HowToUse/HowToUse.jsx'
import Wallpaper       from './pages/Wallpaper/Wallpaper.jsx'
import Submit          from './pages/Submit/Submit.jsx'
import Favorites       from './pages/Favorites/Favorites.jsx'
import Changelog       from './pages/Changelog/Changelog.jsx'
import Tools           from './pages/Tools/Tools.jsx'
import ToolGuide       from './pages/ToolGuide/ToolGuide.jsx'
import WhyFeatures     from './pages/WhyFeatures/WhyFeatures.jsx'
import Admin           from './pages/Admin/Admin.jsx'
import AnimCreator     from './pages/AnimCreator/AnimCreator.jsx'
import AIStudio        from './ai/studio/AIStudio.jsx'

// ── Lazy ONLY for truly heavy bundles ────────────────────
// Studio3D  → Three.js  ~1MB
// DrawingStudio → Canvas + heavy engine
// CodeSpace → Monaco Editor ~5MB
const Studio3D      = lazy(() => import('./pages/Studio3D/Studio3D.jsx'))
const DrawingStudio = lazy(() => import('./pages/DrawingStudio/DrawingStudio.jsx'))
const CodeSpace     = lazy(() => import('./pages/CodeSpace/CodeSpace.jsx'))

// ── Fullscreen routes (no Navbar/Footer) ─────────────────
const FULLSCREEN = [
  '/admin', '/anim-creator', '/codespace',
  '/drawing-studio', '/studio-3d', '/ai-studio'
]

// ── Background variant per route ─────────────────────────
const BG = {
  '/': 'home', '/gallery': 'gallery', '/playground': 'playground',
  '/course': 'course', '/wallpaper': 'wallpaper',
  '/compare': 'gallery', '/submit': 'gallery', '/favorites': 'gallery',
}

export default function App() {
  const { pathname } = useLocation()
  const isFullscreen = FULLSCREEN.some(r => pathname.startsWith(r))
  const variant      = BG[pathname] || 'default'

  return (
    <div className="app-wrapper">
      {!isFullscreen && <PageBackground variant={variant}/>}
      {!isFullscreen && <Navbar/>}

      <main className={isFullscreen ? '' : 'main-content'}>
        <Suspense fallback={<CenteredLoader/>}>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/"               element={<Home/>}/>
            <Route path="/gallery"        element={<Gallery/>}/>
            <Route path="/playground"     element={<Playground/>}/>
            <Route path="/animation/:id"  element={<AnimationDetail/>}/>
            <Route path="/compare"        element={<Compare/>}/>
            <Route path="/wallpaper"      element={<Wallpaper/>}/>
            <Route path="/course"         element={<Course/>}/>
            <Route path="/how-to-use"     element={<HowToUse/>}/>
            <Route path="/submit"         element={<Submit/>}/>
            <Route path="/favorites"      element={<Favorites/>}/>
            <Route path="/changelog"      element={<Changelog/>}/>
            <Route path="/tools"          element={<Tools/>}/>
            <Route path="/tool-guide"     element={<ToolGuide/>}/>
            <Route path="/why-features"   element={<WhyFeatures/>}/>
            <Route path="/admin"          element={<Admin/>}/>

            {/* ── Studios (direct — fast) ── */}
            <Route path="/anim-creator"   element={<AnimCreator/>}/>

            {/* ── AI Studio — needs account ── */}
            <Route path="/ai-studio"      element={
              <AuthGuard><AIStudio/></AuthGuard>
            }/>

            {/* ── Heavy studios — lazy only here ── */}
            <Route path="/codespace"      element={<CodeSpace/>}/>
            <Route path="/drawing-studio" element={<DrawingStudio/>}/>
            <Route path="/studio-3d"      element={
              <AuthGuard><Studio3D/></AuthGuard>
            }/>
          </Routes>
        </Suspense>
      </main>

      {!isFullscreen && <Footer/>}

      {/* ── Global Floating AI — every page except fullscreen (CodeSpace has its own AI panel) ── */}
      {!isFullscreen && <FloatingAI/>}
    </div>
  )
}
