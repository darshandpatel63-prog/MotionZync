/**
 * ultra-mobile-tablet-apps-069 — Travel companion day view — Data-dense Advanced
 * Category: mobile-tablet-apps | Tier: Ultra Premium+ | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-mobile-tablet-apps-069 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Explore</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Travel companion day view — Data-dense Advanced</h2>
          <p>Operational summary with drill-down.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="ultra-mobile-tablet-apps-069" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="ultra-mobile-tablet-apps-069" />
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Coverage summary</h3>
            <p className="mz-metric">86</p>
            <p className="mz-note">Fictional value — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Latency trend</h3>
            <p className="mz-metric">231k</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Coverage trend</h3>
            <p className="mz-metric">262k</p>
            <p className="mz-note">Sample data — down vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":69 }}></span><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":37 }}></span><span className="mz-spark" style={{ "--h":59 }}></span><span className="mz-spark" style={{ "--h":43 }}></span><span className="mz-spark" style={{ "--h":52 }}></span><span className="mz-spark" style={{ "--h":54 }}></span><span className="mz-spark" style={{ "--h":62 }}></span><span className="mz-spark" style={{ "--h":61 }}></span><span className="mz-spark" style={{ "--h":53 }}></span><span className="mz-spark" style={{ "--h":97 }}></span><span className="mz-spark" style={{ "--h":23 }}></span></div>
      </main>
    </div>
  );
}
