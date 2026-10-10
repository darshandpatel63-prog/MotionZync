/**
 * premium-healthcare-wellness-019 — Patient visit summary — Data-dense Multi-Monitor
 * Category: healthcare-wellness | Tier: Premium | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-019 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Library</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Patient visit summary — Data-dense Multi-Monitor</h2>
          <p>Live overview for the current period.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="premium-healthcare-wellness-019" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="premium-healthcare-wellness-019" />
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Velocity trend</h3>
            <p className="mz-metric">721</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Uptime trend</h3>
            <p className="mz-metric">334%</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput breakdown</h3>
            <p className="mz-metric">380ms</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":45 }}></span><span className="mz-spark" style={{ "--h":66 }}></span><span className="mz-spark" style={{ "--h":21 }}></span><span className="mz-spark" style={{ "--h":94 }}></span><span className="mz-spark" style={{ "--h":22 }}></span><span className="mz-spark" style={{ "--h":83 }}></span><span className="mz-spark" style={{ "--h":47 }}></span><span className="mz-spark" style={{ "--h":82 }}></span><span className="mz-spark" style={{ "--h":87 }}></span><span className="mz-spark" style={{ "--h":71 }}></span><span className="mz-spark" style={{ "--h":39 }}></span><span className="mz-spark" style={{ "--h":59 }}></span></div>
      </main>
    </div>
  );
}
