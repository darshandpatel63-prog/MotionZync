/**
 * ultra-saas-admin-workspaces-008 — Team member directory — Collaborative Advanced
 * Category: saas-admin-workspaces | Tier: Ultra Premium+ | Layout: topbar-flow
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-saas-admin-workspaces-008 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Upgrade flow</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Team member directory — Collaborative Advanced</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-saas-admin-workspaces-008" /></section>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>8 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>J. Okafor (sample)</strong> commented on a record <time>2h ago</time></li>
            <li><strong>T. Berg (sample)</strong> added a file <time>2h ago</time></li>
            <li><strong>A. Rivera (sample)</strong> approved a change <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
