import './About.css'

function About() {
  return (
    <div className="about-page page-section">
      <div className="container about-inner">
        <h1 className="about-title">About AnimateX</h1>
        <p className="about-desc">
          AnimateX ek live animation platform chhe jyan tame beautiful CSS aur JavaScript
          animations explore kari shako chho — chahe tame beginner ho ya expert.
        </p>

        <div className="about-cards">
          <div className="about-card">
            <span>🎯</span>
            <h3>Mission</h3>
            <p>Animations ne accessible banavo — koi complex setup nahi, sirf code karo ne juo.</p>
          </div>
          <div className="about-card">
            <span>🔒</span>
            <h3>Security</h3>
            <p>
              Tamara code ne sandboxed iframe ma run kariye chhe. App na koi resources ne access
              nathi — fully isolated execution.
            </p>
          </div>
          <div className="about-card">
            <span>🚀</span>
            <h3>Tech Stack</h3>
            <p>React + Vite, React Router, Vercel deployment, Environment variables for secrets.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
