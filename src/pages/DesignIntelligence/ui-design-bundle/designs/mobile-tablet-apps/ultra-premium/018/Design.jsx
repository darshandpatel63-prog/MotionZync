/**
 * ultra-mobile-tablet-apps-018 — Chat conversation screen — Collaborative Advanced
 * Category: mobile-tablet-apps | Tier: Ultra Premium+ | Layout: table-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TABLEROWS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-mobile-tablet-apps-018 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">New entry</button>
      </header>
      <main className="mz-main">
        <div className="mz-toolbar" role="toolbar" aria-label="Table tools">
          <input className="mz-input" type="search" aria-label="Search rows" placeholder="Search…" />
          <button type="button" className="mz-btn">Filter</button>
          <button type="button" className="mz-btn mz-btn--primary">New record</button>
        </div>
        <table className="mz-table">
          <caption className="mz-sr-only">Chat conversation screen — Collaborative Advanced</caption>
          <thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Owner</th><th scope="col">Updated</th></tr></thead>
          <tbody><TABLEROWS seed="ultra-mobile-tablet-apps-018" /></tbody>
        </table>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>3 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>M. Chen (sample)</strong> closed a task <time>2h ago</time></li>
            <li><strong>S. Novak (sample)</strong> added a file <time>2h ago</time></li>
            <li><strong>M. Chen (sample)</strong> commented on a record <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
