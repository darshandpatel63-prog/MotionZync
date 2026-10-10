/**
 * premium-mobile-tablet-apps-043 — Food ordering flow — Expanded Tabbed
 * Category: mobile-tablet-apps | Tier: Premium | Layout: tabbed-workspace
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {BENTO} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-mobile-tablet-apps-043 mz-density--roomy" data-motion="none">
      <header className="mz-nav mz-nav--tabs">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <div role="tablist" aria-label="Views">        <button role="tab" aria-selected="true" className="mz-tab">Details</button>
        <button role="tab" aria-selected="false" className="mz-tab">Members</button>
        <button role="tab" aria-selected="false" className="mz-tab">History</button></div>
      </header>
      <main className="mz-main">
        <section className="mz-panel mz-panel--hero" aria-labelledby="t1">
          <h2 id="t1">Food ordering flow — Expanded Tabbed</h2>
          <p>Hero surface summarising the current context.</p>
          <button type="button" className="mz-btn mz-btn--primary">Primary action</button>
        </section>
        <section className="mz-bento" aria-label="Modules"><BENTO seed="premium-mobile-tablet-apps-043" /></section>
        <aside className="mz-insight" aria-label="Insight">
          <h3>Key insight</h3>
          <p>Retention rose 4% after the onboarding change (sample data).</p>
        </aside>
      </main>
    </div>
  );
}
