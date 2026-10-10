/**
 * ultra-desktop-productivity-009 — Document editor canvas — Data-dense Advanced
 * Category: desktop-productivity | Tier: Ultra Premium+ | Layout: sidebar-command
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-desktop-productivity-009 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Members</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Document editor canvas — Data-dense Advanced</h2>
          <p>Snapshot of what needs attention today.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="ultra-desktop-productivity-009" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="ultra-desktop-productivity-009" />
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Engagement trend</h3>
            <p className="mz-metric">129k</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Latency breakdown</h3>
            <p className="mz-metric">632%</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity summary</h3>
            <p className="mz-metric">501%</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":83 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":73 }}></span><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":63 }}></span><span className="mz-spark" style={{ "--h":65 }}></span><span className="mz-spark" style={{ "--h":36 }}></span><span className="mz-spark" style={{ "--h":87 }}></span></div>
      </main>
    </div>
  );
}
