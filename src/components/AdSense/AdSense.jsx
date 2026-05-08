import { useEffect, useRef } from 'react'
import './AdSense.css'

/**
 * AdSense Component
 * Usage: <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_HOME} />
 * Env variables Vercel Dashboard ma set karo
 */
function AdSense({ slot, format = 'auto', className = '' }) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!slot) return
    if (pushed.current) return
    pushed.current = true

    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (e) {
      console.warn('AdSense error:', e.message)
    }
  }, [slot])

  // Development mode ma placeholder show karo
  if (!slot || import.meta.env.DEV) {
    return (
      <div className={`adsense-placeholder ${className}`}>
        <span>📢 Ad Space</span>
        <small>AdSense ads production ma dikhshe</small>
      </div>
    )
  }

  return (
    <div className={`adsense-wrapper ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default AdSense
