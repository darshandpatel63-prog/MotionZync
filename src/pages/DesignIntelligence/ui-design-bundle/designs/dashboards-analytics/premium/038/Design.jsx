/**
 * premium-dashboards-analytics-038 — Realtime ops pulse — Collaborative Responsive
 * Category: dashboards-analytics | Tier: Premium | Layout: card-grid
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS6} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-dashboards-analytics-038 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Members</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-gridhead">
          <h2>Realtime ops pulse — Collaborative Responsive</h2>
          <p>Browse, filter and compare items in this collection.</p>
        </section>
        <section className="mz-cardgrid" aria-label="Items"><CARDS6 seed="premium-dashboards-analytics-038" /></section>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>4 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>A. Rivera (sample)</strong> closed a task <time>2h ago</time></li>
            <li><strong>A. Rivera (sample)</strong> added a file <time>2h ago</time></li>
            <li><strong>S. Novak (sample)</strong> commented on a record <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
