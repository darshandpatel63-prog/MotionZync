// ─── App.jsx — Aa full file chhe, existing App.jsx replace karo ────────────

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
import Submit            from './pages/Submit/Submit.jsx'   // ← NEW

const bgVariant = {
  '/':           'home',
  '/gallery':    'gallery',
  '/playground': 'playground',
  '/course':     'course',
  '/wallpaper':  'wallpaper',
  '/compare':    'gallery',
  '/submit':     'gallery',   // ← NEW
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'
  const variant = bgVariant[pathname] || 'default'

  return (
    <div className="app-wrapper">
      {!isAdmin && <PageBackground variant={variant}/>}
      {!isAdmin && <Navbar/>}
      <main className={isAdmin ? '' : 'main-content'}>
        <Routes>
          <Route path="/"                  element={<Home/>}/>
          <Route path="/gallery"           element={<Gallery/>}/>
          <Route path="/playground"        element={<Playground/>}/>
          <Route path="/animation/:id"     element={<AnimationDetail/>}/>
          <Route path="/compare"           element={<Compare/>}/>
          <Route path="/wallpaper"         element={<Wallpaper/>}/>
          <Route path="/course"            element={<Course/>}/>
          <Route path="/how-to-use"        element={<HowToUse/>}/>
          <Route path="/about"             element={<About/>}/>
          <Route path="/admin"             element={<Admin/>}/>
          <Route path="/privacy"           element={<Privacy/>}/>
          <Route path="/terms"             element={<Terms/>}/>
          <Route path="/disclaimer"        element={<Disclaimer/>}/>
          <Route path="/contact"           element={<Contact/>}/>
          <Route path="/submit"            element={<Submit/>}/>  {/* ← NEW */}
        </Routes>
      </main>
      {!isAdmin && <Footer/>}
    </div>
  )
}


// ─── Navbar.jsx ma aa link add karo: ─────────────────────────────────────────
// Existing nav links array ma nakho:
//
// { to: '/submit', label: '+ Submit' }
//
// Ya Navbar.jsx ma CTA button add karo:
// <Link to="/submit" className="btn-primary navbar-submit-btn">+ Submit Animation</Link>
//
// .navbar-submit-btn CSS:
// .navbar-submit-btn {
//   font-size: 0.78rem;
//   padding: 0.4rem 0.9rem;
//   border-radius: 99px;
// }
