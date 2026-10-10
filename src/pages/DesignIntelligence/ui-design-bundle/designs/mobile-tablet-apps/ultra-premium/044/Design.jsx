/**
 * ultra-mobile-tablet-apps-044 — Food ordering flow — Alert-first Advanced
 * Category: mobile-tablet-apps | Tier: Ultra Premium+ | Layout: tabbed-workspace
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-mobile-tablet-apps-044 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--tabs">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <div role="tablist" aria-label="Views">        <button role="tab" aria-selected="true" className="mz-tab">Overview</button>
        <button role="tab" aria-selected="false" className="mz-tab">Settings</button>
        <button role="tab" aria-selected="false" className="mz-tab">History</button></div>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Food ordering flow — Alert-first Advanced</h2>
          <p>Primary content zone with strong hierarchy.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="ultra-mobile-tablet-apps-044" /></section>
        <div className="mz-alert" role="status">
          <strong>Attention:</strong> two records failed validation and were quarantined (sample).
        </div>
      </main>
    </div>
  );
}
