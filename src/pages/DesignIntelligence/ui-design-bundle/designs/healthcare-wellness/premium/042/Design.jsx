/**
 * premium-healthcare-wellness-042 — Clinic intake form — Compact Fixed
 * Category: healthcare-wellness | Tier: Premium | Layout: sidebar-command
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS4, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-042 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Library</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Clinic intake form — Compact Fixed</h2>
          <p>Snapshot of what needs attention today.</p>
        </section>
        <section className="mz-panel mz-panel--grid" aria-label="Detail panels">
          <CARDS4 seed="premium-healthcare-wellness-042" />
        </section>
        <section className="mz-panel mz-panel--list" aria-label="Queue">
          <ROWS5 seed="premium-healthcare-wellness-042" />
        </section>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">All</button>
          <button type="button" className="mz-chip" aria-pressed="false">Active</button>
          <button type="button" className="mz-chip" aria-pressed="false">This week</button>
          <button type="button" className="mz-chip" aria-pressed="false">Flagged</button>
        </div>
      </main>
    </div>
  );
}
