/**
 * premium-editorial-portfolio-creator-013 — Photography portfolio grid — Expanded Multi-Monitor
 * Category: editorial-portfolio-creator | Tier: Premium | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-editorial-portfolio-creator-013 mz-density--roomy" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Photography portfolio grid — Expanded Multi-Monitor</h2>
          <p>Snapshot of what needs attention today.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="premium-editorial-portfolio-creator-013" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="premium-editorial-portfolio-creator-013" />
        </section>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>The north region outperforms forecast by 12% (demo).</p>
        </aside>
      </main>
    </div>
  );
}
