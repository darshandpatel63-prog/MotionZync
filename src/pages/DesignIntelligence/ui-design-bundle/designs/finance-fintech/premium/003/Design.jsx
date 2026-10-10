/**
 * premium-finance-fintech-003 — Budget envelope planner — Expanded Top
 * Category: finance-fintech | Tier: Premium | Layout: topbar-flow
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-finance-fintech-003 mz-density--roomy" data-motion="none">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Archive</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Create</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Budget envelope planner — Expanded Top</h2>
          <p>A clear headline area with the key action up front.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-finance-fintech-003" /></section>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>The north region outperforms forecast by 12% (demo).</p>
        </aside>
      </main>
    </div>
  );
}
