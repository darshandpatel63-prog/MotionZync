/**
 * ultra-media-creative-tools-095 — Publishing schedule planner — Compare Advanced
 * Category: media-creative-tools | Tier: Ultra Premium+ | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-media-creative-tools-095 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Guide</p><h2>Publishing schedule planner — Compare Advanced</h2></header>
          <p className="mz-lede">Designed for long, comfortable reading sessions.</p>
          <PARAGRAPHS seed="ultra-media-creative-tools-095" />
        </article>
        <section className="mz-compare" aria-label="Comparison">
                    <div className="mz-compare__card"><h4>Option A</h4><p className="mz-metric">91%</p></div>
          <div className="mz-compare__card"><h4>Option B</h4><p className="mz-metric">70%</p></div>
        </section>
      </main>
    </div>
  );
}
