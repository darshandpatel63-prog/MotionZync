/**
 * premium-dashboards-analytics-018 — Revenue funnel drill-down — Collaborative Multi-Monitor
 * Category: dashboards-analytics | Tier: Premium | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-dashboards-analytics-018 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Explore</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Revenue funnel drill-down — Collaborative Multi-Monitor</h2>
          <p>Live overview for the current period.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="premium-dashboards-analytics-018" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="premium-dashboards-analytics-018" />
        </section>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>4 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>S. Novak (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>A. Rivera (sample)</strong> closed a task <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> commented on a record <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
