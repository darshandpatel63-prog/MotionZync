/**
 * premium-mobile-tablet-apps-072 — Music mini player — Compact Mobile-First
 * Category: mobile-tablet-apps | Tier: Premium | Layout: bottom-nav-touch
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-mobile-tablet-apps-072 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--bottom" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Explore</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Music mini player — Compact Mobile-First</h2>
          <p>A clear headline area with the key action up front.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-mobile-tablet-apps-072" /></section>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">Flagged</button>
          <button type="button" className="mz-chip" aria-pressed="false">Mine</button>
          <button type="button" className="mz-chip" aria-pressed="false">All</button>
          <button type="button" className="mz-chip" aria-pressed="false">This week</button>
        </div>
      </main>
    </div>
  );
}
