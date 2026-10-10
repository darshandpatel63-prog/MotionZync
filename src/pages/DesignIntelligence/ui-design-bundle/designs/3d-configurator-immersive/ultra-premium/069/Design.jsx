/**
 * ultra-3d-configurator-immersive-069 — Furniture AR preview — Data-dense Advanced
 * Category: 3d-configurator-immersive | Tier: Ultra Premium+ | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-3d-configurator-immersive-069 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Furniture AR preview — Data-dense Advanced</h2>
          <p>Live overview for the current period.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="ultra-3d-configurator-immersive-069" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="ultra-3d-configurator-immersive-069" />
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Retention summary</h3>
            <p className="mz-metric">525%</p>
            <p className="mz-note">Demo metric — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Conversion trend</h3>
            <p className="mz-metric">966%</p>
            <p className="mz-note">Sample data — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Revenue summary</h3>
            <p className="mz-metric">727k</p>
            <p className="mz-note">Demo metric — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":55 }}></span><span className="mz-spark" style={{ "--h":35 }}></span><span className="mz-spark" style={{ "--h":28 }}></span><span className="mz-spark" style={{ "--h":74 }}></span><span className="mz-spark" style={{ "--h":93 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":80 }}></span><span className="mz-spark" style={{ "--h":73 }}></span><span className="mz-spark" style={{ "--h":84 }}></span><span className="mz-spark" style={{ "--h":93 }}></span><span className="mz-spark" style={{ "--h":83 }}></span></div>
      </main>
    </div>
  );
}
