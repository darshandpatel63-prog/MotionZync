/**
 * premium-mobile-tablet-apps-055 — Mobile banking summary — Compare Single
 * Category: mobile-tablet-apps | Tier: Premium | Layout: editorial-column
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-mobile-tablet-apps-055 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Deep dive</p><h2>Mobile banking summary — Compare Single</h2></header>
          <p className="mz-lede">A considered take on the topic, written for readers first.</p>
          <PARAGRAPHS seed="premium-mobile-tablet-apps-055" />
        </article>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">15%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">77%</p></div>
        </section>
      </main>
    </div>
  );
}
