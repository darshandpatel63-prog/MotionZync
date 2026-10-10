/**
 * premium-games-hud-menus-096 — Multiplayer lobby roster — Empty-state Asymmetric
 * Category: games-hud-menus | Tier: Premium | Layout: bento-modular
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-games-hud-menus-096 mz-density--roomy" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--topbar">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul aria-label="Primary">          <li><a href="#" className="mz-navlink is-active">Archive</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li></ul>
        <button type="button" className="mz-btn mz-btn--primary">New entry</button>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Multiplayer lobby roster — Empty-state Asymmetric</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-games-hud-menus-096" /></section>
        <div className="mz-empty">
          <div className="mz-empty__art" aria-hidden="true"></div>
          <h3>Nothing here yet</h3>
          <p>Add your first item to see this view come alive. All data shown is fictional.</p>
          <button type="button" className="mz-btn mz-btn--primary">Get started</button>
        </div>
      </main>
    </div>
  );
}
