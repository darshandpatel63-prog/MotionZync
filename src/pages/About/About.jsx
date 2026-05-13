import { Link } from 'react-router-dom'
import AdSense from '../../components/AdSense/AdSense.jsx'
export default function About() {
  return (
    <div className="page-section">
      <div className="container" style={{maxWidth:'800px'}}>
        <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
          <h1>About <span className="gradient-text">MotionZync</span></h1>
          <p>A free live CSS & JavaScript animation playground for everyone.</p>
        </div>
        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
        <div className="prose">
          <h2>What is MotionZync?</h2>
          <p>MotionZync is a free online platform where anyone — from beginners to professional developers — can explore, create, and download beautiful CSS and JavaScript animations. No installation, no signup required.</p>
          <h2>Our Mission</h2>
          <p>We believe great animations should be accessible to everyone. Whether you're a student learning web development, a designer looking for inspiration, or a developer building a product, MotionZync gives you ready-to-use animations and the tools to create your own.</p>
          <h2>Features</h2>
          <ul>
            <li><strong>Live Playground:</strong> Real-time CSS + JS animation editor</li>
            <li><strong>100+ Gallery:</strong> Growing collection of ready-made animations</li>
            <li><strong>Live Wallpaper Download:</strong> Download animations as HTML wallpapers</li>
            <li><strong>Free Course:</strong> Complete CSS & JS animation course</li>
            <li><strong>Smart Search:</strong> Find by title, tag, or background color</li>
          </ul>
          <h2>Tech Stack</h2>
          <ul>
            <li>React + Vite</li>
            <li>Firebase Firestore (database)</li>
            <li>Firebase Authentication (Google Sign-In)</li>
            <li>Vercel (hosting)</li>
          </ul>
          <h2>Contact</h2>
          <p><Link to="/contact">Contact us here</Link> or email <a href="mailto:wealthkavach1@gmail.com">wealthkavach1@gmail.com</a></p>
        </div>
        <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
      </div>
    </div>
  )
}
