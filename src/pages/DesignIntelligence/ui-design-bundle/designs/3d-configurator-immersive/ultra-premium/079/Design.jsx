/**
 * ultra-3d-configurator-immersive-079 — Packaging die-line viewer — Data-dense Advanced
 * Category: 3d-configurator-immersive | Tier: Ultra Premium+ | Layout: bottom-nav-touch
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-3d-configurator-immersive-079 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--bottom" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Reports</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Packaging die-line viewer — Data-dense Advanced</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-3d-configurator-immersive-079" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Accuracy breakdown</h3>
            <p className="mz-metric">770ms</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue overview</h3>
            <p className="mz-metric">940</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement summary</h3>
            <p className="mz-metric">115</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":62 }}></span><span className="mz-spark" style={{ "--h":42 }}></span><span className="mz-spark" style={{ "--h":49 }}></span><span className="mz-spark" style={{ "--h":44 }}></span><span className="mz-spark" style={{ "--h":63 }}></span><span className="mz-spark" style={{ "--h":30 }}></span><span className="mz-spark" style={{ "--h":49 }}></span><span className="mz-spark" style={{ "--h":67 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":44 }}></span><span className="mz-spark" style={{ "--h":92 }}></span><span className="mz-spark" style={{ "--h":28 }}></span></div>
      </main>
    </div>
  );
}
