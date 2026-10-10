/**
 * premium-desktop-productivity-034 — Spreadsheet analysis sheet — Alert-first Master-Detail
 * Category: desktop-productivity | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-desktop-productivity-034 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Saved</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-desktop-productivity-034" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Spreadsheet analysis sheet — Alert-first Master-Detail</h2>
            <p>Deep-dive surface for the selected record.</p>
            <CARDS2 seed="premium-desktop-productivity-034" />
          </section>
        </div>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> two records failed validation and were quarantined (sample).
        </div>
      </main>
    </div>
  );
}
