/**
 * premium-travel-hospitality-booking-054 — Loyalty rewards wallet — Alert-first Master-Detail
 * Category: travel-hospitality-booking | Tier: Premium | Layout: split-pane
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {CARDS2, ROWS5} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-travel-hospitality-booking-054 mz-density--default" data-motion="none">
      <nav className="mz-nav mz-nav--sidebar" aria-label="Primary">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <ul>          <li><a href="#" className="mz-navlink is-active">Overview</a></li>
          <li><a href="#" className="mz-navlink">Explore</a></li>
          <li><a href="#" className="mz-navlink">Settings</a></li>
          <li><a href="#" className="mz-navlink">Saved</a></li></ul>
      </nav>
      <main className="mz-main">
        <div className="mz-split">
          <section className="mz-split__list" aria-label="List"><ROWS5 seed="premium-travel-hospitality-booking-054" /></section>
          <section className="mz-split__detail" aria-label="Detail">
            <h2>Loyalty rewards wallet — Alert-first Master-Detail</h2>
            <p>Detail view with actions and history.</p>
            <CARDS2 seed="premium-travel-hospitality-booking-054" />
          </section>
        </div>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> two records failed validation and were quarantined (sample).
        </div>
      </main>
    </div>
  );
}
