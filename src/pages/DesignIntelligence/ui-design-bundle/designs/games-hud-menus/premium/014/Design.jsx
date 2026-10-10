/**
 * premium-games-hud-menus-014 — In-game HUD overlay — Alert-first Multi-Monitor
 * Category: games-hud-menus | Tier: Premium | Layout: command-center
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-games-hud-menus-014 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">In-game HUD overlay — Alert-first Multi-Monitor</h2>
          <p>Operational summary with drill-down.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="premium-games-hud-menus-014" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="premium-games-hud-menus-014" />
        </section>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> usage is at 82% of the current plan limit (fictional).
        </div>
      </main>
    </div>
  );
}
