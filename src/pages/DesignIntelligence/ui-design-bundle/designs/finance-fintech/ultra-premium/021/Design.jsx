/**
 * ultra-finance-fintech-021 — Invoice composer studio — Standard Advanced
 * Category: finance-fintech | Tier: Ultra Premium+ | Layout: playful-story
 * Sample data is fictional. Themes: light, dark, colorful (semantic tokens).
 */
import React from "react";
import "./design.css";
import {PARAGRAPHS} from "../../../../shared/parts/GeneratedParts.jsx";

export default function Design() {
  return (
    <div className="mz-root mz-ultra-finance-fintech-021 mz-density--default" data-motion="purposeful-reduced-motion-aware">
      <header className="mz-nav mz-nav--minimal">
        <div className="mz-brand"><span aria-hidden="true">◆</span> MotionZync</div>
        <button type="button" className="mz-btn mz-btn--ghost">Menu</button>
      </header>
      <main className="mz-main">
        <article className="mz-article">
          <header><p className="mz-kicker">Guide</p><h2>Invoice composer studio — Standard Advanced</h2></header>
          <p className="mz-lede">An editorial layout that lets the content breathe.</p>
          <PARAGRAPHS seed="ultra-finance-fintech-021" />
        </article>

      </main>
    </div>
  );
}
