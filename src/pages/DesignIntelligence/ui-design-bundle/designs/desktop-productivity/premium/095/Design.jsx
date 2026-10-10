/**
 * premium-desktop-productivity-095 — Backup sync console — Compare Playful
 * Category: desktop-productivity | Tier: Premium | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-premium-desktop-productivity-095 mz-density--default" data-motion="none">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Feature</p><h2>Backup sync console — Compare Playful</h2></header>
          <p className="mz-lede">An editorial layout that lets the content breathe.</p>
          <PARAGRAPHS seed="premium-desktop-productivity-095" />
        </article>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">33%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">26%</p></div>
        </section>
      </main>
    </div>
  );
}
