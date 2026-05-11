import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar  from './components/Navbar/Navbar.jsx'
import Footer  from './components/Footer/Footer.jsx'
import Home       from './pages/Home/Home.jsx'
import Gallery    from './pages/Gallery/Gallery.jsx'
import Playground from './pages/Playground/Playground.jsx'
import About      from './pages/About/About.jsx'
import Admin      from './pages/Admin/Admin.jsx'

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'
  return (
    <div className="app-wrapper">
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? '' : 'main-content'}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/gallery"    element={<Gallery />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/about"      element={<About />} />
          <Route path="/admin"      element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}

