/**
 * ultra-data-viz-monitoring-031 — Geo metric heatmap — Standard Advanced
 * Category: data-viz-monitoring | Tier: Ultra Premium+ | Layout: card-grid
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS6} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-data-viz-monitoring-031 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--rail" aria-label="Primary">
        <ul>          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
      </nav>
      <main className="mz-main">
        <section className="mz-gridhead">
          <h2>Geo metric heatmap — Standard Advanced</h2>
          <p>Browse, filter and compare items in this collection.</p>
        </section>
        <section className="mz-cardgrid" aria-label="Items"><CARDS6 seed="ultra-data-viz-monitoring-031" /></section>

      </main>
    </div>
  );
}
