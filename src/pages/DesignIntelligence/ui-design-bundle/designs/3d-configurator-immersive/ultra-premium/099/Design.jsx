/**
 * ultra-3d-configurator-immersive-099 — Exhibit booth designer — Data-dense Advanced
 * Category: 3d-configurator-immersive | Tier: Ultra Premium+ | Layout: sidebar-command
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-3d-configurator-immersive-099 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Members</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Exhibit booth designer — Data-dense Advanced</h2>
          <p>Operational summary with drill-down.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="ultra-3d-configurator-immersive-099" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="ultra-3d-configurator-immersive-099" />
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Latency overview</h3>
            <p className="mz-metric">877k</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Latency summary</h3>
            <p className="mz-metric">301</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Throughput breakdown</h3>
            <p className="mz-metric">155%</p>
            <p className="mz-note">Fictional value — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":96 }}></span><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":30 }}></span><span className="mz-spark" style={{ "--h":25 }}></span><span className="mz-spark" style={{ "--h":57 }}></span><span className="mz-spark" style={{ "--h":70 }}></span><span className="mz-spark" style={{ "--h":55 }}></span><span className="mz-spark" style={{ "--h":70 }}></span><span className="mz-spark" style={{ "--h":45 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":64 }}></span></div>
      </main>
    </div>
  );
}
