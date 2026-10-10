/**
 * premium-desktop-productivity-038 — Spreadsheet analysis sheet — Collaborative Master-Detail
 * Category: desktop-productivity | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-desktop-productivity-038 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Library</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-desktop-productivity-038" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Spreadsheet analysis sheet — Collaborative Master-Detail</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="premium-desktop-productivity-038" />
          </section>
        </div>
        <div className="mz-presence" aria-label="People online">
          <span className="mz-avatar" aria-hidden="true">AR</span><span className="mz-avatar" aria-hidden="true">JO</span><span className="mz-avatar" aria-hidden="true">MC</span><span>7 collaborators online</span>
        </div>
        <aside className="mz-activity" aria-label="Recent activity">
          <h3>Activity</h3>
          <ul>            <li><strong>J. Okafor (sample)</strong> approved a change <time>2h ago</time></li>
            <li><strong>L. Haddad (sample)</strong> closed a task <time>2h ago</time></li>
            <li><strong>J. Okafor (sample)</strong> added a file <time>2h ago</time></li></ul>
        </aside>
      </main>
    </div>
  );
}
