/**
 * ultra-desktop-productivity-040 — Spreadsheet analysis sheet — Narrative Advanced
 * Category: desktop-productivity | Tier: Ultra Premium+ | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-desktop-productivity-040 mz-density--roomy" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Archive</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Overview</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="ultra-desktop-productivity-040" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Spreadsheet analysis sheet — Narrative Advanced</h2>
            <p>Deep-dive surface for the selected record.</p>
            <CARDS2 seed="ultra-desktop-productivity-040" />
          </section>
        </div>
        <section className="mz-story">
          <h3>The thinking behind it</h3>
          <p>A supporting narrative block that adds editorial depth without overwhelming the primary content. Sample copy only.</p>
        </section>
        <blockquote className="mz-quote">
          <p>This finally made the workflow click for our whole team.</p>
          <cite>— Sample customer (fictional)</cite>
        </blockquote>
      </main>
    </div>
  );
}
