/**
 * ultra-finance-fintech-055 — Loan payoff simulator — Compare Advanced
 * Category: finance-fintech | Tier: Ultra Premium+ | Layout: editorial-column
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-finance-fintech-055 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Deep dive</p><h2>Loan payoff simulator — Compare Advanced</h2></header>
          <p className="mz-lede">An editorial layout that lets the content breathe.</p>
          <PARAGRAPHS seed="ultra-finance-fintech-055" />
        </article>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">65%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">29%</p></div>
        </section>
      </main>
    </div>
  );
}
