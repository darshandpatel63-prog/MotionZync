/**
 * premium-travel-hospitality-booking-055 — Loyalty rewards wallet — Compare Master-Detail
 * Category: travel-hospitality-booking | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-travel-hospitality-booking-055 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Activity</a></li>
          <li><a href="#" className="mz-navlink">Archive</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-travel-hospitality-booking-055" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Loyalty rewards wallet — Compare Master-Detail</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="premium-travel-hospitality-booking-055" />
          </section>
        </div>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">82%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">96%</p></div>
        </section>
      </main>
    </div>
  );
}
