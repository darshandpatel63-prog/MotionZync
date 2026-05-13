import { useState } from 'react'
import AdSense from '../../components/AdSense/AdSense.jsx'
import './Contact.css'
export default function Contact() {
  const [name,setName]=useState(''); const [email,setEmail]=useState('')
  const [subject,setSubject]=useState(''); const [message,setMessage]=useState('')
  const [sent,setSent]=useState(false)
  function handleSubmit(e) {
    e.preventDefault()
    window.location.href=`mailto:wealthkavach1@gmail.com?subject=${encodeURIComponent(subject||'MotionZync Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`
    setSent(true)
  }
  return (
    <div className="page-section"><div className="container" style={{maxWidth:'700px'}}>
      <div className="page-hero" style={{padding:'0 0 1.5rem'}}>
        <h1>Contact <span className="gradient-text">Us</span></h1>
        <p>Questions, suggestions, or issues? We'd love to hear from you!</p>
      </div>
      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
      <div className="contact-cards">
        <div className="contact-info-card"><span>📧</span><h3>Email</h3><a href="mailto:wealthkavach1@gmail.com">wealthkavach1@gmail.com</a></div>
        <div className="contact-info-card"><span>⏱️</span><h3>Response Time</h3><p>Within 24-48 hours</p></div>
        <div className="contact-info-card"><span>💬</span><h3>Topics</h3><p>Bugs, features, animations, course</p></div>
      </div>
      {sent ? (
        <div className="contact-success">
          <span>🎉</span><h3>Message Ready!</h3>
          <p>Your email client has opened. Send the email to complete your message.</p>
          <button className="btn-secondary" onClick={() => setSent(false)}>Send Another</button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>
          <div className="form-row">
            <div className="form-group"><label>Your Name *</label><input type="text" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)} required/></div>
            <div className="form-group"><label>Your Email *</label><input type="email" placeholder="john@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          </div>
          <div className="form-group"><label>Subject</label><input type="text" placeholder="e.g. Animation request..." value={subject} onChange={e=>setSubject(e.target.value)}/></div>
          <div className="form-group"><label>Message *</label><textarea placeholder="Write your message..." value={message} onChange={e=>setMessage(e.target.value)} rows={5} required/></div>
          <button type="submit" className="btn-primary contact-submit">📤 Send Message</button>
        </form>
      )}
      <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME}/>
    </div></div>
  )
}

