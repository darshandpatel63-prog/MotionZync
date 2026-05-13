import AdSense from '../../components/AdSense/AdSense.jsx'
export default function Privacy() {
  return (
    <div className="page-section"><div className="container" style={{maxWidth:'800px'}}>
      <div className="page-hero" style={{padding:'0 0 1.5rem'}}><h1>Privacy Policy</h1><p>Last updated: May 2025</p></div>
      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
      <div className="prose">
        <h2>1. Information We Collect</h2>
        <p>MotionZync collects minimal information:</p>
        <ul>
          <li><strong>Google Account:</strong> Name, email, profile photo — only for admin authentication.</li>
          <li><strong>Usage Data:</strong> Anonymous analytics via Google Analytics.</li>
          <li><strong>Cookies:</strong> Firebase auth cookies and Google AdSense cookies.</li>
        </ul>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and improve our animation playground</li>
          <li>To authenticate admin users via Google Sign-In</li>
          <li>To display ads through Google AdSense</li>
        </ul>
        <h2>3. Google AdSense</h2>
        <p>We use Google AdSense. Google uses cookies to serve personalized ads. Opt out at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
        <h2>4. Third-Party Services</h2>
        <ul><li><strong>Firebase (Google)</strong>, <strong>Google AdSense</strong>, <strong>Vercel</strong></li></ul>
        <h2>5. Data Security</h2>
        <p>All animation code runs in sandboxed iframes — completely isolated from your device.</p>
        <h2>6. Contact</h2>
        <p><a href="mailto:wealthkavach1@gmail.com">wealthkavach1@gmail.com</a></p>
      </div>
      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
    </div></div>
  )
}

