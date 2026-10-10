/**
 * premium-desktop-productivity-074 — Note knowledge graph — Alert-first Top
 * Category: desktop-productivity | Tier: Premium | Layout: topbar-flow
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-desktop-productivity-074 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Explore</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">Start</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Note knowledge graph — Alert-first Top</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-desktop-productivity-074" /></section>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> usage is at 82% of the current plan limit (fictional).
        </div>
      </main>
    </div>
  );
}
