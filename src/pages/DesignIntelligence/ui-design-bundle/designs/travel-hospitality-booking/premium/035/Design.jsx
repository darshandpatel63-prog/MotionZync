/**
 * premium-travel-hospitality-booking-035 — Destination discovery board — Compare Vertical
 * Category: travel-hospitality-booking | Tier: Premium | Layout: timeline-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TIMELINEITEMS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-travel-hospitality-booking-035 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <h2 className="mz-timeline-title">Destination discovery board — Compare Vertical</h2>
        <ol className="mz-timeline"><TIMELINEITEMS seed="premium-travel-hospitality-booking-035" /></ol>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">69%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">89%</p></div>
        </section>
      </main>
    </div>
  );
}
