/**
 * premium-games-hud-menus-093 — Multiplayer lobby roster — Expanded Asymmetric
 * Category: games-hud-menus | Tier: Premium | Layout: bento-modular
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-games-hud-menus-093 mz-density--roomy" data-motion="none">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">New entry</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Multiplayer lobby roster — Expanded Asymmetric</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-games-hud-menus-093" /></section>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>Three items need review before the weekly sync.</p>
        </aside>
      </main>
    </div>
  );
}
