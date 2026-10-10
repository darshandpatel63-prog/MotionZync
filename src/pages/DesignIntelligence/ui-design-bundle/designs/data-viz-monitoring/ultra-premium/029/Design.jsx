/**
 * ultra-data-viz-monitoring-029 — Trace waterfall viewer — Data-dense Advanced
 * Category: data-viz-monitoring | Tier: Ultra Premium+ | Layout: bottom-nav-touch
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-data-viz-monitoring-029 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--bottom" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Saved</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Trace waterfall viewer — Data-dense Advanced</h2>
          <p>A clear headline area with the key action up front.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-data-viz-monitoring-029" /></section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Uptime breakdown</h3>
            <p className="mz-metric">60%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Accuracy trend</h3>
            <p className="mz-metric">840ms</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Engagement overview</h3>
            <p className="mz-metric">375</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":41 }}></span><span className="mz-spark" style={{ "--h":60 }}></span><span className="mz-spark" style={{ "--h":58 }}></span><span className="mz-spark" style={{ "--h":82 }}></span><span className="mz-spark" style={{ "--h":51 }}></span><span className="mz-spark" style={{ "--h":91 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":79 }}></span><span className="mz-spark" style={{ "--h":37 }}></span><span className="mz-spark" style={{ "--h":91 }}></span><span className="mz-spark" style={{ "--h":56 }}></span><span className="mz-spark" style={{ "--h":56 }}></span></div>
      </main>
    </div>
  );
}
