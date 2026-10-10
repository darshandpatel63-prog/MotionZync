/**
 * premium-3d-configurator-immersive-082 — Garden landscape builder — Compact Responsive
 * Category: 3d-configurator-immersive | Tier: Premium | Layout: card-grid
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS6} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-3d-configurator-immersive-082 mz-density--compact" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-gridhead">
          <h2>Garden landscape builder — Compact Responsive</h2>
          <p>Browse, filter and compare items in this collection.</p>
        </section>
        <section className="mz-cardgrid" aria-label="Items"><CARDS6 seed="premium-3d-configurator-immersive-082" /></section>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">This week</button>
          <button type="button" className="mz-chip" aria-pressed="false">All</button>
          <button type="button" className="mz-chip" aria-pressed="false">Archived</button>
          <button type="button" className="mz-chip" aria-pressed="false">Active</button>
        </div>
      </main>
    </div>
  );
}
