import { Routes, Route, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import CenteredLoader from './components/Loading/Loading.jsx'
import AuthGuard from './components/AuthGuard/AuthGuard.jsx'
import FloatingAI from './ai/floating/FloatingAI.jsx'
import PageBackground from './components/PageBackground/PageBackground.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'

import Home from './pages/Home/Home.jsx'
import Gallery from './pages/Gallery/Gallery.jsx'
import Playground from './pages/Playground/Playground.jsx'
import AnimationDetail from './pages/AnimationDetail/AnimationDetail.jsx'
import Compare from './pages/Compare/Compare.jsx'
import Course from './pages/Course/Course.jsx'
import HowToUse from './pages/HowToUse/HowToUse.jsx'
import Favorites from './pages/Favorites/Favorites.jsx'
import Tools from './pages/Tools/Tools.jsx'
import ToolGuide from './pages/ToolGuide/ToolGuide.jsx'
import WhyFeatures from './pages/WhyFeatures/WhyFeatures.jsx'
import Admin from './pages/Admin/Admin.jsx'
import AIStudio from './ai/studio/AIStudio.jsx'

const FULLSCREEN = ['/admin', '/ai-studio']
const BG = {
  '/': 'home', '/gallery': 'gallery', '/playground': 'playground',
  '/course': 'course', '/compare': 'gallery', '/favorites': 'gallery',
}

export default function App() {
  const { pathname } = useLocation()
  const isFullscreen = FULLSCREEN.some(r => pathname.startsWith(r))
  const variant = BG[pathname] || 'default'

  return (
    <div className="app-wrapper">
      {!isFullscreen && <PageBackground variant={variant}/>}
      {!isFullscreen && <Navbar/>}
      <main className={isFullscreen ? '' : 'main-content'}>
        <Suspense fallback={<CenteredLoader/>}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/gallery" element={<Gallery/>}/>
            <Route path="/playground" element={<Playground/>}/>
            <Route path="/animation/:id" element={<AnimationDetail/>}/>
            <Route path="/compare" element={<Compare/>}/>
            <Route path="/course" element={<Course/>}/>
            <Route path="/how-to-use" element={<HowToUse/>}/>
            <Route path="/favorites" element={<Favorites/>}/>
            <Route path="/tools" element={<Tools/>}/>
            <Route path="/tool-guide" element={<ToolGuide/>}/>
            <Route path="/why-features" element={<WhyFeatures/>}/>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/ai-studio" element={<AuthGuard><AIStudio/></AuthGuard>}/>
          </Routes>
        </Suspense>
      </main>
      {!isFullscreen && <Footer/>}
      {!isFullscreen && <FloatingAI/>}
    </div>
  )
}
