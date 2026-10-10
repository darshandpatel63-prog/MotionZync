/**
 * ultra-data-viz-monitoring-075 — Incident timeline replay — Compare Advanced
 * Category: data-viz-monitoring | Tier: Ultra Premium+ | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-data-viz-monitoring-075 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Library</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="ultra-data-viz-monitoring-075" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Incident timeline replay — Compare Advanced</h2>
            <p>Deep-dive surface for the selected record.</p>
            <CARDS2 seed="ultra-data-viz-monitoring-075" />
          </section>
        </div>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">51%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">47%</p></div>
        </section>
      </main>
    </div>
  );
}
