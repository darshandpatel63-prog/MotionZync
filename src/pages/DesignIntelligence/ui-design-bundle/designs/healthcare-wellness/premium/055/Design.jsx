/**
 * premium-healthcare-wellness-055 — Lab results explorer — Compare Vertical
 * Category: healthcare-wellness | Tier: Premium | Layout: timeline-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TIMELINEITEMS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-healthcare-wellness-055 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <h2 className="mz-timeline-title">Lab results explorer — Compare Vertical</h2>
        <ol className="mz-timeline"><TIMELINEITEMS seed="premium-healthcare-wellness-055" /></ol>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">41%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">44%</p></div>
        </section>
      </main>
    </div>
  );
}
