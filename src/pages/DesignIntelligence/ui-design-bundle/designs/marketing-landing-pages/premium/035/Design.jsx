/**
 * premium-marketing-landing-pages-035 — Webinar signup landing — Compare Vertical
 * Category: marketing-landing-pages | Tier: Premium | Layout: timeline-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TIMELINEITEMS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-marketing-landing-pages-035 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <h2 className="mz-timeline-title">Webinar signup landing — Compare Vertical</h2>
        <ol className="mz-timeline"><TIMELINEITEMS seed="premium-marketing-landing-pages-035" /></ol>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">14%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">35%</p></div>
        </section>
      </main>
    </div>
  );
}
