import { Routes, Route, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import CenteredLoader from './components/Loading/Loading.jsx'
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
import DesignIntelligenceLayout from './pages/DesignIntelligence/DesignIntelligenceLayout.jsx'
import DesignIntelligenceHome from './pages/DesignIntelligence/DesignIntelligenceHome.jsx'
import DesignIntelligenceExplorer from './pages/DesignIntelligence/DesignIntelligenceExplorer.jsx'
import DesignIntelligenceGenerator from './pages/DesignIntelligence/DesignIntelligenceGenerator.jsx'
import DesignIntelligenceKnowledge from './pages/DesignIntelligence/DesignIntelligenceKnowledge.jsx'
import DesignIntelligenceStacks from './pages/DesignIntelligence/DesignIntelligenceStacks.jsx'
import DesignIntelligenceDocs from './pages/DesignIntelligence/DesignIntelligenceDocs.jsx'
import DesignIntelligencePricing from './pages/DesignIntelligence/DesignIntelligencePricing.jsx'
import DesignBundleGallery from './pages/DesignIntelligence/DesignBundleGallery.jsx'

const FULLSCREEN = ['/admin']
const BG = { '/': 'home', '/gallery': 'gallery', '/playground': 'playground', '/course': 'course', '/compare': 'gallery', '/favorites': 'gallery' }

export default function App() {
  const { pathname } = useLocation()
  const isFullscreen = FULLSCREEN.some(r => pathname.startsWith(r))
  const variant = BG[pathname] || 'default'
  return <div className="app-wrapper">
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

          <Route path="/design-intelligence" element={<DesignIntelligenceLayout/>}>
            <Route index element={<DesignIntelligenceHome/>}/>
            <Route path="explorer" element={<DesignIntelligenceExplorer/>}/>
            <Route path="ui-gallery" element={<DesignBundleGallery/>}/>
            <Route path="generator" element={<DesignIntelligenceGenerator/>}/>
            <Route path="knowledge" element={<DesignIntelligenceKnowledge/>}/>
            <Route path="stacks" element={<DesignIntelligenceStacks/>}/>
            <Route path="docs" element={<DesignIntelligenceDocs/>}/>
            <Route path="pricing" element={<DesignIntelligencePricing/>}/>
          </Route>
        </Routes>
      </Suspense>
    </main>
    {!isFullscreen && <Footer/>}
  </div>
}
