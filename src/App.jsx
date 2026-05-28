import { Routes, Route, useLocation } from 'react-router-dom'
import PageBackground    from './components/PageBackground/PageBackground.jsx'
import Navbar            from './components/Navbar/Navbar.jsx'
import Footer            from './components/Footer/Footer.jsx'
import Home              from './pages/Home/Home.jsx'
import Gallery           from './pages/Gallery/Gallery.jsx'
import Playground        from './pages/Playground/Playground.jsx'
import AnimationDetail   from './pages/AnimationDetail/AnimationDetail.jsx'
import Compare           from './pages/Compare/Compare.jsx'
import About             from './pages/About/About.jsx'
import Admin             from './pages/Admin/Admin.jsx'
import Privacy           from './pages/Privacy/Privacy.jsx'
import Terms             from './pages/Terms/Terms.jsx'
import Disclaimer        from './pages/Disclaimer/Disclaimer.jsx'
import Contact           from './pages/Contact/Contact.jsx'
import Course            from './pages/Course/Course.jsx'
import HowToUse          from './pages/HowToUse/HowToUse.jsx'
import Wallpaper         from './pages/Wallpaper/Wallpaper.jsx'
import Submit            from './pages/Submit/Submit.jsx'
import Favorites         from './pages/Favorites/Favorites.jsx'
import Changelog         from './pages/Changelog/Changelog.jsx'
import Tools             from './pages/Tools/Tools.jsx'
import CodeSpace         from './pages/CodeSpace/CodeSpace.jsx'
import AnimCreator       from './pages/AnimCreator/AnimCreator.jsx'

const bgVariant = {
  '/':           'home',
  '/gallery':    'gallery',
  '/playground': 'playground',
  '/course':     'course',
  '/wallpaper':  'wallpaper',
  '/compare':    'gallery',
  '/submit':     'gallery',
  '/favorites':  'gallery',
  '/changelog':  'default',
  '/tools':      'default',
}

// These routes are full-screen — no Navbar/Footer/BG
// CodeSpace is fullscreen — it's a complete IDE that needs all viewport space
const FULLSCREEN_ROUTES = ['/admin', '/anim-creator', '/codespace']

export default function App() {
  const { pathname } = useLocation()
  const isFullscreen = FULLSCREEN_ROUTES.includes(pathname)
  const variant = bgVariant[pathname] || 'default'

  return (
    <div className="app-wrapper">
      {!isFullscreen && <PageBackground variant={variant}/>}
      {!isFullscreen && <Navbar/>}
      <main className={isFullscreen ? '' : 'main-content'}>
        <Routes>
          <Route path="/"                element={<Home/>}/>
          <Route path="/gallery"         element={<Gallery/>}/>
          <Route path="/playground"      element={<Playground/>}/>
          <Route path="/animation/:id"   element={<AnimationDetail/>}/>
          <Route path="/compare"         element={<Compare/>}/>
          <Route path="/wallpaper"       element={<Wallpaper/>}/>
          <Route path="/course"          element={<Course/>}/>
          <Route path="/how-to-use"      element={<HowToUse/>}/>
          <Route path="/about"           element={<About/>}/>
          <Route path="/admin"           element={<Admin/>}/>
          <Route path="/privacy"         element={<Privacy/>}/>
          <Route path="/terms"           element={<Terms/>}/>
          <Route path="/disclaimer"      element={<Disclaimer/>}/>
          <Route path="/contact"         element={<Contact/>}/>
          <Route path="/submit"          element={<Submit/>}/>
          <Route path="/favorites"       element={<Favorites/>}/>
          <Route path="/changelog"       element={<Changelog/>}/>
          <Route path="/tools"           element={<Tools/>}/>
          <Route path="/codespace"       element={<CodeSpace/>}/>
          <Route path="/anim-creator"    element={<AnimCreator/>}/>
        </Routes>
      </main>
      {!isFullscreen && <Footer/>}
    </div>
  )
}
