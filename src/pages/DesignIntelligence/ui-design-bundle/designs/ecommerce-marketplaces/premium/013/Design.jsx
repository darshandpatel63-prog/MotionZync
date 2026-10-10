/**
 * premium-ecommerce-marketplaces-013 — Category catalog browser — Expanded Responsive
 * Category: ecommerce-marketplaces | Tier: Premium | Layout: card-grid
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS6} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-ecommerce-marketplaces-013 mz-density--roomy" data-motion="none">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Settings</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Library</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-gridhead">
          <h2>Category catalog browser — Expanded Responsive</h2>
          <p>Browse, filter and compare items in this collection.</p>
        </section>
        <section className="mz-cardgrid" aria-label="Items"><CARDS6 seed="premium-ecommerce-marketplaces-013" /></section>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>The north region outperforms forecast by 12% (demo).</p>
        </aside>
      </main>
    </div>
  );
}
