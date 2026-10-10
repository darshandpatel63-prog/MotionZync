/**
 * premium-marketing-landing-pages-032 — Webinar signup landing — Compact Vertical
 * Category: marketing-landing-pages | Tier: Premium | Layout: timeline-first
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {TIMELINEITEMS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-marketing-landing-pages-032 mz-density--compact" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <h2 className="mz-timeline-title">Webinar signup landing — Compact Vertical</h2>
        <ol className="mz-timeline"><TIMELINEITEMS seed="premium-marketing-landing-pages-032" /></ol>
        <div className="mz-chips" role="group" aria-label="Filters">
                    <button type="button" className="mz-chip" aria-pressed="true">Mine</button>
          <button type="button" className="mz-chip" aria-pressed="false">This week</button>
          <button type="button" className="mz-chip" aria-pressed="false">Flagged</button>
          <button type="button" className="mz-chip" aria-pressed="false">Active</button>
        </div>
      </main>
    </div>
  );
}
