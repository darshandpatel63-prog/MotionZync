import AdSense from '../../components/AdSense/AdSense.jsx'
export default function Terms() {
  return (
    <div className="page-section"><div className="container" style={{maxWidth:'800px'}}>
      <div className="page-hero" style={{padding:'0 0 1.5rem'}}><h1>Terms of Service</h1><p>Last updated: May 2025</p></div>
      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
      <div className="prose">
        <h2>1. Acceptance</h2>
        <p>By using MotionZync you agree to these terms. If you disagree, please do not use the service.</p>
        <h2>2. Service Description</h2>
        <p>MotionZync provides a free online platform for creating, exploring, and downloading CSS and JavaScript animations.</p>
        <h2>3. User Conduct</h2>
        <p>You agree NOT to: use the service illegally, submit malicious code, attempt unauthorized access, or scrape content in bulk.</p>
        <h2>4. Intellectual Property</h2>
        <p>Animation code from MotionZync can be used in personal and commercial projects. The MotionZync brand and platform remain our property.</p>
        <h2>5. Advertisements</h2>
        <p>MotionZync displays ads via Google AdSense to keep the service free.</p>
        <h2>6. Wallpaper Downloads</h2>
        <p>Downloaded wallpapers are for personal use. A short ad may be shown before download.</p>
        <h2>7. Disclaimer of Warranties</h2>
        <p>Service is provided "as is" without warranties of any kind.</p>
        <h2>8. Contact</h2>
        <p><a href="mailto:wealthkavach1@gmail.com">wealthkavach1@gmail.com</a></p>
      </div>
      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
    </div></div>
  )
}
