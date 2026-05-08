/**
 * AnimatexLogo Component
 * 
 * Logo design: Ek "play frame" — screen jevi shape ni ander
 * motion trail saathe triangle (play button). Totally unique,
 * Gemini/star jevi koi cheez nahi.
 * 
 * LOGO BADLAVU HOY TO:
 * - size prop change karo (default 32)
 * - Colors: --logo-start (#7c3aed) and --logo-end (#06b6d4)
 * - SVG shape badlavo niche
 */
function AnimatexLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AnimateX Logo"
    >
      <defs>
        <linearGradient id="ax-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="ax-grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <clipPath id="ax-clip">
          <rect width="40" height="40" rx="10" />
        </clipPath>
      </defs>

      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill="#0a0a0f" />

      {/* Outer frame - screen shape */}
      <rect
        x="4" y="5" width="32" height="24"
        rx="4"
        stroke="url(#ax-grad)"
        strokeWidth="2"
        fill="none"
      />

      {/* Play triangle - centered in frame */}
      <path
        d="M16 11 L26 17 L16 23 Z"
        fill="url(#ax-grad)"
      />

      {/* Motion trail lines - right of play button (speed effect) */}
      <line x1="28" y1="14" x2="35" y2="14" stroke="url(#ax-grad2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <line x1="28" y1="17" x2="36" y2="17" stroke="url(#ax-grad2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="28" y1="20" x2="35" y2="20" stroke="url(#ax-grad2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

      {/* Bottom stand / base */}
      <rect x="16" y="29" width="8" height="2.5" rx="1.25" fill="url(#ax-grad)" opacity="0.8" />
      <rect x="12" y="31.5" width="16" height="2.5" rx="1.25" fill="url(#ax-grad)" opacity="0.5" />
    </svg>
  )
}

export default AnimatexLogo
