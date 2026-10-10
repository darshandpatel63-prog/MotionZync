/**
 * ultra-editorial-portfolio-creator-029 — Designer case study page — Data-dense Advanced
 * Category: editorial-portfolio-creator | Tier: Ultra Premium+ | Layout: bottom-nav-touch
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-editorial-portfolio-creator-029 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--bottom" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Members</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Designer case study page — Data-dense Advanced</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-editorial-portfolio-creator-029" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Retention trend</h3>
            <p className="mz-metric">37ms</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Uptime summary</h3>
            <p className="mz-metric">404%</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Velocity trend</h3>
            <p className="mz-metric">402ms</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":41 }}></span><span className="mz-spark" style={{ "--h":37 }}></span><span className="mz-spark" style={{ "--h":37 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":30 }}></span><span className="mz-spark" style={{ "--h":100 }}></span><span className="mz-spark" style={{ "--h":38 }}></span><span className="mz-spark" style={{ "--h":24 }}></span><span className="mz-spark" style={{ "--h":43 }}></span><span className="mz-spark" style={{ "--h":27 }}></span><span className="mz-spark" style={{ "--h":23 }}></span></div>
      </main>
    </div>
  );
}
