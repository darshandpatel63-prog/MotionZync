/**
 * ultra-games-hud-menus-042 — Skill tree constellation — Compact Advanced
 * Category: games-hud-menus | Tier: Ultra Premium+ | Layout: sidebar-command
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-games-hud-menus-042 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Saved</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Skill tree constellation — Compact Advanced</h2>
          <p>Live overview for the current period.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="ultra-games-hud-menus-042" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="ultra-games-hud-menus-042" />
        </section>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">Active</button>
          <button type="button" className="mz-chip" aria-pressed="false">Archived</button>
          <button type="button" className="mz-chip" aria-pressed="false">Flagged</button>
          <button type="button" className="mz-chip" aria-pressed="false">All</button>
        </div>
      </main>
    </div>
  );
}
