/**
 * ultra-marketing-landing-pages-099 — Event conference landing — Data-dense Advanced
 * Category: marketing-landing-pages | Tier: Ultra Premium+ | Layout: topbar-flow
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-marketing-landing-pages-099 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Settings</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Create</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Event conference landing — Data-dense Advanced</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-marketing-landing-pages-099" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Engagement breakdown</h3>
            <p className="mz-metric">119k</p>
            <p className="mz-note">Fictional value — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity overview</h3>
            <p className="mz-metric">362k</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Uptime breakdown</h3>
            <p className="mz-metric">173%</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":71 }}></span><span className="mz-spark" style={{ "--h":22 }}></span><span className="mz-spark" style={{ "--h":38 }}></span><span className="mz-spark" style={{ "--h":48 }}></span><span className="mz-spark" style={{ "--h":92 }}></span><span className="mz-spark" style={{ "--h":86 }}></span><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":72 }}></span><span className="mz-spark" style={{ "--h":94 }}></span></div>
      </main>
    </div>
  );
}
