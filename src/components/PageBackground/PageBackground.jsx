import './PageBackground.css'
export default function PageBackground({ variant = 'default' }) {
  return (
    <div className={`page-bg page-bg--${variant}`} aria-hidden="true">
      <div className="page-bg__orb page-bg__orb--1"/>
      <div className="page-bg__orb page-bg__orb--2"/>
      <div className="page-bg__orb page-bg__orb--3"/>
      {(variant==='home'||variant==='gallery') && <div className="page-bg__dots"/>}
      {variant==='playground' && <div className="page-bg__grid"/>}
      {variant==='course' && <>
        <span className="page-bg__sym s1">{'{}'}</span>
        <span className="page-bg__sym s2">CSS</span>
        <span className="page-bg__sym s3">&lt;/&gt;</span>
        <span className="page-bg__sym s4">JS</span>
        <span className="page-bg__sym s5">@keyframes</span>
        <span className="page-bg__sym s6">canvas</span>
      </>}
      {variant==='wallpaper' && <div className="page-bg__aurora"/>}
    </div>
  )
}
