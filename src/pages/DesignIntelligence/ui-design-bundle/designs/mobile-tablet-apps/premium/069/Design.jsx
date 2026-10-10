/**
 * premium-mobile-tablet-apps-069 — Travel companion day view — Data-dense Multi-Monitor
 * Category: mobile-tablet-apps | Tier: Premium | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-mobile-tablet-apps-069 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Explore</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Travel companion day view — Data-dense Multi-Monitor</h2>
          <p>Live overview for the current period.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="premium-mobile-tablet-apps-069" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="premium-mobile-tablet-apps-069" />
        </section>
        <section className="mz-stats" aria-label="Key metrics">
                    <article className="mz-stat">
            <h3>Engagement breakdown</h3>
            <p className="mz-metric">922</p>
            <p className="mz-note">Demo metric — flat vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Coverage breakdown</h3>
            <p className="mz-metric">87ms</p>
            <p className="mz-note">Fictional value — up vs last period</p>
          </article>
          <article className="mz-stat">
            <h3>Retention breakdown</h3>
            <p className="mz-metric">986ms</p>
            <p className="mz-note">Sample data — up vs last period</p>
          </article>
        </section>
        <div className="mz-sparks" aria-hidden="true"><span className="mz-spark" style={{ "--h":82 }}></span><span className="mz-spark" style={{ "--h":93 }}></span><span className="mz-spark" style={{ "--h":25 }}></span><span className="mz-spark" style={{ "--h":98 }}></span><span className="mz-spark" style={{ "--h":68 }}></span><span className="mz-spark" style={{ "--h":91 }}></span><span className="mz-spark" style={{ "--h":47 }}></span><span className="mz-spark" style={{ "--h":45 }}></span><span className="mz-spark" style={{ "--h":45 }}></span><span className="mz-spark" style={{ "--h":62 }}></span><span className="mz-spark" style={{ "--h":29 }}></span><span className="mz-spark" style={{ "--h":85 }}></span></div>
      </main>
    </div>
  );
}
