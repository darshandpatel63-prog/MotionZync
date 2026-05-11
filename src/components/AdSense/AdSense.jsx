import { useEffect, useRef } from 'react'
import './AdSense.css'
export default function AdSense({ slot, className = '' }) {
  const pushed = useRef(false)
  useEffect(() => {
    if (!slot || pushed.current) return
    pushed.current = true
    try { if (window.adsbygoogle) window.adsbygoogle.push({}) } catch(e) {}
  }, [slot])
  if (!slot || import.meta.env.DEV) {
    return <div className={`adsense-placeholder ${className}`}><span>📢 Ad Space</span><small>AdSense production ma dikhshe</small></div>
  }
  return (
    <div className={`adsense-wrapper ${className}`}>
      <ins className="adsbygoogle" style={{display:'block'}}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
        data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/>
    </div>
  )
}
