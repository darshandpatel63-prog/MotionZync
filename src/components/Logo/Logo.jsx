export default function MotionZyncLogo({ size = 36, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      xmlns="http://www.w3.org/2000/svg" className={className} aria-label="MotionZync Logo">
      <defs>
        <linearGradient id="ml-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
        <linearGradient id="ml-g2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
      {/* Dark background */}
      <rect width="40" height="40" rx="10" fill="#0a0a0f"/>
      {/* M shape - motion */}
      <path d="M6 28 L6 12 L13 22 L20 12 L20 28" stroke="url(#ml-g1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Orbit ring */}
      <ellipse cx="30" cy="20" rx="7" ry="4" stroke="url(#ml-g2)" strokeWidth="1.5" fill="none" opacity="0.9"/>
      {/* Orbit dot */}
      <circle cx="37" cy="20" r="2" fill="url(#ml-g2)"/>
      {/* Speed lines */}
      <line x1="23" y1="17" x2="26" y2="17" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      <line x1="22" y1="20" x2="26" y2="20" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <line x1="23" y1="23" x2="26" y2="23" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
    </svg>
  )
}
