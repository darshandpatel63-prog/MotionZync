/**
 * ultra-saas-admin-workspaces-068 — Inbox triage workspace — Collaborative Advanced
 * Category: saas-admin-workspaces | Tier: Ultra Premium+ | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-saas-admin-workspaces-068 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Members</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Inbox triage workspace — Collaborative Advanced</h2>
          <p>Snapshot of what needs attention today.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="ultra-saas-admin-workspaces-068" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="ultra-saas-admin-workspaces-068" />
        </section>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>9 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>T. Berg (sample)</strong> added a file <time>2h ago</time></li>
            <li><strong>S. Novak (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> commented on a record <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
