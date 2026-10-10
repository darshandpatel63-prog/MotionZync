/**
 * premium-dashboards-analytics-005 — Executive KPI overview — Compare Single
 * Category: dashboards-analytics | Tier: Premium | Layout: editorial-column
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-dashboards-analytics-005 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Guide</p><h2>Executive KPI overview — Compare Single</h2></header>
          <p className="mz-lede">An editorial layout that lets the content breathe.</p>
          <PARAGRAPHS seed="premium-dashboards-analytics-005" />
        </article>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">52%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">16%</p></div>
        </section>
      </main>
    </div>
  );
}
