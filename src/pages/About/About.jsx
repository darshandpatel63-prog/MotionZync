import './About.css'
export default function About() {
  return (
    <div className="about-page page-section">
      <div className="container about-inner">
        <h1 className="about-title">About MotionZync</h1>
        <p className="about-desc">MotionZync ek live animation platform chhe jyan tame beautiful CSS aur JavaScript animations explore kari shako chho — beginner ho ya expert.</p>
        <div className="about-cards">
          {cards.map(c => (
            <div className="about-card" key={c.title}>
              <span>{c.icon}</span><h3>{c.title}</h3><p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const cards = [
  { icon:'🎯', title:'Mission', desc:'Animations ne accessible banavo — koi complex setup nahi.' },
  { icon:'🔥', title:'Firestore', desc:'Animations Firestore ma store thay — real-time updates, unlimited scale.' },
  { icon:'🔒', title:'Security', desc:'User code sandboxed iframe ma run thay. Fully isolated execution.' },
  { icon:'🚀', title:'Tech Stack', desc:'React + Vite + Firebase Firestore + Auth, Vercel deployment.' },
]

