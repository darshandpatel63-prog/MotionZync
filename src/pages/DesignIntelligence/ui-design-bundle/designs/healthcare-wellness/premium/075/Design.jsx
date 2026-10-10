/**
 * premium-healthcare-wellness-075 — Care team messaging — Compare Master-Detail
 * Category: healthcare-wellness | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-075 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Explore</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li>
          <li><a href="#" className="mz-navlink">Reports</a></li>
          <li><a href="#" className="mz-navlink">Members</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-healthcare-wellness-075" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Care team messaging — Compare Master-Detail</h2>
            <p>Deep-dive surface for the selected record.</p>
            <CARDS2 seed="premium-healthcare-wellness-075" />
          </section>
        </div>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">45%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">77%</p></div>
        </section>
      </main>
    </div>
  );
}
