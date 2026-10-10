/**
 * premium-media-creative-tools-015 — Video timeline editor — Compare Vertical
 * Category: media-creative-tools | Tier: Premium | Layout: timeline-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TIMELINEITEMS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-media-creative-tools-015 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <h2 className="mz-timeline-title">Video timeline editor — Compare Vertical</h2>
        <ol className="mz-timeline"><TIMELINEITEMS seed="premium-media-creative-tools-015" /></ol>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">70%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">94%</p></div>
        </section>
      </main>
    </div>
  );
}
