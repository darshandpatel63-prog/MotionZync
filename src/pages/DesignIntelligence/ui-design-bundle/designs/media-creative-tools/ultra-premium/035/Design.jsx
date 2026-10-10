/**
 * ultra-media-creative-tools-035 — Media asset browser — Compare Advanced
 * Category: media-creative-tools | Tier: Ultra Premium+ | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-media-creative-tools-035 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Archive</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li>
          <li><a href="#" className="mz-navlink">Activity</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="ultra-media-creative-tools-035" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Media asset browser — Compare Advanced</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="ultra-media-creative-tools-035" />
          </section>
        </div>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">48%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">78%</p></div>
        </section>
      </main>
    </div>
  );
}
