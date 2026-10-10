/**
 * premium-dashboards-analytics-078 — Experiment results lab — Collaborative Master-Detail
 * Category: dashboards-analytics | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-dashboards-analytics-078 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Archive</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-dashboards-analytics-078" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Experiment results lab — Collaborative Master-Detail</h2>
            <p>Deep-dive surface for the selected record.</p>
            <CARDS2 seed="premium-dashboards-analytics-078" />
          </section>
        </div>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>3 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>T. Berg (sample)</strong> commented on a record <time>2h ago</time></li>
            <li><strong>A. Rivera (sample)</strong> closed a task <time>2h ago</time></li>
            <li><strong>S. Novak (sample)</strong> approved a change <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
