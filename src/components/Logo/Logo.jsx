export default function MotionZyncLogo({ size = 36, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      xmlns="http://www.w3.org/2000/svg" className={className} aria-label="MotionZync Logo">
      <defs>
        <linearGradient id="mz-neon-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="15%" stopColor="#a855f7"/>
          <stop offset="50%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="speed-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0"/>
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="1"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Dark background */}
      <rect width="40" height="40" rx="10" fill="#0a0a0f"/>

      {/* Speed lines */}
      <g opacity="0.6">
        <line x1="0" y1="8" x2="15" y2="8" stroke="url(#speed-line-grad)" strokeWidth="0.6" strokeLinecap="round">
          <animate attributeName="x1" values="-20;40" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="0;60" dur="1.5s" repeatCount="indefinite"/>
        </line>
        <line x1="0" y1="32" x2="20" y2="32" stroke="url(#speed-line-grad)" strokeWidth="0.8" strokeLinecap="round">
          <animate attributeName="x1" values="-30;40" dur="2.2s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="0;70" dur="2.2s" repeatCount="indefinite"/>
        </line>
        <line x1="0" y1="20" x2="10" y2="20" stroke="url(#speed-line-grad)" strokeWidth="0.5" strokeLinecap="round">
          <animate attributeName="x1" values="-10;40" dur="1.2s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="0;50" dur="1.2s" repeatCount="indefinite"/>
        </line>
      </g>

      {/* MZ shape with pulse */}
      <path
        d="M8.5 28 L8.5 12 L16.5 20 L24.5 12 L31.5 12 L15.5 28 L31.5 28"
        stroke="url(#mz-neon-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#neon-glow)"
      >
        <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
      </path>

      {/* Orbiting dot */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 20 20"
          to="360 20 20"
          dur="4s"
          repeatCount="indefinite"
        />
        <circle cx="20" cy="4" r="1.5" fill="#a855f7" filter="url(#neon-glow)">
          <animate attributeName="r" values="1;2;1" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Center dot */}
      <circle cx="20" cy="20" r="1.5" stroke="#a855f7" strokeWidth="1" fill="none" filter="url(#neon-glow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}
