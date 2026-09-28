import AdSense from '../../components/AdSense/AdSense.jsx'
export default function Disclaimer() {
  return (
    <div className="page-section"><div className="container" style={{maxWidth:'800px'}}>
      <div className="page-hero" style={{padding:'0 0 1.5rem'}}><h1>Disclaimer</h1></div>
      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
      <div className="prose">
        <h2>General Information</h2>
        <p>All animation code on MotionZync is for educational and creative use. Test code thoroughly before using in production.</p>
        <h2>Code Usage</h2>
        <ul>
          <li>Test across browsers before using in production</li>
          <li>Optimize for performance as needed</li>
          <li>We are not responsible for issues from code implementation</li>
        </ul>
        <h2>Advertisements</h2>
        <p>Ads are served by Google AdSense. We do not endorse advertised products or services.</p>
        <h2>Course Content</h2>
        <p>Course content is for education. Web technologies evolve — always refer to official documentation for current standards.</p>
        <h2>Contact</h2>
        <p><a href="/contact.html">Contact Us</a></p>
      </div>
      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
    </div></div>
  )
}
